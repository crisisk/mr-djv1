import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import styles from './InstagramReelsSection.module.css';

type ReelAudioSource = {
  src: string;
  type: string;
};

export type Reel = {
  id: string;
  videoUrl: string;
  posterUrl?: string | null;
  audioTitle: string;
  audioSources: ReelAudioSource[];
  downloadUrl: string;
  likes: number;
  views: number;
  description: string;
  permalink?: string | null;
  captions?: string | null;
  publishedAt?: string | null;
};

type InstagramReelsResponse = {
  reels: Reel[];
  paging?: {
    nextCursor: string | null;
    previousCursor?: string | null;
    hasMore?: boolean;
    total?: number | null;
  };
};

type CachedPage = {
  cursor: string | null;
  data: Reel[];
  nextCursor: string | null;
};

const PAGE_SIZE = 6;
const START_CURSOR_KEY = 'start';

const InstagramReelsSection = () => {
  const [pages, setPages] = useState<CachedPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCursor, setLoadingCursor] = useState<string | null>(null);
  const pageCache = useRef(new Map<string, CachedPage>());

  const updatePages = useCallback((page: CachedPage) => {
    setPages((current) => {
      const index = current.findIndex((entry) => entry.cursor === page.cursor);
      if (index >= 0) {
        const next = [...current];
        next[index] = page;
        return next;
      }
      return [...current, page];
    });
  }, []);

  const loadPage = useCallback(
    async (cursor: string | null = null, { force = false } = {}) => {
      const cacheKey = cursor ?? START_CURSOR_KEY;

      if (!force && pageCache.current.has(cacheKey)) {
        updatePages(pageCache.current.get(cacheKey)!);
        setInitialised(true);
        return;
      }

      setIsLoading(true);
      setLoadingCursor(cacheKey);
      setError(null);

      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
        if (cursor) {
          params.set('after', cursor);
        }

        const response = await apiClient.get<InstagramReelsResponse>(
          `/integrations/instagram/reels?${params.toString()}`
        );

        const nextCursor = response?.paging?.nextCursor ?? null;
        const page: CachedPage = {
          cursor,
          data: Array.isArray(response?.reels) ? response.reels : [],
          nextCursor
        };

        pageCache.current.set(cacheKey, page);
        updatePages(page);
      } catch (fetchError) {
        console.error('Failed to load Instagram reels', fetchError);
        const message =
          fetchError instanceof Error ? fetchError.message : 'Kon de Instagram reels niet laden.';
        setError(message);
      } finally {
        setIsLoading(false);
        setLoadingCursor(null);
        setInitialised(true);
      }
    },
    [updatePages]
  );

  const handleRetry = useCallback(() => {
    pageCache.current.clear();
    setPages([]);
    setError(null);
    loadPage(null, { force: true }).catch((retryError) => {
      console.error('Retry failed', retryError);
    });
  }, [loadPage]);

  useEffect(() => {
    loadPage().catch((initialError) => {
      console.error('Initial reels fetch failed', initialError);
    });
  }, [loadPage]);

  const reels = useMemo(() => pages.flatMap((page) => page.data), [pages]);
  const nextCursor = useMemo(() => (pages.length ? pages[pages.length - 1].nextCursor : null), [pages]);
  const hasMore = Boolean(nextCursor);
  const currentLoadingKey = loadingCursor ?? undefined;

  if (!initialised && isLoading) {
    return <div className={styles.loader}>Reels aan het laden…</div>;
  }

  if (error && !reels.length) {
    return (
      <div className={styles.error} role="alert">
        <p>{error}</p>
        <button type="button" className={styles.retryButton} onClick={handleRetry}>
          Probeer opnieuw
        </button>
      </div>
    );
  }

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
                poster={reel.posterUrl || '/images/reel-thumbnail.jpg'}
                className={styles.video}
              >
                <source src={reel.videoUrl} type="video/mp4" />
                {reel.captions ? (
                  <track
                    kind="captions"
                    src={reel.captions}
                    label="Ondertitels"
                    srclang="en"
                    default
                  />
                ) : null}
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
              {reel.permalink ? (
                <a
                  href={reel.permalink}
                  className={styles.permalink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Bekijk op Instagram
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {!reels.length && !isLoading && !error ? (
        <div className={styles.emptyState}>Er zijn nog geen reels beschikbaar.</div>
      ) : null}
      {hasMore ? (
        <div className={styles.loadMoreContainer}>
          <button
            type="button"
            className={styles.loadMoreButton}
            onClick={() => {
              loadPage(nextCursor).catch((loadError) => {
                console.error('Failed to load more reels', loadError);
              });
            }}
            disabled={isLoading && currentLoadingKey === (nextCursor ?? START_CURSOR_KEY)}
          >
            {isLoading && currentLoadingKey === (nextCursor ?? START_CURSOR_KEY)
              ? 'Bezig met laden…'
              : 'Laad meer reels'}
          </button>
        </div>
      ) : null}
      {error && reels.length ? (
        <div className={styles.inlineError} role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => loadPage(nextCursor, { force: true })}>
            Opnieuw proberen
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default InstagramReelsSection;
