import React, { useEffect, useState } from 'react';
import { getSettings, updateMultipleSettings, AppSettings } from '../../services/settingsService';

type TabType = 'general' | 'seo' | 'scripts' | 'social';

export const AdvancedSettingsManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [settings, setSettings] = useState<Partial<AppSettings>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
        setIsLoading(false);
    };

    const handleChange = (key: keyof AppSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await updateMultipleSettings(settings);
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-neon-cyan animate-pulse">Carregando configurações...</div>;
    }

    const tabs = [
        { id: 'general', label: 'Geral', icon: 'info' },
        { id: 'seo', label: 'SEO', icon: 'search' },
        { id: 'scripts', label: 'Scripts', icon: 'code' },
        { id: 'social', label: 'Redes Sociais', icon: 'share' }
    ] as const;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Configurações Avançadas</h1>
                <p className="text-slate-400">Personalize todos os aspectos da sua rádio</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-6 py-3 rounded-xl font-bold uppercase text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-primary text-background-dark'
                                : 'glass-panel text-slate-400 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave}>
                <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">

                    {/* TAB: GERAL */}
                    {activeTab === 'general' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Nome da Rádio
                                    </label>
                                    <input
                                        value={settings.site_name || ''}
                                        onChange={(e) => handleChange('site_name', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: Rádio Gospel FM"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Slogan
                                    </label>
                                    <input
                                        value={settings.site_slogan || ''}
                                        onChange={(e) => handleChange('site_slogan', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: O Som Perfeito"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={settings.site_description || ''}
                                    onChange={(e) => handleChange('site_description', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    rows={4}
                                    placeholder="Breve descrição sobre sua rádio..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        value={settings.site_whatsapp || ''}
                                        onChange={(e) => handleChange('site_whatsapp', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: +5511999999999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.site_email || ''}
                                        onChange={(e) => handleChange('site_email', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="contato@radiostudio.com"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Endereço Completo
                                    </label>
                                    <input
                                        value={settings.site_address || ''}
                                        onChange={(e) => handleChange('site_address', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        value={settings.site_phone || ''}
                                        onChange={(e) => handleChange('site_phone', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="(11) 9999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        URL do Logo
                                    </label>
                                    <input
                                        value={settings.logo_url || ''}
                                        onChange={(e) => handleChange('logo_url', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* TAB: SEO */}
                    {activeTab === 'seo' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Meta Description
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Descrição que aparece nos resultados do Google (máx. 160 caracteres)
                                </p>
                                <textarea
                                    value={settings.meta_description || ''}
                                    onChange={(e) => handleChange('meta_description', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    rows={3}
                                    maxLength={160}
                                    placeholder="Ouça músicas gospel 24h. A melhor programação evangélica online."
                                />
                                <div className="text-right text-xs text-slate-500 mt-1">
                                    {settings.meta_description?.length || 0}/160
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Palavras-chave (Keywords)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Separe por vírgula (ex: rádio gospel, música evangélica, louvor)
                                </p>
                                <input
                                    value={settings.meta_keywords || ''}
                                    onChange={(e) => handleChange('meta_keywords', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="rádio gospel, música evangélica, louvor, adoração"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Autor (Meta Author)
                                </label>
                                <input
                                    value={settings.meta_author || ''}
                                    onChange={(e) => handleChange('meta_author', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="Rádio Studio"
                                />
                            </div>
                        </>
                    )}

                    {/* TAB: SCRIPTS */}
                    {activeTab === 'scripts' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Google Analytics ID
                                    </label>
                                    <p className="text-xs text-slate-500 mb-3">
                                        Ex: G-XXXXXXXXXX ou UA-XXXXXXXXX-X
                                    </p>
                                    <input
                                        value={settings.google_analytics_id || ''}
                                        onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                        Facebook Pixel ID
                                    </label>
                                    <p className="text-xs text-slate-500 mb-3">
                                        Código do Pixel do Facebook
                                    </p>
                                    <input
                                        value={settings.facebook_pixel_id || ''}
                                        onChange={(e) => handleChange('facebook_pixel_id', e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        placeholder="000000000000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Scripts Personalizados (Header)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Código HTML/JS que será inserido no {'<head>'} do site
                                </p>
                                <textarea
                                    value={settings.custom_header_scripts || ''}
                                    onChange={(e) => handleChange('custom_header_scripts', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none font-mono text-sm"
                                    rows={6}
                                    placeholder="<script>&#10;  // Seu código aqui&#10;</script>"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                                    Scripts Personalizados (Footer)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Código HTML/JS que será inserido antes do {'</body>'}
                                </p>
                                <textarea
                                    value={settings.custom_footer_scripts || ''}
                                    onChange={(e) => handleChange('custom_footer_scripts', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none font-mono text-sm"
                                    rows={6}
                                    placeholder="<script>&#10;  // Seu código aqui&#10;</script>"
                                />
                            </div>
                        </>
                    )}

                    {/* TAB: REDES SOCIAIS */}
                    {activeTab === 'social' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">facebook</span>
                                    Facebook
                                </label>
                                <input
                                    value={settings.social_facebook || ''}
                                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://facebook.com/radiostudio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    Instagram
                                </label>
                                <input
                                    value={settings.social_instagram || ''}
                                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://instagram.com/radiostudio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">share</span>
                                    Twitter / X
                                </label>
                                <input
                                    value={settings.social_twitter || ''}
                                    onChange={(e) => handleChange('social_twitter', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://twitter.com/radiostudio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    YouTube
                                </label>
                                <input
                                    value={settings.social_youtube || ''}
                                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://youtube.com/@radiostudio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">music_note</span>
                                    TikTok
                                </label>
                                <input
                                    value={settings.social_tiktok || ''}
                                    onChange={(e) => handleChange('social_tiktok', e.target.value)}
                                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    placeholder="https://tiktok.com/@radiostudio"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Alert */}
                {message && (
                    <div className={`mt-4 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        <span className="material-symbols-outlined">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {message.text}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-primary text-background-dark font-black uppercase rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">save</span>
                        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                </div>
            </form>
        </div>
    );
};
