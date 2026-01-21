
import React, { useState } from 'react';
import { processSongRequest } from '../services/geminiService';
import { saveSongRequest } from '../services/supabaseService';

export const Request: React.FC = () => {
    const [step, setStep] = useState(1);
    const [song, setSong] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Save to Supabase
            await saveSongRequest(song, name, message);

            // Generate AI Response (Mock or Real) - Keeping Gemini Service for the "DJ Interaction" part
            const response = await processSongRequest(song);
            setAiResponse(response);

            setStep(3); // Success Screen
        } catch (error) {
            console.error("Failed to submit request", error);
            alert("Erro ao enviar pedido. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            {/* Step 1: Input Form */}
            {step === 1 && (
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-12">
                        <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">Peça sua <span className="text-primary">Música</span></h2>
                        <p className="text-lg text-slate-400 font-medium">Conecte-se com o estúdio agora.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <div className="relative">
                                <input
                                    required
                                    value={song}
                                    onChange={(e) => setSong(e.target.value)}
                                    className="w-full bg-surface-dark border-2 border-white/5 rounded-2xl p-6 pl-14 text-xl font-bold text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 outline-none"
                                    placeholder="Qual louvor você quer ouvir?"
                                />
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-2xl group-focus-within:text-primary transition-colors">search</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-dark border-2 border-white/5 rounded-2xl p-5 text-white font-bold focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 outline-none"
                                placeholder="Seu Nome"
                            />
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-surface-dark border-2 border-white/5 rounded-2xl p-5 text-white font-bold focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-600 outline-none"
                                placeholder="Dedicatória (Opcional)"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-background-dark font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="size-5 border-4 border-background-dark border-t-transparent rounded-full animate-spin"></span>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    Enviar Pedido <span className="material-symbols-outlined font-black">send</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Step 3: Success "Magic" */}
            {step === 3 && (
                <div className="text-center max-w-2xl animate-in zoom-in duration-500">
                    <div className="size-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(6,182,212,0.6)] animate-bounce">
                        <span className="material-symbols-outlined text-background-dark text-6xl font-black">check</span>
                    </div>

                    <h2 className="text-5xl font-black uppercase italic text-white mb-6">Pedido Confirmado!</h2>

                    {/* AI Response Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-primary/30 relative overflow-hidden mb-10">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                        <div className="flex items-start gap-4 text-left">
                            <div className="size-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary">smart_toy</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Resposta do Estúdio</p>
                                <p className="text-xl font-medium text-slate-200 leading-relaxed">"{aiResponse}"</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => { setStep(1); setSong(''); }} className="text-slate-400 hover:text-white font-bold uppercase tracking-widest text-sm hover:underline underline-offset-8 transition-all">
                        Pedir outro louvor
                    </button>
                </div>
            )}
        </div>
    );
};
