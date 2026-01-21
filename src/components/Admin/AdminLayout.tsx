import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Simple Sidebar Item Component
    const SidebarItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-primary text-background-dark font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
            }
        >
            <span className="material-symbols-outlined">{icon}</span>
            {isSidebarOpen && <span>{label}</span>}
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
                    <SidebarItem to="/admin/songs" icon="library_music" label="Biblioteca" />
                    <SidebarItem to="/admin/team" icon="groups" label="Equipe" />
                    <SidebarItem to="/admin/schedule" icon="calendar_month" label="Programação" />
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
