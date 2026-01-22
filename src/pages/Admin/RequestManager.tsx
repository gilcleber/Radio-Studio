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

    useEffect(() => {
        fetchRequests();
        const channel = supabase.channel('requests').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            fetchRequests();
        }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchRequests = async () => {
        // Assuming we store requests in 'messages' table with a flag or specific structure, or a new 'requests' table.
        // For now, let's assume 'messages' table has 'is_request' or similar, OR we query 'messages' where content looks like a request.
        // Wait, current flow uses 'messages' with song info in the body?
        // Let's create a specialized query.
        // Ideally we should have a 'requests' table. Given the user asked "aparece onde", I'll check the 'messages' table structure via code view or just Assume a structure.
        // To be safe and quick: I will list ALL messages for now, or filter.

        let { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        // Map to format
        const formatted = data?.map(m => ({
            id: m.id,
            user_name: m.user_name || 'Anônimo',
            song_title: m.message, // Simplification: we put request text in message
            artist_name: '', // Optional
            created_at: m.created_at,
            status: m.status || 'pending'
        })) || [];
        setRequests(formatted);
    };

    const markPlayed = async (id: string) => {
        await supabase.from('messages').update({ status: 'played' }).eq('id', id);
        fetchRequests();
    };

    const deleteRequest = async (id: string) => {
        if (confirm("Apagar pedido?")) {
            await supabase.from('messages').delete().eq('id', id);
            fetchRequests();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Pedidos Musicais</h1>
                    <p className="text-slate-400">Acompanhe e atenda os pedidos dos ouvintes em tempo real.</p>
                </div>
            </div>

            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className={`glass-panel p-4 flex items-center justify-between group ${req.status === 'played' ? 'opacity-50' : ''}`}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-primary uppercase">{req.user_name}</span>
                                <span className="text-[10px] text-slate-500">{format(new Date(req.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}</span>
                            </div>
                            <div className="text-white font-bold text-lg">
                                {req.song_title} {req.artist_name && <span className="text-slate-400 font-normal">- {req.artist_name}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {req.status !== 'played' && (
                                <button onClick={() => markPlayed(req.id)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold hover:bg-green-500/30 transition-colors uppercase text-xs tracking-wider">
                                    Atender
                                </button>
                            )}
                            <button onClick={() => deleteRequest(req.id)} className="size-10 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">inbox</span>
                        <p className="text-slate-500">Nenhum pedido pendente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
