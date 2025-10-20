// src/components/VideoGallery.jsx

import { useState } from 'react';
import styles from './VideoGallery.module.css';

const videoContent = [
  {
    id: 1,
    title: 'DJ Setup Process',
    description: 'Watch how we set up our premium equipment for events',
    videoUrl: '/videos/setup-process.mp4',
    thumbnail: '/images/setup-thumbnail.jpg',
    captions: '/captions/setup-process.vtt',
  },
  {
    id: 2,
    title: 'Behind the Scenes',
    description: 'Get an exclusive look at our DJs in action',
    videoUrl: '/videos/behind-scenes.mp4',
    thumbnail: '/images/bts-thumbnail.jpg',
    captions: '/captions/behind-scenes.vtt',
  },
  // Add more videos as needed
];

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);

  const handleVideoError = () => {
    setError('Failed to load video. Please try again later.');
  };

  return (
    <section className={styles.videoGallery}>
      <h2>Behind The Scenes</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.videoGrid}>
        {videoContent.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            {selectedVideo === video.id ? (
              <div className={styles.videoPlayer}>
                <video
                  controls
                  autoPlay
                  onError={handleVideoError}
                  poster={video.thumbnail}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  <track
                    kind="captions"
                    src={video.captions}
                    label="English captions"
                    srclang="en"
                    default
                  />
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              <button
                className={styles.thumbnail}
                onClick={() => setSelectedVideo(video.id)}
                type="button"
                aria-label={`Play ${video.title}`}
              >
                <img src={video.thumbnail} alt={video.title} />
                <div className={styles.playButton}>▶</div>
              </button>
            )}
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoGallery;
