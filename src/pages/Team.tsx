import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    photo_url?: string;
    bio?: string;
    social_instagram?: string;
    social_facebook?: string;
    social_twitter?: string;
    schedule_days?: string[];
    schedule_time?: string;
    is_active: boolean;
}

export const Team: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const { data, error } = await supabase
                .from('team')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setTeam(data || []);
        } catch (error) {
            console.error('❌ Erro ao carregar equipe:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-neon-cyan text-2xl animate-pulse">Carregando equipe...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-neon-cyan mb-2">👥 Nossa Equipe</h1>
                <p className="text-gray-400">Conheça os profissionais que levam louvor e adoração até você</p>
            </div>

            {team.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-neon-magenta mb-4">groups</span>
                    <h2 className="text-2xl font-bold text-white mb-2">Equipe não configurada</h2>
                    <p className="text-gray-400">Aguarde enquanto cadastramos os membros da nossa equipe.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map(member => (
                        <div
                            key={member.id}
                            className="glass-panel p-6 text-center hover:border-neon-cyan transition-all group cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="relative mb-4 inline-block">
                                <div className="absolute -inset-2 bg-neon-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src={member.photo_url || '/default-avatar.png'}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto border-4 border-neon-cyan object-cover relative z-10 group-hover:scale-105 transition-transform"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-neon-gold mb-1">{member.name}</h3>
                            <p className="text-sm text-neon-magenta font-semibold mb-3">{member.role}</p>

                            {member.bio && (
                                <p className="text-xs text-gray-400 mb-4 line-clamp-3">{member.bio}</p>
                            )}

                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center text-neon-cyan text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity gap-1">
                                <span>Ver Detalhes</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="glass-panel max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="flex-shrink-0 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="absolute -inset-4 bg-neon-cyan/30 blur-xl rounded-full animate-pulse-slow"></div>
                                    <img
                                        src={selectedMember.photo_url || '/default-avatar.png'}
                                        className="w-40 h-40 rounded-full border-4 border-neon-cyan object-cover relative z-10"
                                        alt={selectedMember.name}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-white italic">{selectedMember.name}</h3>
                                <p className="text-neon-gold font-bold uppercase tracking-wider text-sm">{selectedMember.role}</p>
                            </div>

                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div>
                                    <h4 className="text-neon-cyan text-xs font-black uppercase tracking-widest mb-2">Sobre</h4>
                                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                                        {selectedMember.bio || "Sem biografia disponível."}
                                    </p>
                                </div>

                                {selectedMember.schedule_days && selectedMember.schedule_days.length > 0 && (
                                    <div>
                                        <h4 className="text-neon-cyan text-xs font-black uppercase tracking-widest mb-2">Horários</h4>
                                        <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                            <span className="material-symbols-outlined text-neon-gold">calendar_month</span>
                                            <span className="text-white font-bold">{selectedMember.schedule_days.join(', ')}</span>
                                            <span className="w-px h-4 bg-white/20 mx-2"></span>
                                            <span className="text-white">{selectedMember.schedule_time || 'Horário Variável'}</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-neon-cyan text-xs font-black uppercase tracking-widest mb-2">Redes Sociais</h4>
                                    <div className="flex gap-4 justify-center md:justify-start">
                                        {selectedMember.social_instagram && (
                                            <a href={selectedMember.social_instagram} target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-neon-magenta transition-colors">
                                                <span className="material-symbols-outlined">photo_camera</span>
                                                <span className="text-sm">Instagram</span>
                                            </a>
                                        )}
                                        {selectedMember.social_facebook && (
                                            <a href={selectedMember.social_facebook} target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-neon-cyan transition-colors">
                                                <span className="material-symbols-outlined">public</span>
                                                <span className="text-sm">Facebook</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
