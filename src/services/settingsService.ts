import { supabase } from './supabaseClient';

export interface AppSettings {
    stream_url: string;

    // Informações Gerais
    site_name?: string;
    site_description?: string;
    site_slogan?: string;
    site_address?: string;
    site_phone?: string;
    site_whatsapp?: string;
    site_email?: string;
    logo_url?: string;

    // SEO
    meta_description?: string;
    meta_keywords?: string;
    meta_author?: string;

    // Scripts & Analytics
    google_analytics_id?: string;
    facebook_pixel_id?: string;
    custom_header_scripts?: string;
    custom_footer_scripts?: string;

    // Redes Sociais
    social_facebook?: string;
    social_instagram?: string;
    social_twitter?: string;
    social_youtube?: string;
    social_tiktok?: string;
}

export interface ThemeColors {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
}

export const DEFAULT_THEME: ThemeColors = {
    background: '#0f172a',
    surface: '#1e293b',
    primary: '#00d9ff',
    secondary: '#ffd700',
    accent: '#ff006e'
};

const DEFAULT_SETTINGS: AppSettings = {
    stream_url: import.meta.env.VITE_RADIO_STREAM_URL || 'https://s1.sonic.radio.br/8124/stream',
    site_name: 'Rádio Studio',
    meta_author: 'Rádio Studio'
};

/**
 * Busca todas as configurações do aplicativo
 */
export const getSettings = async (): Promise<AppSettings> => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) throw error;

        // Converter array de {key, value} para objeto
        const settingsMap: any = {};
        data?.forEach(item => {
            settingsMap[item.key] = item.value;
        });

        return {
            ...DEFAULT_SETTINGS,
            ...settingsMap
        };
    } catch (error) {
        console.error('❌ Erro ao buscar configurações:', error);
        return DEFAULT_SETTINGS;
    }
};

/**
 * Atualiza uma configuração específica
 */
export const updateSetting = async (key: keyof AppSettings, value: string) => {
    try {
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value })
            .select();

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`❌ Erro ao atualizar configuração ${key}:`, error);
        throw error;
    }
};

/**
 * Atualiza múltiplas configurações de uma vez
 */
export const updateMultipleSettings = async (updates: Partial<AppSettings>) => {
    try {
        const upserts = Object.entries(updates).map(([key, value]) => ({
            key,
            value: value?.toString() || ''
        }));

        const { error } = await supabase
            .from('settings')
            .upsert(upserts)
            .select();

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('❌ Erro ao atualizar múltiplas configurações:', error);
        throw error;
    }
};

/**
 * Busca as cores do tema atual
 */
export const getThemeColors = async (): Promise<ThemeColors> => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('theme_colors')
            .eq('id', 1)
            .single();

        if (error || !data || !data.theme_colors) {
            return DEFAULT_THEME;
        }

        return data.theme_colors as ThemeColors;
    } catch (error) {
        console.error('❌ Erro ao buscar tema:', error);
        return DEFAULT_THEME;
    }
};

/**
 * Salva as cores do tema
 */
export const saveThemeColors = async (colors: ThemeColors): Promise<void> => {
    try {
        const { error } = await supabase
            .from('settings')
            .update({ theme_colors: colors })
            .eq('id', 1);

        if (error) throw error;
    } catch (error) {
        console.error('❌ Erro ao salvar tema:', error);
        throw error;
    }
};
