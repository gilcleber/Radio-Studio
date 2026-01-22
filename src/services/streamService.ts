import { supabase } from './supabaseClient';

export interface RadioStream {
    id: string;
    label: string;
    stream_url: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

/**
 * Busca todas as streams (admin)
 */
export async function getAllStreams(): Promise<RadioStream[]> {
    const { data, error } = await supabase
        .from('radio_streams')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('❌ Erro ao buscar streams:', error);
        return [];
    }

    return data || [];
}

/**
 * Busca apenas streams ativas (para player público)
 */
export async function getActiveStreams(): Promise<RadioStream[]> {
    const { data, error } = await supabase
        .from('radio_streams')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('❌ Erro ao buscar streams ativas:', error);
        return [];
    }

    return data || [];
}

/**
 * Cria uma nova stream
 */
export async function createStream(stream: Omit<RadioStream, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
        .from('radio_streams')
        .insert([stream]);

    if (error) {
        throw new Error(`Erro ao criar stream: ${error.message}`);
    }
}

/**
 * Atualiza uma stream existente
 */
export async function updateStream(id: string, updates: Partial<RadioStream>): Promise<void> {
    const { error } = await supabase
        .from('radio_streams')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao atualizar stream: ${error.message}`);
    }
}

/**
 * Deleta uma stream
 */
export async function deleteStream(id: string): Promise<void> {
    const { error } = await supabase
        .from('radio_streams')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao deletar stream: ${error.message}`);
    }
}

/**
 * Toggle ativo/inativo
 */
export async function toggleStreamActive(id: string, isActive: boolean): Promise<void> {
    await updateStream(id, { is_active: isActive });
}
