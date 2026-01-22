import { supabase } from './supabaseClient';

export interface RequestNotification {
    id: string;
    user_name: string;
    song_title: string;
    created_at: string;
}

/**
 * Subscreve para receber notificações de novos pedidos em tempo real
 */
export const subscribeToNewRequests = (callback: (request: RequestNotification) => void) => {
    const channel = supabase
        .channel('new-requests-notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            },
            (payload) => {
                const newRequest = payload.new as any;
                callback({
                    id: newRequest.id,
                    user_name: newRequest.user_name || 'Anônimo',
                    song_title: newRequest.message,
                    created_at: newRequest.created_at
                });
            }
        )
        .subscribe();

    return channel;
};

/**
 * Busca a contagem de pedidos pendentes
 */
export const getPendingRequestsCount = async (): Promise<number> => {
    const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .or('status.is.null,status.eq.pending');

    return count || 0;
};

/**
 * Reproduz um som de notificação
 */
export const playNotificationSound = () => {
    // Som sutil de notificação (usando Web Audio API)
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Frequência em Hz
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.warn('Notificação sonora não suportada:', e);
    }
};
