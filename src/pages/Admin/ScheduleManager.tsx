import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface ScheduleItem {
    id?: string;
    program_name: string;
    host_name: string;
    day_of_week: number; // 0-6
    start_time: string;
    end_time: string;
    category: string;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const ScheduleManager: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [isEditing, setIsEditing] = useState<any | null>(null); // any to allow multi-select days in local state

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        const { data } = await supabase.from('schedule').select('*').order('day_of_week').order('start_time');
        setSchedule(data || []);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;

        const { program_name, host_name, start_time, end_time, category, selectedDays } = isEditing;

        // Validation
        if (!program_name || !host_name || !start_time || !end_time) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        // If 'id' exists, it's a single update
        if (isEditing.id) {
            await supabase.from('schedule').update({
                program_name, host_name, start_time, end_time, category, day_of_week: isEditing.day_of_week
            }).eq('id', isEditing.id);
        } else {
            // New Entry: Check for multiple days
            if (selectedDays && selectedDays.length > 0) {
                const rows = selectedDays.map((dayIndex: number) => ({
                    program_name,
                    host_name,
                    start_time,
                    end_time,
                    category,
                    day_of_week: dayIndex
                }));
                await supabase.from('schedule').insert(rows);
            } else {
                // Fallback (shouldn't happen with UI logic, but safe)
                alert('Selecione pelo menos um dia.');
                return;
            }
        }

        setIsEditing(null);
        fetchSchedule();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza?')) {
            await supabase.from('schedule').delete().eq('id', id);
            fetchSchedule();
        }
    };

    // Helper to toggle days
    const toggleDay = (dayIndex: number) => {
        const current = isEditing.selectedDays || [];
        if (current.includes(dayIndex)) {
            setIsEditing({ ...isEditing, selectedDays: current.filter((d: number) => d !== dayIndex) });
        } else {
            setIsEditing({ ...isEditing, selectedDays: [...current, dayIndex] });
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Grade de Programação</h1>
                    <p className="text-slate-400">Edite os horários e programas da rádio.</p>
                </div>
                <button
                    onClick={() => setIsEditing({ program_name: '', host_name: '', selectedDays: [1], start_time: '08:00', end_time: '12:00', category: 'Live' })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Novo Programa
                </button>
            </div>

            {/* Form Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Novo'} Programa</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Programa</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    value={isEditing.program_name}
                                    onChange={e => setIsEditing({ ...isEditing, program_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apresentador</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    value={isEditing.host_name}
                                    onChange={e => setIsEditing({ ...isEditing, host_name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Day Selection (Conditional Interface) */}
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dias de Exibição</label>
                                {isEditing.id ? (
                                    // Edit Mode: Single Day select (moving between days is cleaner than multi-edit existing)
                                    <select
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.day_of_week}
                                        onChange={e => setIsEditing({ ...isEditing, day_of_week: parseInt(e.target.value) })}
                                    >
                                        {DAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
                                    </select>
                                ) : (
                                    // Create Mode: Checkboxes
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS.map((day, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() => toggleDay(i)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${isEditing.selectedDays?.includes(i)
                                                        ? 'bg-primary text-background-dark ring-2 ring-primary ring-offset-2 ring-offset-background-dark'
                                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {day.substring(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Início</label>
                                    <input
                                        type="time"
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.start_time}
                                        onChange={e => setIsEditing({ ...isEditing, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fim</label>
                                    <input
                                        type="time"
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.end_time}
                                        onChange={e => setIsEditing({ ...isEditing, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-6">
                                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-white hover:scale-105 transition-all">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List Grouped by Day */}
            <div className="space-y-8">
                {DAYS.map((dayName, dayIndex) => {
                    const dayItems = schedule.filter(s => s.day_of_week === dayIndex);
                    if (dayItems.length === 0) return null;

                    return (
                        <div key={dayIndex}>
                            <h3 className="text-xl font-black text-primary italic uppercase tracking-wider mb-4 border-b border-white/10 pb-2">{dayName}</h3>
                            <div className="grid gap-3">
                                {dayItems.map(item => (
                                    <div key={item.id} className="glass-panel p-4 flex items-center gap-6 group hover:border-primary/50 transition-colors">
                                        <div className="w-24 text-center">
                                            <div className="text-xl font-bold text-white">{item.start_time.substring(0, 5)}</div>
                                            <div className="text-xs text-slate-500">{item.end_time.substring(0, 5)}</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-black text-white text-lg">{item.program_name}</div>
                                            <div className="text-sm text-primary font-bold">{item.host_name}</div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setIsEditing({ ...item })} className="size-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                                            <button onClick={() => handleDelete(item.id!)} className="size-8 rounded-full bg-white/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
