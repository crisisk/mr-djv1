import { useState, useEffect } from 'react';
import styles from './InstagramReelsSection.module.css';

const mockReels = [
  {
    id: '1',
    videoUrl: '/videos/dj-event-1.mp4',
    audioTitle: 'Trending Song 1',
    likes: 1200,
    views: 5000,
    description: 'Amazing wedding party! 🎵 #DJLife',
    captions: '/captions/dj-event-1.vtt'
  },
  // Add more mock reels
];

const InstagramReelsSection = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        // TODO: Replace with actual Instagram API call
        setReels(mockReels);
        setIsLoading(false);
      } catch (err) {
        console.error('Unable to load mock Instagram reels', err);
        setError('Failed to load Instagram Reels');
        setIsLoading(false);
      }
    };

    fetchReels();
  }, []);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <section className={styles.reelsSection}>
      <h2>Latest DJ Performances</h2>
      <div className={styles.reelsGrid}>
        {reels.map((reel) => (
          <div key={reel.id} className={styles.reelCard}>
            <div className={styles.videoContainer}>
              <video
                controls
                playsInline
                poster="/images/reel-thumbnail.jpg"
                className={styles.video}
              >
                <source src={reel.videoUrl} type="video/mp4" />
                <track
                  kind="captions"
                  src={reel.captions}
                  label="English captions"
                  srclang="en"
                  default
                />
                Your browser does not support video playback.
              </video>
            </div>
            <div className={styles.reelInfo}>
              <p className={styles.audioTitle}>🎵 {reel.audioTitle}</p>
              <div className={styles.stats}>
                <span>❤️ {reel.likes}</span>
                <span>👁️ {reel.views}</span>
              </div>
              <p className={styles.description}>{reel.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramReelsSection;
