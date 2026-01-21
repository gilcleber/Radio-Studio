import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gera ou recupera fingerprint único do navegador
 * Usado para prevenir votação duplicada sem exigir autenticação
 */
const getBrowserFingerprint = (): string => {
    const stored = localStorage.getItem('user_fingerprint');
    if (stored) return stored;

    const fingerprint = uuidv4();
    localStorage.setItem('user_fingerprint', fingerprint);
    return fingerprint;
};

/**
 * Registra voto de um usuário em uma música
 * @param songId - UUID da música
 * @param voteType - 'like' ou 'dislike'
 */
export const voteSong = async (songId: string, voteType: 'like' | 'dislike') => {
    const fingerprint = getBrowserFingerprint();

    try {
        // Upsert: insere novo voto ou atualiza existente
        const { data, error } = await supabase
            .from('votes')
            .upsert({
                song_id: songId,
                user_fingerprint: fingerprint,
                vote_type: voteType
            }, {
                onConflict: 'song_id,user_fingerprint'
            })
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('❌ Erro ao votar:', error);
        throw error;
    }
};

/**
 * Busca estatísticas de votação de uma música
 * @param songId - UUID da música
 */
export const getSongVotes = async (songId: string) => {
    try {
        const { data, error } = await supabase
            .from('votes')
            .select('vote_type')
            .eq('song_id', songId);

        if (error) throw error;

        const likes = data?.filter(v => v.vote_type === 'like').length || 0;
        const dislikes = data?.filter(v => v.vote_type === 'dislike').length || 0;
        const total = likes + dislikes;
        const approval = total > 0 ? Math.round((likes / total) * 100) : 0;

        return { likes, dislikes, approval, total };
    } catch (error) {
        console.error('❌ Erro ao buscar votos:', error);
        return { likes: 0, dislikes: 0, approval: 0, total: 0 };
    }
};

/**
 * Verifica se o usuário já votou nesta música
 * @param songId - UUID da música
 */
export const getUserVote = async (songId: string): Promise<'like' | 'dislike' | null> => {
    const fingerprint = getBrowserFingerprint();

    try {
        const { data, error } = await supabase
            .from('votes')
            .select('vote_type')
            .eq('song_id', songId)
            .eq('user_fingerprint', fingerprint)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
        return data?.vote_type || null;
    } catch (error) {
        console.error('❌ Erro ao verificar voto do usuário:', error);
        return null;
    }
};

/**
 * Busca Top 40 músicas mais votadas
 */
export const getTopSongs = async (limit: number = 40) => {
    try {
        const { data, error } = await supabase
            .rpc('get_top_songs', { p_limit: limit });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao buscar Top Songs:', error);
        return [];
    }
};
