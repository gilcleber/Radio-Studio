import React, { useEffect, useState } from 'react';
import { getCurrentNowPlaying, updateNowPlaying, getNowPlayingHistory, NowPlaying } from '../../services/nowPlayingService';

export const NowPlayingManager: React.FC = () => {
    const [current, setCurrent] = useState<NowPlaying | null>(null);
    const [history, setHistory] = useState<NowPlaying[]>([]);
    const [formData, setFormData] = useState({
        artist: '',
        song: '',
        cover_url: '',
        description: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const nowPlaying = await getCurrentNowPlaying();
        if (nowPlaying) {
            setCurrent(nowPlaying);
            setFormData({
                artist: nowPlaying.artist,
                song: nowPlaying.song,
                cover_url: nowPlaying.cover_url || '',
                description: nowPlaying.description || ''
            });
        }

        const hist = await getNowPlayingHistory(10);
        setHistory(hist);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.artist || !formData.song) {
            setMessage({ type: 'error', text: 'Preencha artista e música!' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            await updateNowPlaying(formData);
            setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
            loadData();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Agora no Ar</h1>
                <p className="text-slate-400">Atualize as informações da música tocando agora</p>
            </div>

            {/* Formulário */}
            <div className="glass-panel p-8 rounded-2xl mb-6">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                Artista
                            </label>
                            <input
                                type="text"
                                value={formData.artist}
                                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                placeholder="Ex: Brandon Lake"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                Música
                            </label>
                            <input
                                type="text"
                                value={formData.song}
                                onChange={(e) => setFormData({ ...formData, song: e.target.value })}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                placeholder="Ex: Hard Fought Hallelujah"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            URL da Capa (Imagem)
                        </label>
                        <input
                            type="url"
                            value={formData.cover_url}
                            onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                            className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                            placeholder="https://..."
                        />

                        {/* Preview da Capa */}
                        {formData.cover_url && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Preview:</p>
                                <img
                                    src={formData.cover_url}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-lg object-cover border-2 border-primary/50"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Erro+ao+carregar';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Descrição (Opcional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                            placeholder="Informações adicionais sobre a música..."
                            rows={3}
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            <span className="material-symbols-outlined">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">update</span>
                            {isSaving ? 'Atualizando...' : 'Atualizar Informações'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Histórico */}
            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    Histórico (Últimas 10)
                </h3>

                <div className="space-y-3">
                    {history.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            {item.cover_url ? (
                                <img
                                    src={item.cover_url}
                                    alt=""
                                    className="size-12 rounded-lg object-cover border border-white/10"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/100x100?text=?';
                                    }}
                                />
                            ) : (
                                <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                                    <span className="material-symbols-outlined text-slate-600">music_note</span>
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold truncate">{item.song}</p>
                                <p className="text-slate-400 text-sm truncate">{item.artist}</p>
                            </div>

                            <div className="text-xs text-slate-500">
                                {new Date(item.created_at || item.played_at).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="py-8 text-center text-slate-500">
                            Nenhum histórico ainda
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
