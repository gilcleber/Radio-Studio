
import React from 'react';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-background-dark text-slate-100 overflow-hidden font-sans relative selection:bg-primary/30">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 size-[600px] bg-primary/5 blur-[180px] pointer-events-none -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 size-[400px] bg-accent-blue/5 blur-[140px] pointer-events-none -z-10"></div>

            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-32">
                    <Outlet />
                </div>

                {/* Player (Fixed Bottom) */}
                <Player />
            </main>
        </div>
    );
};
