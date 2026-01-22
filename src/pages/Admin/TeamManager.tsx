import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface TeamMember {
    id?: string;
    name: string;
    role: string;
    photo_url: string;
    bio?: string;
    social_instagram?: string;
    social_facebook?: string;
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

        const payload = {
            name: isEditing.name,
            role: isEditing.role,
            photo_url: isEditing.photo_url || null,
            bio: isEditing.bio || null,
            social_instagram: isEditing.social_instagram || null,
            social_facebook: isEditing.social_facebook || null,
            is_active: isEditing.is_active
        };

        let result;

        if (isEditing.id) {
            result = await supabase
                .from('team')
                .update(payload)
                .eq('id', isEditing.id);
        } else {
            result = await supabase
                .from('team')
                .insert([payload]);
        }

        if (result.error) {
            console.error('Erro ao salvar:', result.error);
            alert('Erro ao salvar: ' + result.error.message);
        } else {
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
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Equipe</h1>
                    <p className="text-slate-400">Adicione ou remova membros do time da rádio.</p>
                </div>
                <button
                    onClick={() => setIsEditing({ name: '', role: '', photo_url: '', bio: '', social_instagram: '', social_facebook: '', is_active: true })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Novo Membro
                </button>
            </div>

            {/* Form Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Novo'} Membro</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="Ex: João da Silva"
                                        value={isEditing.name}
                                        onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cargo</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="Ex: Locutor da Manhã"
                                        value={isEditing.role}
                                        onChange={e => setIsEditing({ ...isEditing, role: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto (URL)</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="https://..."
                                    value={isEditing.photo_url}
                                    onChange={e => setIsEditing({ ...isEditing, photo_url: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Recomendado: Imagem quadrada 500x500px.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Biografia</label>
                                <textarea
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="Breve descrição sobre o profissional..."
                                    value={isEditing.bio || ''}
                                    onChange={e => setIsEditing({ ...isEditing, bio: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                        Instagram
                                    </label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="https://instagram.com/usuario"
                                        value={isEditing.social_instagram || ''}
                                        onChange={e => setIsEditing({ ...isEditing, social_instagram: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">public</span>
                                        Facebook
                                    </label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="https://facebook.com/usuario"
                                        value={isEditing.social_facebook || ''}
                                        onChange={e => setIsEditing({ ...isEditing, social_facebook: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
                                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-white hover:scale-105 transition-all">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {team.map(member => (
                    <div key={member.id} className="glass-panel p-4 flex flex-col gap-4 group relative hover:border-primary/50 transition-colors">
                        <div className="aspect-square rounded-xl overflow-hidden bg-black/20">
                            {member.photo_url ? (
                                <img src={member.photo_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <span className="material-symbols-outlined text-4xl">person</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight">{member.name}</h3>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{member.role}</p>
                            {member.bio && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{member.bio}</p>
                            )}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(member)} className="size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                            <button onClick={() => handleDelete(member.id!)} className="size-8 rounded-full bg-black/60 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                    </div>
                ))}

                {team.length === 0 && !isLoading && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                        Nenhum membro da equipe encontrado. Adicione o primeiro!
                    </div>
                )}
            </div>
        </div>
    );
};
