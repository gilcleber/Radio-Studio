import { supabase } from './supabaseClient';
import { Request } from '../types';

/**
 * Salva pedido de música no Supabase
 */
export const saveSongRequest = async (
  songTitle: string,
  userName: string,
  message: string,
  dedicationTo?: string
): Promise<Request> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        listener_name: userName,
        song_request: songTitle,
        dedication_to: dedicationTo || null,
        message: message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      songTitle: data.song_request,
      userName: data.listener_name,
      message: data.message,
      timestamp: data.created_at
    };
  } catch (error) {
    console.error('❌ Erro ao salvar pedido:', error);
    throw error;
  }
};

/**
 * Busca leaderboard (Top 40) do Supabase
 */
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_top_songs', { p_limit: 40 });

    if (error) throw error;

    return data?.map((song: any, index: number) => ({
      rank: String(index + 1).padStart(2, '0'),
      title: song.title,
      artist: song.artist,
      rating: `${song.approval_percentage}%`
    })) || [];
  } catch (error) {
    console.error('❌ Erro ao buscar leaderboard:', error);
    // Fallback para dados mock em caso de erro
    return [
      { rank: "01", title: "Neon Nights", artist: "Synthwave Experience", rating: "98%" },
      { rank: "02", title: "Midnight City", artist: "Electronic Dreams", rating: "92%" },
      { rank: "03", title: "After Hours", artist: "Vibe Collective", rating: "89%" }
    ];
  }
};
