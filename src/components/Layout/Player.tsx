import React, { useEffect, useRef, useState } from 'react';
import { MOCK_SONGS } from '../../constants';
import { getSettings } from '../../services/settingsService';
import { voteSong } from '../../services/votingService';

// Default fallback
const DEFAULT_STREAM = import.meta.env.VITE_RADIO_STREAM_URL || 'https://s1.sonic.radio.br/8124/;';

export const Player: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState(MOCK_SONGS[0]);
    const [streamUrl, setStreamUrl] = useState(DEFAULT_STREAM);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

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
            audioRef.current.preload = "none"; // Economizar dados se não der play
        } else if (audioRef.current.src !== streamUrl) {
            audioRef.current.src = streamUrl;
        }

        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }

        // Handle stream errors
        audioRef.current.onerror = (e) => {
            console.error("Stream Error:", e);
            setIsPlaying(false);
        };

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
    }, [currentSong, streamUrl, volume, isMuted]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setIsLive(true);
                    })
                    .catch(error => {
                        console.error("Playback failed", error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        setIsMuted(newVol === 0);
        if (audioRef.current) audioRef.current.volume = newVol;
    };

    const handleLike = async () => {
        // Implement simple like (fire and forget for visual feedback)
        // More complex logic is in the main VoteButton, this is a quick access
        if (currentSong.id) {
            await voteSong(currentSong.id, 'like');
            // Visual feedback could be added here
        }
    };

    return (
        <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 p-4 z-50 transition-all duration-300">
            {/* Progress Bar (Visual Only for Live Radio) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 cursor-pointer group">
                <div className={`h-full bg-gradient-to-r from-primary to-primary-glow ${isPlaying ? 'w-full animate-pulse' : 'w-0'} transition-all duration-1000 relative`}>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className="relative group shrink-0">
                        <div className={`absolute -inset-2 bg-primary/20 blur-lg rounded-full transition-opacity ${isPlaying ? 'opacity-100 animate-pulse-slow' : 'opacity-0'}`}></div>
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

                {/* Actions & Volume */}
                <div className="w-1/3 flex justify-end items-center gap-4">
                    <button
                        onClick={handleLike}
                        className="text-slate-400 hover:text-accent-magenta transition-colors hover:scale-110 active:scale-90"
                        title="Curtir"
                    >
                        <span className="material-symbols-outlined text-2xl">favorite</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-2 group">
                        <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-2xl">
                                {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                            </span>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
