// src/pages/MixerConsole.tsx
import React, { useState } from 'react';

const AudioEffects = React.lazy(() => import('../components/mixer/AudioEffects'));

const MixerConsole: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  return (
    <div className="mixer-console">
      <h1>DJ Mixer Console</h1>
      
      {/* Main mixer controls */}
      <div className="mixer-controls">
        {/* ... other mixer controls ... */}
      </div>

      {/* Lazy load effects when a track is selected */}
      {selectedTrack && (
        <Suspense fallback={<LoadingSpinner />}>
          <AudioEffects trackId={selectedTrack} />
        </Suspense>
      )}
    </div>
  );
};

export default MixerConsole;
