
import React, { useState } from 'react';
import { MOCK_SONGS } from '../constants';

export const Charts: React.FC = () => {
    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-32">
            {/* Hero Header */}
            <div className="mb-16 relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl pointer-events-none"></div>
                <h2 className="title-glitch text-6xl lg:text-8xl text-white mb-4">Top 40 <span className="text-primary italic">Global</span></h2>
                <p className="text-xl text-slate-400 font-display tracking-wide max-w-lg">
                    As músicas mais ouvidas e votadas pela comunidade Studio nesta semana.
                </p>
            </div>

            {/* #1 Destaque */}
            <div className="mb-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-blue opacity-20 blur-[50px] animate-pulse-slow"></div>
                <div className="bg-gradient-to-br from-surface-dark to-background-dark border border-primary/30 p-8 rounded-[40px] relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
                    {/* Number 1 Badge */}
                    <div className="absolute top-0 left-0 bg-primary text-background-dark px-6 py-2 rounded-br-2xl font-black text-xl z-20">#1 DO MUNDO</div>

                    <img src={MOCK_SONGS[0].coverUrl} className="size-48 lg:size-64 rounded-3xl object-cover shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500" alt="Top 1" />

                    <div className="flex-1 text-center lg:text-left z-10">
                        <div className="inline-block px-3 py-1 rounded-full border border-accent-gold text-accent-gold text-[10px] font-black uppercase tracking-widest mb-4">Recordista da Semana</div>
                        <h3 className="text-4xl lg:text-6xl font-black uppercase italic text-white mb-2 leading-none">{MOCK_SONGS[0].title}</h3>
                        <p className="text-2xl text-slate-400 font-bold mb-8">{MOCK_SONGS[0].artist}</p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button className="px-8 py-3 rounded-xl bg-white text-background-dark font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                <span className="material-symbols-outlined filled">play_arrow</span> Ouvir Agora
                            </button>
                            <button className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-white font-bold transition-all">
                                <span className="material-symbols-outlined">favorite</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {MOCK_SONGS.concat(MOCK_SONGS).concat(MOCK_SONGS).map((song, i) => (
                    <div key={i} className="group flex items-center gap-6 p-4 rounded-3xl bg-surface-dark/50 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer">
                        <span className={`text-3xl font-black italic w-12 text-center ${i === 0 ? 'text-primary' : 'text-slate-700 group-hover:text-primary transition-colors'}`}>
                            {(i + 1).toString().padStart(2, '0')}
                        </span>

                        <img src={song.coverUrl} className="size-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />

                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-black text-white truncate">{song.title}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase">{song.artist}</p>
                        </div>

                        <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${song.rating}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-primary">{song.rating}% Aprovado</span>
                        </div>

                        <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
