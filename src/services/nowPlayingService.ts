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

// ===== NEW: Multi-Stream Now Playing Management =====

export interface NowPlaying {
    id: string;
    artist: string;
    song: string;
    cover_url?: string;
    description?: string;
    is_current?: boolean;
    created_at?: string;
    updated_at?: string;
    played_at?: string;
}

/**
 * Busca informações "Agora no Ar" atual (novo formato)
 */
export async function getCurrentNowPlaying(): Promise<NowPlaying | null> {
    const { data, error } = await supabase
        .from('now_playing')
        .select('*')
        .eq('is_current', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('❌ Erro ao buscar now playing:', error);
        return null;
    }

    return data;
}

/**
 * Atualiza informações "Agora no Ar"
 */
export async function updateNowPlaying(data: {
    artist: string;
    song: string;
    cover_url?: string;
    description?: string;
}): Promise<void> {
    try {
        // Marcar todos como não-atuais
        await supabase
            .from('now_playing')
            .update({ is_current: false })
            .eq('is_current', true);

        // Inserir novo como atual
        const { error: insertError } = await supabase
            .from('now_playing')
            .insert([{
                ...data,
                is_current: true,
                updated_at: new Date().toISOString()
            }]);

        if (insertError) throw insertError;

        // Adicionar ao histórico
        await supabase
            .from('now_playing_history')
            .insert([{
                artist: data.artist,
                song: data.song,
                cover_url: data.cover_url,
                description: data.description,
                played_at: new Date().toISOString()
            }]);

    } catch (error: any) {
        throw new Error(`Erro ao atualizar now playing: ${error.message}`);
    }
}

/**
 * Busca histórico de músicas tocadas
 */
export async function getNowPlayingHistory(limit: number = 10): Promise<NowPlaying[]> {
    const { data, error } = await supabase
        .from('now_playing_history')
        .select('*')
        .order('played_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        return [];
    }

    return data || [];
}
