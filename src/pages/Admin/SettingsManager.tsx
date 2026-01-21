import React, { useEffect, useState } from 'react';
import { getSettings, updateSetting } from '../../services/settingsService';

export const SettingsManager: React.FC = () => {
    const [streamUrl, setStreamUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const settings = await getSettings();
        setStreamUrl(settings.stream_url);
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await updateSetting('stream_url', streamUrl);
            setMessage({ type: 'success', text: 'URL do streaming atualizada com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar configurações. Tente novamente.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-neon-cyan animate-pulse">Carregando configurações...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
                <p className="text-slate-400">Gerencie as variáveis globais da rádio.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            URL do Streaming (Áudio)
                        </label>
                        <p className="text-xs text-slate-500 mb-3">
                            Este é o link direto do áudio que toca no player (Icecast/Shoutcast).
                        </p>
                        <div className="flex gap-4">
                            <input
                                value={streamUrl}
                                onChange={(e) => setStreamUrl(e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                placeholder="https://..."
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-primary text-background-dark font-black uppercase rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
