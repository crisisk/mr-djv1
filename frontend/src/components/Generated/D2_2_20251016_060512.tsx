// components/VideoGallery.jsx
import { useState } from 'react';
import styles from './VideoGallery.module.css';

const VideoGallery = () => {
  // Sample video data - in production, this would likely come from an API or CMS
  const videos = [
    {
      id: '1',
      title: 'Wedding Party Highlights 2023',
      youtubeId: 'YOUTUBE_VIDEO_ID_1',
      thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_1/maxresdefault.jpg'
    },
    // Add more videos here
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className={styles.videoGallery}>
      <h2>Event Highlights</h2>
      
      <div className={styles.videoGrid}>
        {videos.map(video => (
          <button
            key={video.id}
            type="button"
            className={styles.videoCard}
            onClick={() => setSelectedVideo(video)}
            aria-label={`Play ${video.title}`}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
            />
            <h3>{video.title}</h3>
          </button>
        ))}
      </div>

      {selectedVideo && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`Video player for ${selectedVideo.title}`}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedVideo(null)}
              type="button"
              aria-label="Close video"
            >
              ×
            </button>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoGallery;
