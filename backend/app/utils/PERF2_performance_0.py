// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load main route components
const Home = React.lazy(() => import('./pages/Home'));
const MixerConsole = React.lazy(() => import('./pages/MixerConsole'));
const PlaylistManager = React.lazy(() => import('./pages/PlaylistManager'));
const Settings = React.lazy(() => import('./pages/Settings'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mixer" element={<MixerConsole />} />
            <Route path="/playlists" element={<PlaylistManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
