import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let mockWindow;
let mockIsBrowser = true;

vi.mock('../../lib/environment.js', () => ({
  isBrowser: vi.fn(() => mockIsBrowser),
  getWindow: vi.fn(() => mockWindow),
}));

import * as replicateService from '../replicate.js';

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;

let fetchMock;
let setTimeoutSpy;

function createLocalStorageMock() {
  const store = new Map();
  return {
    store,
    getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
    setItem: vi.fn((key, value) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
}

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock;
  setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout').mockImplementation((callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    return 0;
  });

  mockIsBrowser = true;
  mockWindow = {
    localStorage: createLocalStorageMock(),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  mockWindow = undefined;
  mockIsBrowser = false;
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  } else {
    delete globalThis.fetch;
  }
  globalThis.setTimeout = originalSetTimeout;
});

const { generateHeroImage, getCachedOrGenerateImage, generateCityLandingPageImages } = replicateService;

describe('waitForPrediction via generateHeroImage', () => {
  it('resolves with the first output URL when the prediction succeeds', async () => {
    const responses = [
      Promise.resolve({
        ok: true,
        json: async () => ({ id: 'pred-1' }),
      }),
      Promise.resolve({
        ok: true,
        json: async () => ({ status: 'succeeded', output: ['https://images.example/success.webp'] }),
      }),
    ];

    fetchMock.mockImplementation(() => responses.shift() ?? responses[responses.length - 1]);

    const result = await generateHeroImage({ city: 'Amsterdam' });

    expect(result).toBe('https://images.example/success.webp');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws an informative error when the prediction fails', async () => {
    const responses = [
      Promise.resolve({
        ok: true,
        json: async () => ({ id: 'pred-2' }),
      }),
      Promise.resolve({
        ok: true,
        json: async () => ({ status: 'failed', error: 'model execution error' }),
      }),
    ];

    fetchMock.mockImplementation(() => responses.shift() ?? responses[responses.length - 1]);

    await expect(generateHeroImage({ city: 'Rotterdam' })).rejects.toThrow('Image generation failed: model execution error');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects after exhausting retries when the prediction never resolves', async () => {
    let callCount = 0;
    fetchMock.mockImplementation(async () => {
      callCount += 1;
      if (callCount === 1) {
        return {
          ok: true,
          json: async () => ({ id: 'pred-3' }),
        };
      }

      return {
        ok: true,
        json: async () => ({ status: 'processing' }),
      };
    });

    await expect(generateHeroImage({ city: 'Utrecht' })).rejects.toThrow('Image generation timeout');

    expect(fetchMock).toHaveBeenCalledTimes(61);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(60);
  });
});

describe('getCachedOrGenerateImage', () => {
  it('returns the cached URL when it is fresh', async () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    const cachedUrl = 'https://images.example/cached.webp';
    mockWindow.localStorage.store.set('replicate_test', JSON.stringify({ url: cachedUrl, timestamp: now - 1000 }));

    const generator = vi.fn();

    const result = await getCachedOrGenerateImage('test', generator);

    expect(result).toBe(cachedUrl);
    expect(generator).not.toHaveBeenCalled();
    expect(mockWindow.localStorage.setItem).not.toHaveBeenCalled();
  });

  it('refreshes the cache when the cached item is expired', async () => {
    const now = 10_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    mockWindow.localStorage.store.set(
      'replicate_stale',
      JSON.stringify({ url: 'https://images.example/old.webp', timestamp: now - WEEK_IN_MS - 1 })
    );

    const generator = vi.fn().mockResolvedValue('https://images.example/new.webp');

    const result = await getCachedOrGenerateImage('stale', generator);

    expect(generator).toHaveBeenCalledTimes(1);
    expect(result).toBe('https://images.example/new.webp');
    expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith(
      'replicate_stale',
      expect.stringContaining('https://images.example/new.webp')
    );
  });

  it('regenerates when the cached value cannot be parsed as JSON', async () => {
    const now = 20_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    mockWindow.localStorage.getItem = vi.fn(() => 'not-json');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const generator = vi.fn().mockResolvedValue('https://images.example/from-generator.webp');

    const result = await getCachedOrGenerateImage('broken', generator);

    expect(generator).toHaveBeenCalled();
    expect(result).toBe('https://images.example/from-generator.webp');
    expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith(
      'replicate_broken',
      expect.stringContaining('https://images.example/from-generator.webp')
    );
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('generateCityLandingPageImages', () => {
  it('returns aggregated image URLs when all generators succeed', async () => {
    const heroSpy = vi.spyOn(replicateService, 'generateHeroImage').mockResolvedValue('hero-url');
    const eventSpy = vi
      .spyOn(replicateService, 'generateEventImage')
      .mockResolvedValueOnce('gallery-1')
      .mockResolvedValueOnce('gallery-2')
      .mockResolvedValueOnce('gallery-3');

    const result = await generateCityLandingPageImages({ city: 'Eindhoven' });

    expect(heroSpy).toHaveBeenCalledWith({ city: 'Eindhoven', eventType: 'feest', style: 'professional' });
    expect(eventSpy).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      hero: 'hero-url',
      gallery: ['gallery-1', 'gallery-2', 'gallery-3'],
      success: true,
    });
  });

  it('returns a fallback payload when any generator rejects', async () => {
    vi.spyOn(replicateService, 'generateHeroImage').mockRejectedValue(new Error('Generation unavailable'));
    vi.spyOn(replicateService, 'generateEventImage').mockResolvedValue('unused');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await generateCityLandingPageImages({ city: 'Leiden' });

    expect(result).toEqual({
      hero: null,
      gallery: [],
      success: false,
      error: 'Generation unavailable',
    });
    expect(errorSpy).toHaveBeenCalled();
  });
});
