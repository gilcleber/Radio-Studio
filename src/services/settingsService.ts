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
