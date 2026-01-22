import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeColors, DEFAULT_THEME } from '../../services/settingsService';

const PRESETS = {
    gospel: {
        name: 'Gospel Neon (Padrão)',
        colors: DEFAULT_THEME
    },
    dark: {
        name: 'Dark Mode',
        colors: {
            background: '#000000',
            surface: '#111111',
            primary: '#ffffff',
            secondary: '#888888',
            accent: '#444444'
        }
    },
    light: {
        name: 'Light Mode',
        colors: {
            background: '#ffffff',
            surface: '#f3f4f6',
            primary: '#3b82f6',
            secondary: '#f59e0b',
            accent: '#ec4899'
        }
    },
    ocean: {
        name: 'Ocean Blue',
        colors: {
            background: '#0a1929',
            surface: '#1a2332',
            primary: '#00bcd4',
            secondary: '#4caf50',
            accent: '#ff9800'
        }
    }
};

export const ThemeCustomizer: React.FC = () => {
    const { theme, setTheme, saveTheme } = useTheme();
    const [tempTheme, setTempTheme] = useState<ThemeColors>(theme);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleColorChange = (field: keyof ThemeColors, value: string) => {
        const newTheme = { ...tempTheme, [field]: value };
        setTempTheme(newTheme);
        setTheme(newTheme); // Preview em tempo real
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            await saveTheme(tempTheme);
            setMessage({ type: 'success', text: 'Tema salvo com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar tema.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setTempTheme(DEFAULT_THEME);
        setTheme(DEFAULT_THEME);
    };

    const applyPreset = (colors: ThemeColors) => {
        setTempTheme(colors);
        setTheme(colors);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Personalizar Tema</h1>
                <p className="text-slate-400">Customize as cores do site e veja as mudanças em tempo real</p>
            </div>

            {/* Preview Mock */}
            <div className="mb-8 p-8 rounded-2xl border-2 border-dashed border-white/20 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-50 blur-3xl"
                    style={{ background: `linear-gradient(135deg, ${tempTheme.primary}, ${tempTheme.accent})` }}
                ></div>
                <div className="relative space-y-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: tempTheme.background }}>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: tempTheme.surface }}>
                            <h3 className="font-bold text-sm mb-2" style={{ color: tempTheme.primary }}>Preview do Tema</h3>
                            <p className="text-xs" style={{ color: tempTheme.secondary }}>Este é um exemplo de como as cores ficarão</p>
                            <button
                                className="mt-2 px-3 py-1 rounded-lg text-xs font-bold text-white"
                                style={{ backgroundColor: tempTheme.accent }}
                            >
                                Botão de Exemplo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Pickers */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 mb-6">
                <h3 className="text-xl font-bold text-white mb-6">Cores Personalizadas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Fundo Principal
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={tempTheme.background}
                                onChange={(e) => handleColorChange('background', e.target.value)}
                                className="size-12 rounded-lg cursor-pointer border-2 border-white/10"
                            />
                            <input
                                type="text"
                                value={tempTheme.background}
                                onChange={(e) => handleColorChange('background', e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                                placeholder="#0f172a"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Fundo Secundário (Cards)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={tempTheme.surface}
                                onChange={(e) => handleColorChange('surface', e.target.value)}
                                className="size-12 rounded-lg cursor-pointer border-2 border-white/10"
                            />
                            <input
                                type="text"
                                value={tempTheme.surface}
                                onChange={(e) => handleColorChange('surface', e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                                placeholder="#1e293b"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Cor Primária (Destaques)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={tempTheme.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                className="size-12 rounded-lg cursor-pointer border-2 border-white/10"
                            />
                            <input
                                type="text"
                                value={tempTheme.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                                placeholder="#00d9ff"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Cor Secundária (Acentos)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={tempTheme.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                                className="size-12 rounded-lg cursor-pointer border-2 border-white/10"
                            />
                            <input
                                type="text"
                                value={tempTheme.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                                placeholder="#ffd700"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-neon-cyan uppercase tracking-wider mb-2">
                            Cor de Destaque (Elementos)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={tempTheme.accent}
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                className="size-12 rounded-lg cursor-pointer border-2 border-white/10"
                            />
                            <input
                                type="text"
                                value={tempTheme.accent}
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-mono text-sm"
                                placeholder="#ff006e"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Presets */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Temas Prontos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(PRESETS).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(preset.colors)}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all group"
                        >
                            <div className="flex gap-1 mb-2">
                                <div className="size-4 rounded" style={{ backgroundColor: preset.colors.background }}></div>
                                <div className="size-4 rounded" style={{ backgroundColor: preset.colors.surface }}></div>
                                <div className="size-4 rounded" style={{ backgroundColor: preset.colors.primary }}></div>
                                <div className="size-4 rounded" style={{ backgroundColor: preset.colors.secondary }}></div>
                                <div className="size-4 rounded" style={{ backgroundColor: preset.colors.accent }}></div>
                            </div>
                            <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{preset.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`mb-4 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                    <span className="material-symbols-outlined">
                        {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {message.text}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10 hover:text-white transition-all"
                >
                    Resetar para Padrão
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    {isSaving ? 'Salvando...' : 'Salvar Tema'}
                </button>
            </div>
        </div>
    );
};
