
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BannerDisplay } from '../BannerDisplay';

const navItems = [
    { icon: 'home', label: 'Início', path: '/' },
    { icon: 'calendar_month', label: 'Programação', path: '/schedule' },
    { icon: 'star_rate', label: 'Top 40', path: '/charts' },
    { icon: 'add_to_queue', label: 'Pedir Música', path: '/request' },
    { icon: 'library_music', label: 'Biblioteca', path: '/library' },
    { icon: 'groups', label: 'Equipe', path: '/team' },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-72 border-r border-white/5 bg-background-dark/80 backdrop-blur-xl flex flex-col p-8 shrink-0 z-40 hidden lg:flex h-full overflow-y-auto">
            {/* Logo Area */}
            <NavLink to="/" className="flex items-center gap-4 mb-12 group cursor-pointer">
                <div className="bg-gradient-to-br from-primary to-accent-blue size-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-white font-bold text-2xl">graphic_eq</span>
                </div>
                <div>
                    <h1 className="text-white text-xl font-display font-black leading-none tracking-tight">RADIO<span className="text-primary italic">STUDIO</span></h1>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em] mt-1.5 ml-0.5">O Som Perfeito</p>
                </div>
            </NavLink>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Menu Principal</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
              ${isActive
                                ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-4 border-primary shadow-[inset_0px_0px_20px_rgba(6,182,212,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${item.path === '/request' ? 'text-primary' : ''}`}>{item.icon}</span>
                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Banner Publicitário */}
            <div className="my-6">
                <BannerDisplay position="sidebar" />
            </div>

            {/* User Mini Profile & Admin Link */}
            <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
                {/* Admin Link (Temporary/Hidden-ish) */}
                <NavLink to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    Área Admin
                </NavLink>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-magenta rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                        <img className="size-10 rounded-full object-cover border-2 border-background-dark relative z-10" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black truncate text-white group-hover:text-primary transition-colors">Gil Cleber</p>
                        <p className="text-[10px] text-accent-gold font-bold uppercase tracking-widest">Membro Premium</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
