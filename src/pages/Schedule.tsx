import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const DAYS_MAP = [
    { label: 'DOM', value: 0 },
    { label: 'SEG', value: 1 },
    { label: 'TER', value: 2 },
    { label: 'QUA', value: 3 },
    { label: 'QUI', value: 4 },
    { label: 'SEX', value: 5 },
    { label: 'SAB', value: 6 },
];

interface ScheduleItem {
    id: string;
    program_name: string;
    host_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export const Schedule: React.FC = () => {
    const [activeDay, setActiveDay] = useState(1); // Default Segunda (1)
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        const { data } = await supabase
            .from('schedule')
            .select('*')
            .order('start_time');

        if (data) {
            setScheduleData(data);
        }
        setIsLoading(false);
    };

    const activeItems = scheduleData.filter(item => item.day_of_week === activeDay);

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
                {DAYS_MAP.map((day) => (
                    <button
                        key={day.value}
                        onClick={() => setActiveDay(day.value)}
                        className={`
              px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all whitespace-nowrap
              ${activeDay === day.value
                                ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                                : 'bg-surface-dark border border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                            }
            `}
                    >
                        {day.label}
                    </button>
                ))}
            </div>

            {/* Schedule Grid */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center text-slate-500 animate-pulse">Carregando programação...</div>
                ) : activeItems.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-slate-500">
                        Nenhuma programação cadastrada para este dia.
                    </div>
                ) : (
                    activeItems.map((item, i) => {
                        // Color coding logic based on index
                        const colors = [
                            'border-l-primary shadow-[inset_10px_0_20px_-10px_rgba(6,182,212,0.1)]',
                            'border-l-accent-gold shadow-[inset_10px_0_20px_-10px_rgba(245,158,11,0.1)]',
                            'border-l-accent-magenta shadow-[inset_10px_0_20px_-10px_rgba(217,70,239,0.1)]'
                        ];
                        const accentColor = colors[i % colors.length];

                        return (
                            <div key={item.id} className={`bg-card-dark p-6 rounded-2xl border border-white/5 border-l-4 ${accentColor} flex flex-col md:flex-row items-center gap-6 group hover:bg-white/5 transition-colors`}>
                                {/* Time */}
                                <div className="flex flex-col items-center justify-center min-w-[120px]">
                                    <span className="text-2xl font-black text-white">{item.start_time.substring(0, 5)}</span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">até {item.end_time.substring(0, 5)}</span>
                                </div>

                                {/* Program Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-primary transition-colors">{item.program_name}</h3>
                                    <p className="text-slate-400 font-medium mt-1">Apresentado por <span className="text-white font-bold">{item.host_name}</span></p>
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
                    })
                )}
            </div>
        </div>
    );
};
