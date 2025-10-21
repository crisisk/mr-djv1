const REQUIRED_ENV = {
  DATABASE_URL: 'postgres://example',
  RENTGUY_API_BASE_URL: 'https://rentguy.example.com',
  RENTGUY_API_KEY: 'test-key',
  SEVENSA_SUBMIT_URL: 'https://sevensa.example.com',
  N8N_PERSONALIZATION_WEBHOOK_URL: 'https://hooks.example.com/personalization',
  SEO_AUTOMATION_API_URL: 'https://seo.example.com',
  SEO_AUTOMATION_API_KEY: 'seo-key',
  SEO_AUTOMATION_KEYWORDSET_ID: 'keyword-set',
  CITY_AUTOMATION_LLM_PROVIDER: 'openai',
  CITY_AUTOMATION_LLM_MODEL: 'gpt-4',
  CITY_AUTOMATION_LLM_API_KEY: 'llm-key',
  META_IG_BUSINESS_ID: '1234567890',
  META_IG_ACCESS_TOKEN: 'token'
};

function loadService() {
  jest.resetModules();
  process.env = { ...process.env, ...REQUIRED_ENV };
  jest.doMock('../lib/logger', () => ({
    logger: {
      warn: jest.fn(),
      error: jest.fn()
    },
    createLogger: jest.fn(() => ({
      warn: jest.fn(),
      error: jest.fn()
    }))
  }));
  return require('../services/instagramService');
}

describe('instagramService.mapInstagramMediaToReel', () => {
  it('normalises Graph API media into reel model', () => {
    const { mapInstagramMediaToReel } = loadService();
    const media = {
      id: '123',
      media_type: 'VIDEO',
      media_product_type: 'REELS',
      media_url: 'https://example.com/video.mp4',
      thumbnail_url: 'https://example.com/poster.jpg',
      caption: 'Main stage at ADE',
      permalink: 'https://instagram.com/p/abc123',
      like_count: 42,
      play_count: 1500,
      video_title: 'Main stage',
      audio_url: 'https://example.com/audio.mp3',
      timestamp: '2024-10-01T12:00:00+0000'
    };

    const reel = mapInstagramMediaToReel(media);

    expect(reel).toEqual(
      expect.objectContaining({
        id: '123',
        videoUrl: media.media_url,
        posterUrl: media.thumbnail_url,
        audioTitle: media.video_title,
        audioSources: [
          {
            src: media.audio_url,
            type: 'audio/mpeg'
          }
        ],
        downloadUrl: media.media_url,
        likes: 42,
        views: 1500,
        description: media.caption,
        permalink: media.permalink,
        publishedAt: new Date(media.timestamp).toISOString()
      })
    );
  });

  it('falls back to child video when parent media lacks video url', () => {
    const { mapInstagramMediaToReel } = loadService();
    const media = {
      id: '456',
      media_type: 'CAROUSEL_ALBUM',
      children: [
        {
          id: 'child1',
          media_type: 'IMAGE',
          media_url: 'https://example.com/image.jpg',
          thumbnail_url: 'https://example.com/thumb.jpg'
        },
        {
          id: 'child2',
          media_type: 'VIDEO',
          media_url: 'https://example.com/video.mp4',
          thumbnail_url: 'https://example.com/poster.jpg'
        }
      ],
      caption: 'Carousel reel'
    };

    const reel = mapInstagramMediaToReel(media);

    expect(reel).toEqual(
      expect.objectContaining({
        id: '456',
        videoUrl: 'https://example.com/video.mp4',
        posterUrl: 'https://example.com/poster.jpg'
      })
    );
  });

  it('returns null for media without video', () => {
    const { mapInstagramMediaToReel } = loadService();
    const media = {
      id: '789',
      media_type: 'IMAGE',
      media_url: null
    };

    expect(mapInstagramMediaToReel(media)).toBeNull();
  });
});
