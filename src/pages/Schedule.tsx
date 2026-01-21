
import React, { useState } from 'react';
import { WEEKLY_SCHEDULE } from '../constants';

const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

export const Schedule: React.FC = () => {
    const [activeDay, setActiveDay] = useState('SEG');

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-32">
            {/* Header */}
            <div className="mb-12">
                <h2 className="title-glitch text-5xl lg:text-7xl text-white mb-4">Programação</h2>
                <p className="text-slate-400 text-lg font-display tracking-wide">
                    Fique por dentro do que rola no <span className="text-primary font-bold">Studio</span>.
                </p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
                {DAYS.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`
              px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all whitespace-nowrap
              ${activeDay === day
                                ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                                : 'bg-surface-dark border border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                            }
            `}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Schedule Grid */}
            <div className="grid gap-4">
                {WEEKLY_SCHEDULE.map((item, i) => {
                    // Color coding logic based on index for demo purposes (usually would be by category)
                    const colors = [
                        'border-l-primary shadow-[inset_10px_0_20px_-10px_rgba(6,182,212,0.1)]',
                        'border-l-accent-gold shadow-[inset_10px_0_20px_-10px_rgba(245,158,11,0.1)]',
                        'border-l-accent-magenta shadow-[inset_10px_0_20px_-10px_rgba(217,70,239,0.1)]'
                    ];
                    const accentColor = colors[i % colors.length];

                    return (
                        <div key={i} className={`bg-card-dark p-6 rounded-2xl border border-white/5 border-l-4 ${accentColor} flex flex-col md:flex-row items-center gap-6 group hover:bg-white/5 transition-colors`}>

                            {/* Time */}
                            <div className="flex flex-col items-center justify-center min-w-[120px]">
                                <span className="text-2xl font-black text-white">{item.time.split(' - ')[0]}</span>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">até {item.time.split(' - ')[1]}</span>
                            </div>

                            {/* Program Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-primary transition-colors">{item.program}</h3>
                                <p className="text-slate-400 font-medium mt-1">Apresentado por <span className="text-white font-bold">{item.host}</span></p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 transition-all" title="Lembrar-me">
                                    <span className="material-symbols-outlined text-lg">notifications</span>
                                </button>
                                <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all" title="Compartilhar">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
