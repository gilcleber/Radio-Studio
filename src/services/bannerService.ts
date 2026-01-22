import { supabase } from './supabaseClient';

export interface Banner {
    id: string;
    name: string;
    image_url: string;
    link_url?: string;
    position: 'sidebar' | 'header' | 'footer';
    width?: number;
    height?: number;
    active: boolean;
    created_at: string;
}

/**
 * Faz upload de uma imagem para o Storage do Supabase
 */
export async function uploadBannerImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    // Retorna URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Busca todos os banners (ou filtra por posição)
 */
export async function getBanners(position?: string, activeOnly = false): Promise<Banner[]> {
    let query = supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

    if (position) {
        query = query.eq('position', position);
    }

    if (activeOnly) {
        query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erro ao buscar banners:', error);
        return [];
    }

    return data || [];
}

/**
 * Cria um novo banner
 */
export async function createBanner(banner: Omit<Banner, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
        .from('banners')
        .insert([banner]);

    if (error) {
        throw new Error(`Erro ao criar banner: ${error.message}`);
    }
}

/**
 * Atualiza um banner existente
 */
export async function updateBanner(id: string, updates: Partial<Banner>): Promise<void> {
    const { error } = await supabase
        .from('banners')
        .update(updates)
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao atualizar banner: ${error.message}`);
    }
}

/**
 * Deleta um banner (e remove a imagem do Storage)
 */
export async function deleteBanner(id: string, imageUrl: string): Promise<void> {
    // Extrair o nome do arquivo da URL
    const fileName = imageUrl.split('/').pop();

    if (fileName) {
        // Deletar do Storage
        await supabase.storage
            .from('banners')
            .remove([fileName]);
    }

    // Deletar do banco
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao deletar banner: ${error.message}`);
    }
}
