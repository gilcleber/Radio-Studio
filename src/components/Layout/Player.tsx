import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { MOCK_SONGS } from '../../constants';
import { getSettings } from '../../services/settingsService';
import { getActiveStreams } from '../../services/streamService';
import { voteSong } from '../../services/votingService';

// Default fallback
const DEFAULT_STREAM = import.meta.env.VITE_RADIO_STREAM_URL || 'https://s1.sonic.radio.br/8124/stream';

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export const Player: React.FC = () => {
    const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
    const [isLive, setIsLive] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [currentSong, setCurrentSong] = useState(MOCK_SONGS[0]);
    const [streamUrl, setStreamUrl] = useState(DEFAULT_STREAM);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch dynamic stream URL on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Tentar pegar da tabela radio_streams primeiro
                const streams = await getActiveStreams();
                if (streams.length > 0) {
                    const primaryStream = streams[0].stream_url;
                    console.log('📻 Stream URL da tabela radio_streams:', primaryStream);
                    setStreamUrl(primaryStream);
                    return;
                }

                // Fallback para settings
                const settings = await getSettings();
                if (settings.stream_url) {
                    console.log('📻 Stream URL do settings:', settings.stream_url);
                    setStreamUrl(settings.stream_url);
                }
            } catch (error) {
                console.error('Erro ao carregar stream URL:', error);
            }
        };
        loadSettings();
    }, []);

    // Initialize audio and HLS
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.preload = "none";
        }

        const audio = audioRef.current;

        // Event handlers
        audio.onloadstart = () => {
            console.log('🔊 Carregando stream...');
            setPlaybackState('loading');
            setErrorMessage(null);
        };

        audio.oncanplay = () => {
            console.log('✅ Stream pronto para tocar');
        };

        audio.onplaying = () => {
            console.log('▶️ Stream tocando');
            setPlaybackState('playing');
            setIsLive(true);
        };

        audio.onpause = () => {
            console.log('⏸️ Stream pausado');
            setPlaybackState('paused');
        };

        audio.onerror = (e) => {
            console.error("❌ Stream Error:", audio.error);
            let errorMsg = 'Erro ao reproduzir stream';

            if (audio.error) {
                switch (audio.error.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMsg = 'Reprodução abortada';
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMsg = 'Erro de rede ao carregar stream';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMsg = 'Erro ao decodificar stream';
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = 'Formato de stream não suportado';
                        break;
                }
            }

            setErrorMessage(errorMsg);
            setPlaybackState('error');
        };

        audio.onstalled = () => {
            console.warn('⚠️ Stream travou (buffering)');
        };

        audio.onwaiting = () => {
            console.log('⏳ Aguardando buffer...');
        };

        return () => {
            // Cleanup HLS on unmount
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, []);

    // Handle stream URL changes and HLS
    useEffect(() => {
        if (!audioRef.current || !streamUrl) return;

        const audio = audioRef.current;
        const isM3U8 = streamUrl.includes('.m3u8') || streamUrl.includes('playlist');

        // Cleanup previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // Check for mixed content (HTTPS site loading HTTP stream)
        if (window.location.protocol === 'https:' && streamUrl.startsWith('http:')) {
            console.warn('⚠️ Mixed Content: Site em HTTPS tentando carregar stream HTTP');
            setErrorMessage('Stream HTTP bloqueado. Use HTTPS ou configure um proxy.');
            setPlaybackState('error');
            return;
        }

        // CORS Proxy - Tenta usar proxy se der erro de CORS
        const useCorsProxy = (url: string) => {
            // Usando AllOrigins como proxy CORS
            return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        };

        let finalStreamUrl = streamUrl;

        // Se não for M3U8 e for uma URL suspeita de CORS, usar proxy
        if (!isM3U8 && !streamUrl.includes('allorigins')) {
            console.log('🔄 Tentando com proxy CORS...');
            finalStreamUrl = useCorsProxy(streamUrl);
        }

        if (isM3U8) {
            // HLS Stream (M3U8)
            if (Hls.isSupported()) {
                console.log('🎬 Usando HLS.js para M3U8:', streamUrl);
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    xhrSetup: (xhr: XMLHttpRequest) => {
                        // Tentar adicionar headers para CORS
                        xhr.withCredentials = false;
                    }
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(audio);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('✅ HLS Manifest carregado');
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('❌ HLS Error:', data);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error('💥 Erro de rede fatal, tentando recuperar...');
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.error('💥 Erro de mídia fatal, tentando recuperar...');
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error('💥 Erro fatal irrecuperável');
                                setErrorMessage('Erro ao carregar stream HLS');
                                setPlaybackState('error');
                                hls.destroy();
                                break;
                        }
                    }
                });

                hlsRef.current = hls;
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                console.log('🍎 Usando HLS nativo (Safari)');
                audio.src = streamUrl;
            } else {
                setErrorMessage('Navegador não suporta HLS');
                setPlaybackState('error');
            }
        } else {
            // Regular audio stream
            console.log('🎵 Stream de áudio:', finalStreamUrl);
            audio.src = finalStreamUrl;
            audio.crossOrigin = 'anonymous'; // Tentar CORS
        }

    }, [streamUrl]);

    // Volume control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Media Session API
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: currentSong.album,
                artwork: [
                    { src: currentSong.coverUrl, sizes: '96x96', type: 'image/jpeg' },
                    { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
        }
    }, [currentSong]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (playbackState === 'playing') {
            audio.pause();
            setPlaybackState('paused');
        } else {
            try {
                setPlaybackState('loading');
                setErrorMessage(null);

                // Explicitly handle autoplay policy
                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    setPlaybackState('playing');
                    setIsLive(true);
                    console.log('✅ Playback iniciado com sucesso');
                }
            } catch (error: any) {
                console.error('❌ Erro ao iniciar playback:', error);

                let errorMsg = 'Erro ao reproduzir';
                if (error.name === 'NotAllowedError') {
                    errorMsg = 'Navegador bloqueou o áudio. Clique novamente.';
                } else if (error.name === 'NotSupportedError') {
                    errorMsg = 'Formato não suportado';
                }

                setErrorMessage(errorMsg);
                setPlaybackState('error');
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
    };

    const handleLike = async () => {
        if (currentSong.id) {
            await voteSong(currentSong.id, 'like');
        }
    };

    const isPlaying = playbackState === 'playing';
    const isLoading = playbackState === 'loading';

    return (
        <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 p-4 z-50 transition-all duration-300">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                <div className={`h-full bg-gradient-to-r from-primary to-primary-glow ${isPlaying ? 'w-full animate-pulse' : isLoading ? 'w-1/2 animate-pulse' : 'w-0'} transition-all duration-1000`}>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {errorMessage}
                </div>
            )}

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className="relative group shrink-0">
                        <div className={`absolute -inset-2 bg-primary/20 blur-lg rounded-full transition-opacity ${isPlaying ? 'opacity-100 animate-pulse-slow' : 'opacity-0'}`}></div>
                        <img className="size-14 rounded-xl object-cover border border-white/10 relative z-10" src={currentSong.coverUrl} alt="Art" />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-20">
                                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-display font-black text-white truncate text-base leading-none tracking-tight">{currentSong.title}</h3>
                            {isLive && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase animate-pulse shrink-0">Live</span>}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 flex justify-center items-center gap-6">
                    <button className="text-slate-400 hover:text-white transition-colors" title="Previous">
                        <span className="material-symbols-outlined text-2xl">skip_previous</span>
                    </button>

                    <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="size-12 rounded-full bg-white text-background-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        {isLoading ? (
                            <div className="animate-spin size-6 border-2 border-background-dark border-t-transparent rounded-full"></div>
                        ) : (
                            <span className="material-symbols-outlined font-black text-3xl filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        )}
                    </button>

                    <button className="text-slate-400 hover:text-white transition-colors" title="Next">
                        <span className="material-symbols-outlined text-2xl">skip_next</span>
                    </button>
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

                    <div className="hidden sm:flex items-center gap-2">
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
