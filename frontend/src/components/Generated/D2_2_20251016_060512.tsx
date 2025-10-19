// components/VideoGallery.jsx
import React, { useState } from 'react';
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
          <div 
            key={video.id} 
            className={styles.videoCard}
            onClick={() => setSelectedVideo(video)}
          >
            <img 
              src={video.thumbnail} 
              alt={video.title}
              loading="lazy"
            />
            <h3>{video.title}</h3>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedVideo(null)}
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
