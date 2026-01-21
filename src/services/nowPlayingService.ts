import { supabase } from './supabaseClient';

export interface NowPlayingSong {
    id: string; // ID da música
    title: string;
    artist: string;
    coverUrl: string;
    lyrics?: string[];
}

/**
 * Busca a música tocando agora + metadados
 * Retorna null se não houver música tocando ou dados inválidos
 */
export const getNowPlaying = async (): Promise<NowPlayingSong | null> => {
    try {
        // 1. Busca na tabela now_playing (ID=1 sempre)
        const { data: nowPlayingData, error: nowPlayingError } = await supabase
            .from('now_playing')
            .select('song_id')
            .eq('id', 1)
            .single();

        if (nowPlayingError) {
            console.warn('Erro ao ler now_playing:', nowPlayingError.message);
            // Não dá throw para não quebrar o app todo, retorna null (neutral screen)
            return null;
        }

        if (!nowPlayingData?.song_id) {
            return null; // Nenhuma música tocando
        }

        // 2. Busca detalhes da música
        const { data: songData, error: songError } = await supabase
            .from('songs')
            .select('*')
            .eq('id', nowPlayingData.song_id)
            .single();

        if (songError || !songData) {
            return null;
        }

        // Formata para o padrão da UI
        return {
            id: songData.id,
            title: songData.title,
            artist: songData.artist,
            coverUrl: songData.album_art_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
            lyrics: [] // Lyrics ainda não implementado no DB, retorna vazio
        };

    } catch (error) {
        console.error('❌ Erro getNowPlaying:', error);
        return null;
    }
};
