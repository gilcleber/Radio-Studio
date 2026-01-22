import React, { useEffect, useState } from 'react';
import { getAllStreams, createStream, updateStream, deleteStream, RadioStream } from '../../services/streamService';

export const StreamManager: React.FC = () => {
    const [streams, setStreams] = useState<RadioStream[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<Partial<RadioStream> | null>(null);

    useEffect(() => {
        loadStreams();
    }, []);

    const loadStreams = async () => {
        setIsLoading(true);
        const data = await getAllStreams();
        setStreams(data);
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing || !isEditing.label || !isEditing.stream_url) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            if (isEditing.id) {
                await updateStream(isEditing.id, isEditing);
            } else {
                await createStream({
                    label: isEditing.label,
                    stream_url: isEditing.stream_url,
                    is_active: isEditing.is_active ?? true,
                    display_order: isEditing.display_order ?? 0
                });
            }
            setIsEditing(null);
            loadStreams();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deletar esta stream?')) {
            try {
                await deleteStream(id);
                loadStreams();
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Streams de Rádio</h1>
                    <p className="text-slate-400">Configure múltiplas URLs de streaming</p>
                </div>
                <button
                    onClick={() => setIsEditing({ label: '', stream_url: '', is_active: true, display_order: 0 })}
                    className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span> Nova Stream
                </button>
            </div>

            {/* Form Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl w-full max-w-2xl shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{isEditing.id ? 'Editar' : 'Nova'} Stream</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome/Rótulo</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                    placeholder="Ex: Essência FM HD"
                                    value={isEditing.label || ''}
                                    onChange={e => setIsEditing({ ...isEditing, label: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL do Streaming</label>
                                <input
                                    type="url"
                                    className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary font-mono text-sm"
                                    placeholder="https://..."
                                    value={isEditing.stream_url || ''}
                                    onChange={e => setIsEditing({ ...isEditing, stream_url: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ordem de Exibição</label>
                                    <input
                                        type="number"
                                        className="w-full bg-background-dark border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary"
                                        value={isEditing.display_order || 0}
                                        onChange={e => setIsEditing({ ...isEditing, display_order: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-full">
                                        <input
                                            type="checkbox"
                                            checked={isEditing.is_active ?? true}
                                            onChange={e => setIsEditing({ ...isEditing, is_active: e.target.checked })}
                                            className="size-4"
                                        />
                                        <span className="text-white text-sm font-bold">Stream Ativa</span>
                                    </label>
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

            {/* Streams Table */}
            <div className="glass-panel p-6 rounded-2xl">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Rótulo</th>
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">URL</th>
                            <th className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Status</th>
                            <th className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Ordem</th>
                            <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {streams.map(stream => (
                            <tr key={stream.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 text-white font-bold">{stream.label}</td>
                                <td className="py-4 text-slate-400 text-sm font-mono truncate max-w-xs">{stream.stream_url}</td>
                                <td className="py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${stream.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {stream.is_active ? 'Ativa' : 'Inativa'}
                                    </span>
                                </td>
                                <td className="py-4 text-center text-white">{stream.display_order}</td>
                                <td className="py-4 text-right">
                                    <button onClick={() => setIsEditing(stream)} className="px-3 py-1 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors mr-2">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(stream.id)} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {streams.length === 0 && !isLoading && (
                    <div className="py-12 text-center text-slate-500">
                        Nenhuma stream cadastrada. Adicione a primeira!
                    </div>
                )}
            </div>
        </div>
    );
};
