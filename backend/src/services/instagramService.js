const NodeCache = require('node-cache');
const config = require('../config');
const { logger } = require('../lib/logger');

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 25;
const DEFAULT_CACHE_TTL_SECONDS = 300;
const DEFAULT_TIMEOUT_MS = 5000;

class InstagramServiceError extends Error {
  constructor(message, { code = 'instagram_error', statusCode = 500 } = {}) {
    super(message);
    this.name = 'InstagramServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class InstagramNotConfiguredError extends InstagramServiceError {
  constructor() {
    super('Instagram integration is not configured', {
      code: 'instagram_not_configured',
      statusCode: 503
    });
  }
}

const cache = new NodeCache({
  stdTTL: config.integrations?.instagram?.cacheTtlSeconds ?? DEFAULT_CACHE_TTL_SECONDS,
  checkperiod: 120,
  useClones: false
});

function getBaseUrl() {
  const raw = config.integrations?.instagram?.graphApiBaseUrl || 'https://graph.facebook.com/v19.0/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function getTimeoutMs() {
  const configured = config.integrations?.instagram?.requestTimeoutMs;
  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_TIMEOUT_MS;
}

function sanitizeLimit(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.min(parsed, MAX_LIMIT);
  }

  return DEFAULT_LIMIT;
}

function toSafeNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed);
}

function resolveVideoSource(media) {
  if (!media) {
    return { url: null, poster: null };
  }

  const type = typeof media.media_type === 'string' ? media.media_type.toUpperCase() : '';
  const productType = typeof media.media_product_type === 'string' ? media.media_product_type.toUpperCase() : '';
  const isVideo = type === 'VIDEO' || type === 'REEL' || productType === 'REELS' || productType === 'VIDEO';

  if (isVideo && media.media_url) {
    return { url: media.media_url, poster: media.thumbnail_url || media.media_url || null };
  }

  const childrenSource = media.children && Array.isArray(media.children.data) ? media.children.data : media.children;
  const children = Array.isArray(childrenSource) ? childrenSource : [];

  if (children.length) {
    let fallback = null;
    for (const child of children) {
      const childType = typeof child?.media_type === 'string' ? child.media_type.toUpperCase() : '';
      const childProduct = typeof child?.media_product_type === 'string' ? child.media_product_type.toUpperCase() : '';
      const candidate = resolveVideoSource(child);
      if (candidate.url && (childType === 'VIDEO' || childType === 'REEL' || childProduct === 'REELS' || childProduct === 'VIDEO')) {
        return candidate;
      }
      if (!fallback && candidate.url) {
        fallback = candidate;
      }
    }

    if (fallback) {
      return fallback;
    }
  }

  if (media.media_url) {
    return { url: media.media_url, poster: media.thumbnail_url || media.media_url || null };
  }

  return { url: media.thumbnail_url || null, poster: media.thumbnail_url || null };
}

function resolveAudioTitle(media) {
  if (!media) {
    return 'Original audio';
  }

  if (media.music && typeof media.music === 'object') {
    if (media.music.song) {
      return media.music.song;
    }
    if (media.music.title) {
      return media.music.title;
    }
  }

  if (media.audio_title) {
    return media.audio_title;
  }

  if (media.video_title) {
    return media.video_title;
  }

  if (media.caption) {
    return media.caption.split('\n')[0].slice(0, 80) || 'Original audio';
  }

  return 'Original audio';
}

function buildAudioSources(media) {
  const sources = [];
  if (media && media.audio_url) {
    sources.push({ src: media.audio_url, type: 'audio/mpeg' });
  }
  if (Array.isArray(media?.audio_sources)) {
    for (const source of media.audio_sources) {
      if (source && source.url) {
        sources.push({ src: source.url, type: source.mime_type || 'audio/mpeg' });
      }
    }
  }

  return sources;
}

function mapInstagramMediaToReel(media) {
  if (!media || typeof media !== 'object') {
    return null;
  }

  const id = media.id || media.pk || null;
  if (!id) {
    return null;
  }

  const { url: videoUrl, poster } = resolveVideoSource(media);
  if (!videoUrl) {
    return null;
  }

  const likes = media.like_count ?? media.likes ?? 0;
  const views = media.play_count ?? media.video_play_count ?? media.views ?? 0;

  return {
    id: String(id),
    videoUrl,
    posterUrl: poster,
    audioTitle: resolveAudioTitle(media),
    audioSources: buildAudioSources(media),
    downloadUrl: media.download_url || videoUrl,
    likes: toSafeNumber(likes),
    views: toSafeNumber(views),
    description: media.caption || '',
    permalink: media.permalink || null,
    captions: media.caption_url || null,
    publishedAt: media.timestamp ? new Date(media.timestamp).toISOString() : null
  };
}

async function fetchFromInstagram(url, { timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.integrations?.instagram?.accessToken}`
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn(
        {
          status: response.status,
          endpoint: url.toString(),
          body: text ? text.slice(0, 500) : undefined
        },
        'Instagram API responded with non-success status'
      );
      throw new InstagramServiceError(
        `Instagram API responded with ${response.status}${text ? `: ${text}` : ''}`,
        { code: 'instagram_api_error', statusCode: response.status }
      );
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      logger.warn({ endpoint: url.toString(), timeoutMs }, 'Instagram API request timed out');
      throw new InstagramServiceError('Instagram API request timed out', {
        code: 'instagram_timeout',
        statusCode: 504
      });
    }

    if (error instanceof InstagramServiceError) {
      throw error;
    }

    logger.error({ err: error, endpoint: url.toString() }, 'Instagram API request failed');
    throw new InstagramServiceError(error.message || 'Instagram API request failed');
  } finally {
    clearTimeout(timeout);
  }
}

async function getReels({ limit, after } = {}) {
  if (!config.integrations?.instagram?.enabled) {
    throw new InstagramNotConfiguredError();
  }

  const pageLimit = sanitizeLimit(limit);
  const cursor = typeof after === 'string' && after.length ? after : null;
  const cacheKey = `reels:${pageLimit}:${cursor || 'start'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = new URL(`${config.integrations.instagram.igBusinessId}/media`, getBaseUrl());
  url.searchParams.set('limit', String(pageLimit));
  url.searchParams.set(
    'fields',
    [
      'id',
      'media_type',
      'media_product_type',
      'media_url',
      'thumbnail_url',
      'permalink',
      'caption',
      'timestamp',
      'like_count',
      'play_count',
      'video_title',
      'audio_title',
      'audio_url',
      'children{media_type,media_product_type,media_url,thumbnail_url}',
      'comments_count'
    ].join(',')
  );
  if (cursor) {
    url.searchParams.set('after', cursor);
  }

  const timeoutMs = getTimeoutMs();
  const payload = await fetchFromInstagram(url, { timeoutMs });

  const reels = Array.isArray(payload?.data)
    ? payload.data.map(mapInstagramMediaToReel).filter(Boolean)
    : [];

  const nextCursor = payload?.paging?.cursors?.after || null;
  const previousCursor = payload?.paging?.cursors?.before || null;
  const result = {
    reels,
    paging: {
      nextCursor,
      previousCursor,
      hasMore: Boolean(payload?.paging?.next),
      total: typeof payload?.summary?.total_count === 'number' ? payload.summary.total_count : null
    }
  };

  const ttlSeconds = config.integrations?.instagram?.cacheTtlSeconds;
  const cacheTtl = Number.isFinite(ttlSeconds) ? Math.max(0, ttlSeconds) : DEFAULT_CACHE_TTL_SECONDS;
  cache.set(cacheKey, result, cacheTtl);

  return result;
}

module.exports = {
  getReels,
  mapInstagramMediaToReel,
  InstagramServiceError,
  InstagramNotConfiguredError
};
