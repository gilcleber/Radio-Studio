import { supabase } from './supabaseClient';

export interface AppSettings {
    stream_url: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    stream_url: import.meta.env.VITE_RADIO_STREAM_URL || 'https://s1.sonic.radio.br/8124/stream'
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
