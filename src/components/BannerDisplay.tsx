import React, { useEffect, useState } from 'react';
import { getBanners, Banner } from '../services/bannerService';

interface BannerDisplayProps {
    position: 'sidebar' | 'header' | 'footer';
    className?: string;
}

export const BannerDisplay: React.FC<BannerDisplayProps> = ({ position, className = '' }) => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        loadBanners();
    }, [position]);

    const loadBanners = async () => {
        const data = await getBanners(position, true); // Apenas banners ativos
        setBanners(data);
    };

    // Rotação automática (carousel) a cada 5 segundos
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <div className={`banner-display relative ${className}`}>
            {currentBanner.link_url ? (
                <a
                    href={currentBanner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <img
                        src={currentBanner.image_url}
                        alt={currentBanner.name}
                        className="w-full h-auto rounded-xl border border-white/10 group-hover:border-primary/50 transition-all group-hover:scale-[1.02]"
                    />
                </a>
            ) : (
                <img
                    src={currentBanner.image_url}
                    alt={currentBanner.name}
                    className="w-full h-auto rounded-xl border border-white/10"
                />
            )}

            {/* Indicadores de Paginação (se houver múltiplos banners) */}
            {banners.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`size-2 rounded-full transition-all ${idx === currentIndex
                                    ? 'bg-primary w-6'
                                    : 'bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Ver banner ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
