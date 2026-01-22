import React, { useEffect, useState } from 'react';
import { getTopSongs } from '../services/votingService';
import { voteSong } from '../services/votingService';

interface TopSong {
    song_id: string; // RPC returns song_id
    id?: string; // Fallback
    title: string;
    artist: string;
    album_art_url: string;
    likes: number;
    dislikes: number;
    approval_percentage: number;
    youtube_url?: string;
    manual_rank?: number | null;
}

// Helper to extract YouTube ID
const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
};

export const Charts: React.FC = () => {
    const [songs, setSongs] = useState<TopSong[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSong, setSelectedSong] = useState<TopSong | null>(null);

    useEffect(() => {
        fetchTopSongs();
    }, []);

    const fetchTopSongs = async () => {
        // 1. Fetch Stats from RPC
        const stats = await getTopSongs();

        // 2. Fetch Manually Ranked Songs (to get manual_rank and youtube_url if missing)
        const { data: allSongs } = await supabase.from('songs').select('id, manual_rank, youtube_url');

        // 3. Merge Flow
        const songMap = new Map(allSongs?.map(s => [s.id, s]) || []);

        const merged = stats.map((s: any) => {
            const extra = songMap.get(s.song_id || s.id);
            return {
                ...s,
                id: s.song_id || s.id,
                youtube_url: s.youtube_url || extra?.youtube_url, // Prioritize RPC if updated, else table
                manual_rank: extra?.manual_rank
            };
        });

        // 4. FILTRAR: Apenas músicas com manual_rank definido (Top 40 oficial)
        const rankedOnly = merged.filter((s: TopSong) => s.manual_rank != null);

        // 5. Sort: Manual Rank (ASC) -> Then Approval (DESC)
        const sorted = rankedOnly.sort((a: TopSong, b: TopSong) => {
            // Ambos têm rank: comparar ranks
            if (a.manual_rank && b.manual_rank) return a.manual_rank - b.manual_rank;

            // Comparar por aprovação caso contrário
            return b.approval_percentage - a.approval_percentage;
        });

        setSongs(sorted);
        setIsLoading(false);
    };

    const handleVote = async (songId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await voteSong(songId, 'like');
        // Optimistic UI update could go here, or just refetch
        fetchTopSongs();
    };

    if (isLoading) return <div className="p-12 text-center text-neon-cyan animate-pulse">Carregando Top 40...</div>;

    const topSong = songs[0];

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-32">
            {/* Hero Header */}
            <div className="mb-16 relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl pointer-events-none"></div>
                <h2 className="title-glitch text-6xl lg:text-8xl text-white mb-4">Top 40 <span className="text-primary italic">Global</span></h2>
                <p className="text-xl text-slate-400 font-display tracking-wide max-w-lg">
                    As músicas mais ouvidas e votadas pela comunidade Studio nesta semana.
                </p>
            </div>

            {/* #1 Destaque (Se houver) */}
            {topSong && (
                <div className="mb-16 relative group cursor-pointer" onClick={() => setSelectedSong(topSong)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-blue opacity-20 blur-[50px] animate-pulse-slow"></div>
                    <div className="bg-gradient-to-br from-surface-dark to-background-dark border border-primary/30 p-8 rounded-[40px] relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 hover:scale-[1.01] transition-transform duration-500">
                        {/* Number 1 Badge */}
                        <div className="absolute top-0 left-0 bg-primary text-background-dark px-6 py-2 rounded-br-2xl font-black text-xl z-20">#1 DO MUNDO</div>

                        <img src={topSong.album_art_url || '/default-album.png'} className="size-48 lg:size-64 rounded-3xl object-cover shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500" alt="Top 1" />

                        <div className="flex-1 text-center lg:text-left z-10">
                            <div className="inline-block px-3 py-1 rounded-full border border-accent-gold text-accent-gold text-[10px] font-black uppercase tracking-widest mb-4">Recordista da Semana</div>
                            <h3 className="text-4xl lg:text-6xl font-black uppercase italic text-white mb-2 leading-none">{topSong.title}</h3>
                            <p className="text-2xl text-slate-400 font-bold mb-8">{topSong.artist}</p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <button className="px-8 py-3 rounded-xl bg-white text-background-dark font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                    <span className="material-symbols-outlined filled">play_arrow</span> Ouvir Agora
                                </button>
                                <button
                                    onClick={(e) => handleVote(topSong.song_id || topSong.id, e)}
                                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-white font-bold transition-all"
                                >
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {songs.map((song, i) => (
                    <div
                        key={song.song_id || song.id}
                        onClick={() => setSelectedSong(song)}
                        className="group flex items-center gap-6 p-4 rounded-3xl bg-surface-dark/50 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer"
                    >
                        <span className={`text-3xl font-black italic w-12 text-center ${i === 0 ? 'text-primary' : 'text-slate-700 group-hover:text-primary transition-colors'}`}>
                            {song.manual_rank?.toString().padStart(2, '0') || (i + 1).toString().padStart(2, '0')}
                        </span>

                        <img src={song.album_art_url || '/default-album.png'} className="size-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />

                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-black text-white truncate">{song.title}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase">{song.artist}</p>
                        </div>

                        <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${song.approval_percentage}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-primary">{song.approval_percentage}% Aprovado</span>
                        </div>

                        <button
                            onClick={(e) => handleVote(song.song_id || song.id, e)}
                            className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                    </div>
                ))}

                {songs.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        Nenhuma música no ranking ainda. Vote na página inicial!
                    </div>
                )}
            </div>

            {/* Modal com YouTube Embed (Duplicação do código da Library para simplicidade neste turno) */}
            {selectedSong && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedSong(null)}
                >
                    <div
                        className="glass-panel p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-neon-cyan mb-1">{selectedSong.title}</h2>
                                <p className="text-lg text-gray-400">{selectedSong.artist}</p>
                            </div>
                            <button
                                onClick={() => setSelectedSong(null)}
                                className="text-white hover:text-neon-magenta transition-colors"
                            >
                                <span className="material-symbols-outlined text-3xl">close</span>
                            </button>
                        </div>

                        {/* Tenta buscar youtube_url se o RPC não trouxe (pode precisar de join no futuro, mas por enquanto assume que o user quer visualizar o que tem) 
                            Nota: O RPC atual get_top_songs pode não retornar youtube_url se não foi atualizado. 
                            Vou assumir que pode não ter e mostrar aviso se faltar, ou idealmente eu atualizaria o RPC.
                            Para ser rápido, vou tentar usar o que vier. Se falhar, o SongManager já permite editar.
                         */}

                        {/* 
                           IMPORTANTE: O RPC SQL get_top_songs definido anteriormente NÃO incluía youtube_url no retorno. 
                           Vou precisar atualizar o RPC ou fazer um fetch individual aqui se estiver faltando.
                           Vou fazer um fetch on-demand rápido se youtube_url estiver faltando no objeto.
                        */}
                        <LoadYouTube url={selectedSong.youtube_url} songId={selectedSong.song_id || selectedSong.id} />
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component to handle potential missing URL fetching
import { supabase } from '../services/supabaseClient';

const LoadYouTube = ({ url, songId }: { url?: string, songId: string }) => {
    const [finalUrl, setFinalUrl] = useState(url);

    useEffect(() => {
        if (!url && songId) {
            supabase.from('songs').select('youtube_url').eq('id', songId).single()
                .then(({ data }) => {
                    if (data?.youtube_url) setFinalUrl(data.youtube_url);
                });
        }
    }, [url, songId]);

    if (!finalUrl) return <div className="p-12 text-center text-slate-500">Preview indisponível (URL não cadastrada).</div>;

    const videoId = extractYouTubeId(finalUrl);

    if (!videoId) return <div className="p-12 text-center text-slate-500">URL de vídeo inválida.</div>;

    return (
        <div className="aspect-video mb-4">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
            />
        </div>
    );
}

