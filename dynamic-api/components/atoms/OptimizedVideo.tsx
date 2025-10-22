'use client';

import React, { useRef, useState } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  preload?: 'metadata' | 'none' | 'auto';
  onPlay?: () => void;
  onEnded?: () => void;
}

/**
 * OptimizedVideo Component
 * Video player with poster, controls, and performance optimization
 *
 * @example
 * ```tsx
 * <OptimizedVideo
 *   src="/media/videos/hero/dj-showreel.mp4"
 *   poster="/media/optimized/thumbnails/videos/dj-showreel.jpg"
 *   autoPlay={false}
 *   controls={true}
 * />
 * ```
 */
const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  className = '',
  preload = 'metadata',
  onPlay,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay && !controls);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      if (onPlay) onPlay();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!loop) setShowPlayButton(true);
    if (onEnded) onEnded();
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full rounded-2xl shadow-xl"
        poster={poster}
        autoPlay={autoPlay}
        muted={autoPlay ? true : muted}
        loop={loop}
        controls={controls}
        playsInline
        preload={preload}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleEnded}
      >
        <source src={src} type="video/mp4" />
        Your browser doesn&apos;t support video playback.
      </video>

      {/* Custom play button overlay (when controls=false) */}
      {showPlayButton && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all rounded-2xl"
          aria-label="Play video"
          type="button"
        >
          <svg
            className="w-20 h-20 text-white opacity-90 hover:opacity-100 transition-opacity"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      )}

      {/* Loading indicator */}
      {isPlaying && videoRef.current?.readyState && videoRef.current.readyState < 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedVideo;
