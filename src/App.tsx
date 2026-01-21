
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Request } from './pages/Request';
import { Charts } from './pages/Charts';
import { Library } from './pages/Library';
import { Team } from './pages/Team';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="charts" element={<Charts />} />
                    <Route path="request" element={<Request />} />
                    <Route path="library" element={<Library />} />
                    <Route path="team" element={<Team />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
