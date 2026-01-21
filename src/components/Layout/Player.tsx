import React, { useEffect, useRef, useState } from 'react';
import { MOCK_SONGS } from '../../constants';
import { getSettings } from '../../services/settingsService';

// Default fallback
const DEFAULT_STREAM = import.meta.env.VITE_RADIO_STREAM_URL || 'https://s1.sonicradio.br/8124/stream';

export const Player: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState(MOCK_SONGS[0]);
    const [streamUrl, setStreamUrl] = useState(DEFAULT_STREAM);

    // Fetch dynamic stream URL on mount
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            if (settings.stream_url && settings.stream_url !== streamUrl) {
                console.log('📻 Stream URL atualizada via painel:', settings.stream_url);
                setStreamUrl(settings.stream_url);
                if (audioRef.current) {
                    audioRef.current.src = settings.stream_url;
                }
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(streamUrl);
        } else if (audioRef.current.src !== streamUrl) {
            audioRef.current.src = streamUrl;
        }

        // Media Session API Integration
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: currentSong.album,
                artwork: [
                    { src: currentSong.coverUrl, sizes: '96x96', type: 'image/jpeg' },
                    { src: currentSong.coverUrl, sizes: '128x128', type: 'image/jpeg' },
                    { src: currentSong.coverUrl, sizes: '192x192', type: 'image/jpeg' },
                    { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
        }
    }, [currentSong, streamUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
            // If we were "paused" for a long time, we might be behind live. 
            // For a simple stream URL, re-playing usually jumps to live edge anyway.
            setIsLive(true);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 p-4 z-50 transition-all duration-300">
            {/* Progress Bar (Visual Only for Live Radio) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 cursor-pointer group">
                <div className="h-full bg-gradient-to-r from-primary to-primary-glow w-[45%] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white] transition-opacity"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-2 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
                        <img className="size-14 rounded-xl object-cover border border-white/10 relative z-10" src={currentSong.coverUrl} alt="Art" />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-display font-black text-white truncate text-base leading-none tracking-tight hover:text-primary transition-colors cursor-pointer">{currentSong.title}</h3>
                            {isLive && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase animate-pulse shrink-0">Live</span>}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate group-hover:text-white transition-colors cursor-pointer">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 flex justify-center items-center gap-6">
                    <button className="text-slate-400 hover:text-white transition-colors" title="Previous"><span className="material-symbols-outlined text-2xl">skip_previous</span></button>

                    <button
                        onClick={togglePlay}
                        className="size-12 rounded-full bg-white text-background-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <span className="material-symbols-outlined font-black text-3xl filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
                    </button>

                    <button className="text-slate-400 hover:text-white transition-colors" title="Next"><span className="material-symbols-outlined text-2xl">skip_next</span></button>
                </div>

                {/* Actions */}
                <div className="w-1/3 flex justify-end items-center gap-4">
                    {/* Adoration Thermometer (Mock) */}
                    <div className="hidden lg:flex flex-col items-end gap-1 mr-4">
                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">Vibe Check</span>
                        <div className="flex gap-0.5 h-3 items-end">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1 rounded-sm bg-primary ${i < 3 ? 'h-full opacity-100' : 'h-1/2 opacity-30'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                    </div>

                    <button className="text-slate-400 hover:text-accent-magenta transition-colors hover:scale-110 active:scale-90"><span className="material-symbols-outlined text-2xl">favorite</span></button>
                    <button className="hidden sm:block text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-2xl">volume_up</span></button>
                </div>
            </div>
        </div>
    );
};
