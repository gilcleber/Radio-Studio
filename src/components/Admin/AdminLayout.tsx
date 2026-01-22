import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { subscribeToNewRequests, getPendingRequestsCount, playNotificationSound } from '../../services/notificationService';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Buscar contagem inicial
        loadPendingCount();

        // Subscrever para novos pedidos
        const channel = subscribeToNewRequests((request) => {
            // Reproduzir som de notificação
            playNotificationSound();

            // Atualizar contagem
            loadPendingCount();

            // Mostrar notificação do navegador (se permitido)
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Novo Pedido Musical! 🎵', {
                    body: `${request.user_name}: ${request.song_title}`,
                    icon: '/logo.png'
                });
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    const loadPendingCount = async () => {
        const count = await getPendingRequestsCount();
        setPendingCount(count);
    };

    // Solicitar permissão para notificações
    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    // Sidebar Item Component with Badge Support
    const SidebarItem = ({ to, icon, label, badge }: { to: string; icon: string; label: string; badge?: number }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive
                    ? 'bg-primary text-background-dark font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
            }
        >
            <span className="material-symbols-outlined">{icon}</span>
            {isSidebarOpen && <span>{label}</span>}
            {badge && badge > 0 && (
                <span className="ml-auto size-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center animate-pulse">
                    {badge > 99 ? '99+' : badge}
                </span>
            )}
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-background-dark text-white overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-surface-dark border-r border-white/5 flex flex-col transition-all duration-300 relative z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <h1 className="font-display font-black text-2xl italic tracking-tighter text-white">
                            RADIO <span className="text-primary">ADMIN</span>
                        </h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="text-slate-400 hover:text-white"
                    >
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                    <SidebarItem to="/admin" icon="dashboard" label="Painel" />
                    <div className="my-4 h-px bg-white/5 mx-4" />
                    <p className={`px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ${!isSidebarOpen && 'hidden'}`}>Gerenciador</p>
                    <SidebarItem to="/admin/settings" icon="settings" label="Configurações" />
                    <SidebarItem to="/admin/settings-advanced" icon="tune" label="Config. Avançadas" />
                    <SidebarItem to="/admin/songs" icon="library_music" label="Biblioteca" />
                    <SidebarItem to="/admin/team" icon="groups" label="Equipe" />
                    <SidebarItem to="/admin/schedule" icon="calendar_month" label="Programação" />
                    <SidebarItem to="/admin/requests" icon="inbox" label="Pedidos" badge={pendingCount} />
                    <SidebarItem to="/admin/banners" icon="image" label="Banners" />
                    <div className="my-4 h-px bg-white/5 mx-4" />
                    <SidebarItem to="/admin/streams" icon="radio" label="Streams" />
                    <SidebarItem to="/admin/now-playing" icon="album" label="Agora no Ar" />
                    <SidebarItem to="/admin/theme" icon="palette" label="Tema" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {isSidebarOpen && <span>Sair do Admin</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-background-dark relative overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 bg-surface-dark/50 backdrop-blur flex items-center justify-between px-6">
                    <h2 className="text-lg font-bold text-slate-300">Painel de Controle</h2>
                    <div className="flex items-center gap-4">
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-bold">
                                <span className="material-symbols-outlined text-base animate-pulse">notifications</span>
                                {pendingCount} {pendingCount === 1 ? 'pedido' : 'pedidos'}
                            </div>
                        )}
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                        <span className="text-sm font-bold text-white">Admin</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
