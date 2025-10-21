import { useEffect, useMemo, useRef, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import {
  useGeneratedContentConfig,
  type InstagramReelsFeedConfig as SharedReelsFeedConfig,
} from '../../context/GeneratedContentConfigContext'
import styles from './InstagramReelsSection.module.css'

type ReelAudioSource = {
  src: string
  type: string
}

type Reel = {
  id: string
  videoUrl: string
  audioTitle: string
  audioSources: ReelAudioSource[]
  downloadUrl: string
  likes: number
  views: number
  description: string
  captions?: string
  thumbnailUrl?: string
}

type ReelsFeedConfig = Omit<SharedReelsFeedConfig, 'transform' | 'mockData'> & {
  transform?: (payload: unknown) => Reel[] | Promise<Reel[]>
  mockData?: Reel[]
}

const DEFAULT_RATE_LIMIT_MS = 60_000

const parseNumber = (value: unknown): number => {
  const asNumber = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(asNumber)) {
    return asNumber
  }

  return 0
}

const parseString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const normaliseAudioSources = (value: unknown, downloadUrl: string): ReelAudioSource[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (
          entry &&
          typeof entry === 'object' &&
          'src' in entry &&
          typeof (entry as { src: unknown }).src === 'string'
        ) {
          const type = parseString((entry as { type?: unknown }).type)
          return { src: (entry as { src: string }).src, type: type ?? 'audio/mpeg' }
        }
        return null
      })
      .filter((entry): entry is ReelAudioSource => Boolean(entry))
  }

  const audioUrl = parseString(value)
  if (audioUrl) {
    return [
      {
        src: audioUrl,
        type: 'audio/mpeg',
      },
    ]
  }

  return downloadUrl ? [{ src: downloadUrl, type: 'audio/mpeg' }] : []
}

const normaliseReelRecord = (record: unknown): Reel | null => {
  if (!record || typeof record !== 'object') {
    return null
  }

  const data = record as Record<string, unknown>
  const videoUrl =
    parseString(data.videoUrl) ??
    parseString(data.video_url) ??
    parseString(data.media_url) ??
    parseString(data.permalink) ??
    undefined

  if (!videoUrl) {
    return null
  }

  const id = parseString(data.id) ?? videoUrl
  const downloadUrl = parseString(data.downloadUrl) ?? videoUrl
  const audioTitle =
    parseString(data.audioTitle) ?? parseString(data.audio_title) ?? parseString(data.song_title) ?? 'DJ Performance'
  const likes = parseNumber(data.likes ?? data.like_count)
  const views = parseNumber(data.views ?? data.view_count ?? data.play_count)
  const description =
    parseString(data.description) ?? parseString(data.caption) ?? 'Bekijk onze laatste DJ-optredens!'
  const captions = parseString(data.captions ?? data.captions_url ?? data.captionUrl)
  const thumbnailUrl =
    parseString(data.thumbnailUrl) ?? parseString(data.thumbnail_url) ?? parseString(data.thumbnail)
  const audioSources = normaliseAudioSources(data.audioSources ?? data.audio_sources ?? data.audioUrl, downloadUrl)

  return {
    id,
    videoUrl,
    audioTitle,
    audioSources,
    downloadUrl,
    likes,
    views,
    description,
    captions: captions ?? undefined,
    thumbnailUrl: thumbnailUrl ?? undefined,
  }
}

const normaliseReelsArray = (value: unknown): Reel[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => normaliseReelRecord(entry))
      .filter((entry): entry is Reel => Boolean(entry))
  }

  if (typeof value === 'object' && value !== null && Array.isArray((value as { data?: unknown }).data)) {
    return normaliseReelsArray((value as { data: unknown }).data)
  }

  return []
}

const ensureReels = (value: unknown): Reel[] => {
  const normalised = normaliseReelsArray(value)
  if (normalised.length) {
    return normalised
  }
  return []
}

const MOCK_REELS: Reel[] = [
  {
    id: '1',
    videoUrl: '/videos/dj-event-1.mp4',
    audioTitle: 'Trending Song 1',
    audioSources: [
      {
        src: 'https://cdn.pixabay.com/download/audio/2023/10/12/audio_4a4d2d51cb.mp3?filename=future-bass-hip-hop-169380.mp3',
        type: 'audio/mpeg',
      },
      {
        src: 'https://cdn.pixabay.com/download/audio/2023/10/12/audio_a0ecb26227.ogg?filename=future-bass-hip-hop-169380.ogg',
        type: 'audio/ogg',
      },
    ],
    downloadUrl:
      'https://cdn.pixabay.com/download/audio/2023/10/12/audio_4a4d2d51cb.mp3?filename=future-bass-hip-hop-169380.mp3',
    likes: 1200,
    views: 5000,
    description: 'Amazing wedding party! 🎵 #DJLife',
    captions: '/captions/dj-event-1.vtt',
    thumbnailUrl: '/images/reel-thumbnail.jpg',
  },
]

const normaliseFeedConfig = (config?: SharedReelsFeedConfig | ReelsFeedConfig): ReelsFeedConfig | undefined => {
  if (!config) {
    return undefined
  }

  const typedConfig = config as ReelsFeedConfig
  return {
    ...typedConfig,
    mockData: typedConfig.mockData ?? undefined,
    transform: typedConfig.transform,
  }
}

interface InstagramReelsSectionProps {
  feedConfig?: ReelsFeedConfig
}

const InstagramReelsSection = ({ feedConfig }: InstagramReelsSectionProps) => {
  const generatedConfig = useGeneratedContentConfig()
  const instagramReelsFeed = generatedConfig.dataFeeds?.instagramReels
  const contextFeed = useMemo(
    () => normaliseFeedConfig(instagramReelsFeed),
    [instagramReelsFeed],
  )

  const resolvedFeedConfig = useMemo<ReelsFeedConfig>(() => {
    const baseConfig = feedConfig ?? contextFeed ?? { source: 'mock', mockData: MOCK_REELS }
    const mockData = baseConfig.mockData ? ensureReels(baseConfig.mockData) : MOCK_REELS
    return {
      ...baseConfig,
      mockData: mockData.length ? mockData : MOCK_REELS,
    }
  }, [contextFeed, feedConfig])

  const [reels, setReels] = useState<Reel[]>(resolvedFeedConfig.mockData ?? MOCK_REELS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const lastFetchRef = useRef<number | null>(null)
  const previousEndpointRef = useRef<string | undefined>()

  useEffect(() => {
    if (resolvedFeedConfig.endpoint !== previousEndpointRef.current) {
      lastFetchRef.current = null
      previousEndpointRef.current = resolvedFeedConfig.endpoint
    }

    let isMounted = true
    const abortController = new AbortController()

    const loadReels = async () => {
      setIsLoading(true)
      setError(null)

      if (resolvedFeedConfig.source === 'mock') {
        setReels(resolvedFeedConfig.mockData ?? MOCK_REELS)
        setIsLoading(false)
        setIsRateLimited(false)
        return
      }

      if (!resolvedFeedConfig.endpoint) {
        setError('Geen endpoint geconfigureerd voor Instagram Reels')
        setIsLoading(false)
        return
      }

      const rateLimitMs = resolvedFeedConfig.rateLimitMs ?? DEFAULT_RATE_LIMIT_MS
      if (rateLimitMs > 0 && lastFetchRef.current) {
        const elapsed = Date.now() - lastFetchRef.current
        if (elapsed < rateLimitMs) {
          setIsLoading(false)
          setIsRateLimited(true)
          return
        }
      }

      lastFetchRef.current = Date.now()
      setIsRateLimited(false)

      try {
        const payload = await apiClient.get<unknown>(resolvedFeedConfig.endpoint, {
          ...(resolvedFeedConfig.requestOptions ?? {}),
          signal: abortController.signal,
        })

        if (!isMounted) {
          return
        }

        const transformed = resolvedFeedConfig.transform
          ? await Promise.resolve(resolvedFeedConfig.transform(payload))
          : normaliseReelsArray(payload)

        const nextReels = ensureReels(transformed)
        setReels(nextReels.length ? nextReels : resolvedFeedConfig.mockData ?? MOCK_REELS)
        setIsLoading(false)
      } catch (fetchError) {
        if (abortController.signal.aborted || !isMounted) {
          return
        }

        console.error(fetchError)
        setError('Failed to load Instagram Reels')
        setIsLoading(false)
      }
    }

    void loadReels()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [resolvedFeedConfig])

  if (isLoading) return <div className={styles.loader}>Loading...</div>
  if (error)
    return (
      <div className={styles.error} role="alert">
        {error}
      </div>
    )

  return (
    <section className={styles.reelsSection}>
      <h2>Latest DJ Performances</h2>
      {isRateLimited ? (
        <p className={styles.rateLimit} role="status">
          Content recently refreshed. Please wait before requesting new reels.
        </p>
      ) : null}
      <div className={styles.reelsGrid}>
        {reels.map((reel) => (
          <div key={reel.id} className={styles.reelCard}>
            <div className={styles.videoContainer}>
              <video
                controls
                playsInline
                poster={reel.thumbnailUrl ?? '/images/reel-thumbnail.jpg'}
                className={styles.video}
              >
                <source src={reel.videoUrl} type="video/mp4" />
                {reel.captions ? (
                  <track kind="captions" src={reel.captions} label="English captions" srclang="en" default />
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
                      <source key={`${reel.id}-${source.type}`} src={source.src} type={source.type} />
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
  )
}

export default InstagramReelsSection
