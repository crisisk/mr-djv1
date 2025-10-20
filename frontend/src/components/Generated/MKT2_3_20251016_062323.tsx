import { useState, useEffect } from 'react';
import styles from './InstagramReelsSection.module.css';

type ReelAudioSource = {
  src: string;
  type: string;
};

type Reel = {
  id: string;
  videoUrl: string;
  audioTitle: string;
  audioSources: ReelAudioSource[];
  downloadUrl: string;
  likes: number;
  views: number;
  description: string;
};

const MOCK_REELS: Reel[] = [
  {
    id: '1',
    videoUrl: '/videos/dj-event-1.mp4',
    audioTitle: 'Trending Song 1',
    audioSources: [
      {
        src: 'https://cdn.pixabay.com/download/audio/2023/10/12/audio_4a4d2d51cb.mp3?filename=future-bass-hip-hop-169380.mp3',
        type: 'audio/mpeg'
      },
      {
        src: 'https://cdn.pixabay.com/download/audio/2023/10/12/audio_a0ecb26227.ogg?filename=future-bass-hip-hop-169380.ogg',
        type: 'audio/ogg'
      }
    ],
    downloadUrl:
      'https://cdn.pixabay.com/download/audio/2023/10/12/audio_4a4d2d51cb.mp3?filename=future-bass-hip-hop-169380.mp3',
    likes: 1200,
    views: 5000,
    description: 'Amazing wedding party! 🎵 #DJLife'
  }
  // Add more mock reels
];

const InstagramReelsSection = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        // TODO: Replace with actual Instagram API call
        setReels(MOCK_REELS);
        setIsLoading(false);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load Instagram Reels');
        setIsLoading(false);
      }
    };

    fetchReels();
  }, []);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error} role="alert">{error}</div>;

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
              {reel.audioSources?.length ? (
                <div className={styles.audioPlayer}>
                  <audio
                    className={styles.audioElement}
                    controls
                    preload="metadata"
                    aria-label={`Audio track for ${reel.audioTitle}`}
                  >
                    {reel.audioSources.map((source) => (
                      <source key={source.type} src={source.src} type={source.type} />
                    ))}
                    <span>
                      Your browser does not support embedded audio.{' '}
                      <a href={reel.downloadUrl} download>
                        Download {reel.audioTitle}
                      </a>
                    </span>
                  </audio>
                  <a
                    className={styles.audioDownload}
                    href={reel.downloadUrl}
                    download
                    aria-label={`Download ${reel.audioTitle}`}
                  >
                    Download track
                  </a>
                </div>
              ) : null}
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
