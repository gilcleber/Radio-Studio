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
                        <div key={member.id} className="glass-panel p-6 text-center hover:border-neon-cyan transition-all group">
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

                            {member.schedule_time && member.schedule_days && member.schedule_days.length > 0 && (
                                <div className="glass-panel p-3 mb-4 text-xs">
                                    <div className="flex items-center justify-center gap-2 text-neon-cyan mb-1">
                                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                                        <span>{member.schedule_days.join(', ')}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-neon-gold">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        <span>{member.schedule_time}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center gap-3">
                                {member.social_instagram && (
                                    <a
                                        href={member.social_instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neon-magenta hover:text-neon-gold transition-colors"
                                        title="Instagram"
                                    >
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </a>
                                )}
                                {member.social_facebook && (
                                    <a
                                        href={member.social_facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neon-cyan hover:text-neon-gold transition-colors"
                                        title="Facebook"
                                    >
                                        <span className="material-symbols-outlined">public</span>
                                    </a>
                                )}
                                {member.social_twitter && (
                                    <a
                                        href={member.social_twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neon-gold hover:text-neon-cyan transition-colors"
                                        title="Twitter/X"
                                    >
                                        <span className="material-symbols-outlined">chat</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
