import React from 'react';
import { MOCK_SONGS } from '../constants';
import { VoteButton } from '../components/VoteButton';

export const Home: React.FC = () => {
    const song = MOCK_SONGS[0];

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-16">

            {/* Featured / Hero Section with Lyrics */}
            <div className="flex flex-col lg:flex-row gap-12 items-center min-h-[60vh]">
                {/* Album Art & Visualizer */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative group size-[320px] lg:size-[480px]">
                        {/* Neon Glow Behind */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-accent-magenta to-accent-blue opacity-30 blur-[60px] animate-pulse-slow"></div>

                        {/* Glass Container */}
                        <div className="relative z-10 w-full h-full rounded-[40px] p-2 glass-panel overflow-hidden transition-transform duration-700 hover:rotate-1 hover:scale-[1.02]">
                            <img src={song.coverUrl} className="w-full h-full rounded-[32px] object-cover" alt={song.title} />

                            {/* Overlay Info on Hover */}
                            <div className="absolute inset-x-2 bottom-2 p-6 rounded-[28px] bg-black/60 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center text-center">
                                <p className="text-primary font-black uppercase tracking-widest text-xs mb-1">Tocando Agora</p>
                                <h2 className="text-2xl font-black italic text-white leading-none">{song.title}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lyrics & Context */}
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur mb-4">
                            <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Worship Global • Ao Vivo</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-2">{song.title}</h1>
                        <p className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue">{song.artist}</p>
                    </div>

                    {/* Lyrics View */}
                    <div className="relative h-[300px] overflow-hidden mask-image-b">
                        <div className="space-y-6 lyrics-mask">
                            {song.lyrics?.map((line, i) => (
                                <p
                                    key={i}
                                    className={`font-black text-2xl lg:text-4xl transition-all duration-500 cursor-pointer hover:text-white ${i === 4 ? 'text-white scale-105 translate-x-4 pl-4 border-l-4 border-primary' : 'text-slate-700 blur-[1px] hover:blur-0'}`}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                        <button className="px-8 py-3 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                            Pedir Essa Música
                        </button>

                        {/* Voting Buttons Component */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-sm">
                            <VoteButton songId={song.id} />
                        </div>

                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
