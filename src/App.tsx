
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Request } from './pages/Request';
import { Charts } from './pages/Charts';
import { Library } from './pages/Library';
import { Team } from './pages/Team';
import { AdminLayout } from './components/Admin/AdminLayout';
import { SettingsManager } from './pages/Admin/SettingsManager';
import { TeamManager } from './pages/Admin/TeamManager';
import { SongManager } from './pages/Admin/SongManager';
import { ScheduleManager } from './pages/Admin/ScheduleManager';

const DashboardPlaceholder = () => <div className="p-8 text-center text-slate-400">Bem-vindo ao Painel Administrativo. Selecione uma opção no menu.</div>;

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Public Frontend Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="charts" element={<Charts />} />
                    <Route path="request" element={<Request />} />
                    <Route path="library" element={<Library />} />
                    <Route path="team" element={<Team />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPlaceholder />} />
                    <Route path="settings" element={<SettingsManager />} />
                    <Route path="team" element={<TeamManager />} />
                    <Route path="songs" element={<SongManager />} />
                    <Route path="schedule" element={<ScheduleManager />} />
                    <Route path="*" element={<DashboardPlaceholder />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
