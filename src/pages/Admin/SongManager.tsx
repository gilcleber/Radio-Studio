import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface Song {
    id?: string;
    title: string;
    artist: string;
    album?: string;
    album_art_url?: string;
    youtube_url?: string;
    genre?: string;
    manual_rank?: number | null;
}

export const SongManager: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [search, setSearch] = useState('');
    const [isEditing, setIsEditing] = useState<Song | null>(null);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        let query = supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        const { data } = await query;
        setSongs(data || []);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;

        const payload = {
            title: isEditing.title,
            artist: isEditing.artist,
            album: isEditing.album,
            album_art_url: isEditing.album_art_url,
            youtube_url: isEditing.youtube_url,
            genre: isEditing.genre,
            manual_rank: isEditing.manual_rank
        };

        if (isEditing.id) {
            await supabase.from('songs').update(payload).eq('id', isEditing.id);
        } else {
            await supabase.from('songs').insert([payload]);
        }

        setIsEditing(null);
        fetchSongs();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza? Isso removerá a música da biblioteca e dos votos.')) {
            await supabase.from('songs').delete().eq('id', id);
            fetchSongs();
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Biblioteca de Músicas</h1>
                    <p className="text-slate-400">Gerencie as músicas, capas e links do YouTube.</p>
                </div>
                <button
                    onClick={() => setIsEditing({ title: '', artist: '' })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Nova Música
                </button>
            </div>

            <div className="mb-6">
                <input
                    className="w-full max-w-md bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                    placeholder="Buscar música..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); fetchSongs(); }} // Simple debounce recommended real app
                />
            </div>

            {/* Form Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Nova'} Música</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.title}
                                        onChange={e => setIsEditing({ ...isEditing, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Artista</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.artist}
                                        onChange={e => setIsEditing({ ...isEditing, artist: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capa (Album Art)</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="https://..."
                                    value={isEditing.album_art_url || ''}
                                    onChange={e => setIsEditing({ ...isEditing, album_art_url: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Posição Top 40 (Opcional)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="Ex: 1"
                                        value={isEditing.manual_rank || ''}
                                        onChange={e => setIsEditing({ ...isEditing, manual_rank: parseInt(e.target.value) || null })}
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Se definido, força a posição no ranking.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gênero</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="Ex: Worship"
                                        value={isEditing.genre || ''}
                                        onChange={e => setIsEditing({ ...isEditing, genre: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">YouTube URL (Embed)</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={isEditing.youtube_url || ''}
                                    onChange={e => setIsEditing({ ...isEditing, youtube_url: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Será usado na Biblioteca e Top 40.</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
                                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-white hover:scale-105 transition-all">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-white/10">
                    <div className="w-12">Capa</div>
                    <div>Título / Artista</div>
                    <div>YouTube</div>
                    <div className="text-right">Ações</div>
                </div>
                {songs.map(song => (
                    <div key={song.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                        <img src={song.album_art_url || '/default-album.png'} className="size-12 rounded-lg object-cover bg-black/20" />
                        <div>
                            <div className="font-bold text-white">{song.title}</div>
                            <div className="text-xs text-primary">{song.artist}</div>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{song.youtube_url || '-'}</div>
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(song)} className="size-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                            <button onClick={() => handleDelete(song.id!)} className="size-8 rounded-full bg-white/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
