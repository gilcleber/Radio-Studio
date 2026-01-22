import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Request {
    id: string;
    user_name: string;
    song_title: string;
    artist_name: string;
    created_at: string;
    status: 'pending' | 'played';
}

export const RequestManager: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'played'>('pending');

    useEffect(() => {
        fetchRequests();

        // Real-time subscription
        const channel = supabase
            .channel('requests-manager')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages'
            }, () => {
                fetchRequests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filter]);

    const fetchRequests = async () => {
        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        // Aplicar filtro
        if (filter === 'pending') {
            query = query.or('status.is.null,status.eq.pending');
        } else if (filter === 'played') {
            query = query.eq('status', 'played');
        }

        const { data } = await query;

        const formatted = data?.map(m => ({
            id: m.id,
            user_name: m.user_name || 'Anônimo',
            song_title: m.message,
            artist_name: '',
            created_at: m.created_at,
            status: m.status || 'pending'
        })) || [];

        setRequests(formatted);
    };

    const markPlayed = async (id: string) => {
        const { error } = await supabase
            .from('messages')
            .update({ status: 'played' })
            .eq('id', id);

        if (error) {
            alert('Erro ao atender pedido: ' + error.message);
        } else {
            fetchRequests();
        }
    };

    const deleteRequest = async (id: string) => {
        if (confirm("Apagar pedido?")) {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Erro ao apagar: ' + error.message);
            } else {
                fetchRequests();
            }
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Pedidos Musicais</h1>
                    <p className="text-slate-400">Acompanhe e atenda os pedidos dos ouvintes em tempo real.</p>
                </div>
                {pendingCount > 0 && (
                    <div className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 font-bold">
                        {pendingCount} {pendingCount === 1 ? 'pendente' : 'pendentes'}
                    </div>
                )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${filter === 'pending'
                            ? 'bg-primary text-background-dark'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                >
                    Pendentes
                </button>
                <button
                    onClick={() => setFilter('played')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${filter === 'played'
                            ? 'bg-primary text-background-dark'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                >
                    Atendidos
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${filter === 'all'
                            ? 'bg-primary text-background-dark'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                >
                    Todos
                </button>
            </div>

            <div className="space-y-4">
                {requests.map(req => (
                    <div
                        key={req.id}
                        className={`glass-panel p-4 flex items-center justify-between group transition-all ${req.status === 'played' ? 'opacity-50 border-green-500/20' : 'border-primary/20'
                            }`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-primary uppercase">{req.user_name}</span>
                                <span className="text-[10px] text-slate-500">
                                    {format(new Date(req.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                                </span>
                                {req.status === 'played' && (
                                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">
                                        Atendido
                                    </span>
                                )}
                            </div>
                            <div className="text-white font-bold text-lg">
                                {req.song_title}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {req.status !== 'played' && (
                                <button
                                    onClick={() => markPlayed(req.id)}
                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold hover:bg-green-500/30 transition-colors uppercase text-xs tracking-wider flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Atender
                                </button>
                            )}
                            <button
                                onClick={() => deleteRequest(req.id)}
                                className="size-10 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">inbox</span>
                        <p className="text-slate-500">
                            {filter === 'pending' && 'Nenhum pedido pendente.'}
                            {filter === 'played' && 'Nenhum pedido atendido ainda.'}
                            {filter === 'all' && 'Nenhum pedido recebido.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
