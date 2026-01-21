import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    photo_url: string;
    is_active: boolean;
}

export const TeamManager: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<TeamMember | null>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        const { data } = await supabase.from('team').select('*').order('created_at');
        setTeam(data || []);
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;

        const { error } = await supabase.from('team').upsert(isEditing);
        if (!error) {
            setIsEditing(null);
            fetchTeam();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza?')) {
            await supabase.from('team').delete().eq('id', id);
            fetchTeam();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Equipe</h1>
                    <p className="text-slate-400">Adicione ou remova membros do time da rádio.</p>
                </div>
                <button
                    onClick={() => setIsEditing({ name: '', role: '', photo_url: '', is_active: true })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Novo Membro
                </button>
            </div>

            {/* Form Modal (Simple Inline for speed) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Novo'} Membro</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <input
                                className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                placeholder="Nome"
                                value={isEditing.name}
                                onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                                required
                            />
                            <input
                                className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                placeholder="Cargo (ex: Locutor, DJ)"
                                value={isEditing.role}
                                onChange={e => setIsEditing({ ...isEditing, role: e.target.value })}
                                required
                            />
                            <input
                                className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                placeholder="URL da Foto"
                                value={isEditing.photo_url}
                                onChange={e => setIsEditing({ ...isEditing, photo_url: e.target.value })}
                            />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-white">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map(member => (
                    <div key={member.id} className="glass-panel p-4 flex flex-col gap-3 group relative">
                        <div className="flex items-center gap-3">
                            <img src={member.photo_url || '/default-avatar.png'} className="size-12 rounded-full object-cover bg-white/5" />
                            <div>
                                <h3 className="font-bold text-white">{member.name}</h3>
                                <p className="text-xs text-primary font-bold uppercase">{member.role}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(member)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">edit</span></button>
                            <button onClick={() => handleDelete(member.id!)} className="text-red-400 hover:text-red-300"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
