import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { voteSong } from '../services/votingService';

interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    album_art_url?: string;
    youtube_url?: string;
    genre?: string;
    duration?: number;
}

export const Library: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSongs(data || []);
        } catch (error) {
            console.error('❌ Erro ao carregar biblioteca:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractYouTubeId = (url: string): string => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-neon-cyan text-2xl animate-pulse">Carregando biblioteca...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-neon-cyan mb-2">📚 Biblioteca Musical</h1>
                <p className="text-gray-400">Explore nossa coleção completa de músicas gospel</p>
            </div>

            {songs.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-neon-magenta mb-4">library_music</span>
                    <h2 className="text-2xl font-bold text-white mb-2">Biblioteca Vazia</h2>
                    <p className="text-gray-400">Nenhuma música cadastrada ainda. Adicione músicas pelo painel admin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {songs.map(song => (
                        <div
                            key={song.id}
                            className="glass-panel p-4 cursor-pointer hover:border-neon-cyan transition-all group"
                            onClick={() => setSelectedSong(song)}
                        >
                            <div className="relative mb-3 overflow-hidden rounded-lg aspect-square">
                                <img
                                    src={song.album_art_url || '/default-album.png'}
                                    alt={song.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                                />
                                {song.youtube_url && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-neon-cyan truncate mb-1">{song.title}</h3>
                            <p className="text-sm text-gray-400 truncate mb-2">{song.artist}</p>
                            {song.genre && (
                                <span className="inline-block px-2 py-1 bg-neon-magenta/20 text-neon-magenta text-xs rounded">
                                    {song.genre}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal com YouTube Embed */}
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

                        {selectedSong.youtube_url ? (
                            <div className="aspect-video mb-4">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedSong.youtube_url)}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video mb-4 glass-panel flex items-center justify-center">
                                <p className="text-gray-400">Preview não disponível</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {selectedSong.youtube_url && (
                                <a
                                    href={selectedSong.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-panel px-6 py-3 text-neon-magenta hover:text-neon-gold transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">open_in_new</span>
                                    Ver no YouTube
                                </a>
                            )}
                            <button
                                onClick={async () => {
                                    try {
                                        await voteSong(selectedSong.id, 'like');
                                        alert('Música favoritada!');
                                    } catch (e) {
                                        alert('Erro ao favoritar.');
                                    }
                                }}
                                className="glass-panel px-6 py-3 text-neon-cyan hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">favorite</span>
                                Favoritar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
