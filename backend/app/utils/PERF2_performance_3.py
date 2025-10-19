// src/components/mixer/AudioEffects.tsx
import React from 'react';

// Lazy load heavy audio processing libraries
const AudioEffectsProcessor = React.lazy(() => import('./AudioEffectsProcessor'));
const VisualizerComponent = React.lazy(() => import('./VisualizerComponent'));

interface Props {
  trackId: string;
}

const AudioEffects: React.FC<Props> = ({ trackId }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="audio-effects">
        <AudioEffectsProcessor trackId={trackId} />
        <VisualizerComponent trackId={trackId} />
      </div>
    </Suspense>
  );
};

export default AudioEffects;
