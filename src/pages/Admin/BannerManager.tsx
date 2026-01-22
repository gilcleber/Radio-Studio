import React, { useEffect, useState } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage, Banner } from '../../services/bannerService';

export const BannerManager: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<Partial<Banner> | null>(null);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [filterPosition, setFilterPosition] = useState<string>('all');

    useEffect(() => {
        loadBanners();
    }, [filterPosition]);

    const loadBanners = async () => {
        setIsLoading(true);
        const data = await getBanners(filterPosition === 'all' ? undefined : filterPosition);
        setBanners(data);
        setIsLoading(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validação
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Arquivo muito grande. Máximo: 2MB');
            return;
        }

        setUploadProgress(true);

        try {
            const imageUrl = await uploadBannerImage(file);
            setIsEditing(prev => prev ? { ...prev, image_url: imageUrl } : null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploadProgress(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing || !isEditing.name || !isEditing.image_url || !isEditing.position) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            if (isEditing.id) {
                await updateBanner(isEditing.id, isEditing);
            } else {
                await createBanner({
                    name: isEditing.name,
                    image_url: isEditing.image_url,
                    link_url: isEditing.link_url,
                    position: isEditing.position as any,
                    width: isEditing.width,
                    height: isEditing.height,
                    active: isEditing.active ?? true
                });
            }
            setIsEditing(null);
            loadBanners();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (banner: Banner) => {
        if (confirm(`Deletar banner "${banner.name}"?`)) {
            try {
                await deleteBanner(banner.id, banner.image_url);
                loadBanners();
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Banners</h1>
                    <p className="text-slate-400">Faça upload e gerencie banners publicitários do site</p>
                </div>
                <button
                    onClick={() => setIsEditing({ name: '', position: 'sidebar', active: true })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add_photo_alternate</span> Novo Banner
                </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                {['all', 'sidebar', 'header', 'footer'].map(pos => (
                    <button
                        key={pos}
                        onClick={() => setFilterPosition(pos)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all ${filterPosition === pos
                                ? 'bg-primary text-background-dark'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                    >
                        {pos === 'all' ? 'Todos' : pos === 'sidebar' ? 'Lateral' : pos === 'header' ? 'Topo' : 'Rodapé'}
                    </button>
                ))}
            </div>

            {/* Modal de Edição */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Novo'} Banner</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Banner</label>
                                    <input
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        placeholder="Ex: Promoção de Verão"
                                        value={isEditing.name || ''}
                                        onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Posição</label>
                                    <select
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.position || 'sidebar'}
                                        onChange={e => setIsEditing({ ...isEditing, position: e.target.value as any })}
                                        required
                                    >
                                        <option value="sidebar">Lateral (Sidebar)</option>
                                        <option value="header">Topo (Header)</option>
                                        <option value="footer">Rodapé (Footer)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link (URL de Destino)</label>
                                <input
                                    type="url"
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="https://exemplo.com"
                                    value={isEditing.link_url || ''}
                                    onChange={e => setIsEditing({ ...isEditing, link_url: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Opcional - O usuário será redirecionado ao clicar no banner</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Imagem do Banner</label>
                                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                    {isEditing.image_url ? (
                                        <div className="space-y-4">
                                            <img src={isEditing.image_url} className="max-h-48 mx-auto rounded-lg border border-white/10" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing({ ...isEditing, image_url: undefined })}
                                                className="text-red-400 hover:text-red-300 text-sm font-bold"
                                            >
                                                Remover Imagem
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/webp"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                disabled={uploadProgress}
                                            />
                                            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">upload_file</span>
                                            <p className="text-white font-bold">{uploadProgress ? 'Fazendo upload...' : 'Clique para selecionar imagem'}</p>
                                            <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF ou WebP - Máx. 2MB</p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={isEditing.active ?? true}
                                    onChange={e => setIsEditing({ ...isEditing, active: e.target.checked })}
                                    className="size-4"
                                />
                                <label htmlFor="active" className="text-white text-sm cursor-pointer">Banner Ativo (exibir no site)</label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
                                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-white hover:scale-105 transition-all" disabled={!isEditing.image_url}>
                                    Salvar Banner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="glass-panel p-4 group relative hover:border-primary/50 transition-colors">
                        <div className="aspect-video rounded-xl overflow-hidden bg-black/20 mb-3">
                            <img src={banner.image_url} className="w-full h-full object-contain" alt={banner.name} />
                        </div>
                        <h3 className="font-bold text-white text-lg">{banner.name}</h3>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">
                            {banner.position === 'sidebar' ? 'Lateral' : banner.position === 'header' ? 'Topo' : 'Rodapé'}
                        </p>
                        {!banner.active && (
                            <span className="inline-block mt-2 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">Inativo</span>
                        )}

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(banner)} className="size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => handleDelete(banner)} className="size-8 rounded-full bg-black/60 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && !isLoading && (
                    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                        {filterPosition === 'all' ? 'Nenhum banner cadastrado. Adicione o primeiro!' : `Nenhum banner na posição "${filterPosition}"`}
                    </div>
                )}
            </div>
        </div>
    );
};
