import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  generateHeroImage,
  getCachedOrGenerateImage,
  generateCityLandingPageImages,
} from '../replicate.js';

const API_BASE = 'https://api.replicate.com/v1';

const createFetchResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  async json() {
    return body;
  },
});

const installBrowserGlobals = () => {
  const storage = new Map();
  const localStorageMock = {
    getItem: vi.fn(key => (storage.has(key) ? storage.get(key) : null)),
    setItem: vi.fn((key, value) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn(key => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
  };

  globalThis.window = { localStorage: localStorageMock };
  globalThis.document = {};

  return { localStorageMock };
};

beforeEach(() => {
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(cb => {
    if (typeof cb === 'function') {
      cb();
    }
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete globalThis.fetch;
  delete globalThis.window;
  delete globalThis.document;
});

describe('waitForPrediction behaviour through public APIs', () => {
  it('resolves with the generated image URL when the prediction succeeds', async () => {
    const responses = [
      createFetchResponse({ id: 'pred-success' }),
      createFetchResponse({ status: 'succeeded', output: ['https://images/hero.webp'] }),
    ];

    globalThis.fetch = vi.fn(async (url) => {
      const next = responses.shift();
      expect(next).toBeDefined();
      expect(url).toBe(responses.length === 1 ? `${API_BASE}/predictions` : `${API_BASE}/predictions/pred-success`);
      return next;
    });

    const result = await generateHeroImage({ city: 'Amsterdam' });

    expect(result).toBe('https://images/hero.webp');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('bubbles up informative errors when the prediction fails', async () => {
    globalThis.fetch = vi.fn(async (url) => {
      if (url === `${API_BASE}/predictions`) {
        return createFetchResponse({ id: 'pred-failure' });
      }

      return createFetchResponse({ status: 'failed', error: 'Model crashed' });
    });

    await expect(generateHeroImage({ city: 'Rotterdam' })).rejects.toThrow('Image generation failed: Model crashed');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws a timeout error after exhausting all polling attempts', async () => {
    let pollCount = 0;

    globalThis.fetch = vi.fn(async (url) => {
      if (url === `${API_BASE}/predictions`) {
        return createFetchResponse({ id: 'pred-timeout' });
      }

      pollCount += 1;
      return createFetchResponse({ status: 'processing' });
    });

    await expect(generateHeroImage({ city: 'Utrecht' })).rejects.toThrow('Image generation timeout');

    expect(pollCount).toBe(60);
    expect(globalThis.fetch).toHaveBeenCalledTimes(61);
  });
});

describe('getCachedOrGenerateImage', () => {
  it('returns the cached URL when it is still within the TTL', async () => {
    const { localStorageMock } = installBrowserGlobals();
    const now = Date.now();
    const freshTimestamp = now - 24 * 60 * 60 * 1000;

    localStorageMock.setItem('replicate_cached-image', JSON.stringify({
      url: 'https://cache.example/image.webp',
      timestamp: freshTimestamp,
    }));

    const generatorFn = vi.fn();

    const result = await getCachedOrGenerateImage('cached-image', generatorFn);

    expect(result).toBe('https://cache.example/image.webp');
    expect(generatorFn).not.toHaveBeenCalled();
  });

  it('refreshes the cache when the entry is expired or cannot be parsed', async () => {
    const { localStorageMock } = installBrowserGlobals();
    const baseTime = 1000;

    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValue(baseTime);

    localStorageMock.setItem('replicate_expired-image', JSON.stringify({
      url: 'https://old.example/expired.webp',
      timestamp: baseTime - 8 * 24 * 60 * 60 * 1000,
    }));

    const generatorFn = vi.fn().mockResolvedValue('https://fresh.example/image.webp');

    const refreshed = await getCachedOrGenerateImage('expired-image', generatorFn);

    expect(refreshed).toBe('https://fresh.example/image.webp');
    expect(generatorFn).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'replicate_expired-image',
      expect.stringContaining('"https://fresh.example/image.webp"'),
    );

    dateSpy.mockReturnValue(baseTime + 1);
    localStorageMock.setItem('replicate_bad-json', 'not-json');

    generatorFn.mockResolvedValueOnce('https://fresh.example/from-invalid.webp');

    const recovered = await getCachedOrGenerateImage('bad-json', generatorFn);

    expect(recovered).toBe('https://fresh.example/from-invalid.webp');
    expect(generatorFn).toHaveBeenCalledTimes(2);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'replicate_bad-json',
      expect.stringContaining('"https://fresh.example/from-invalid.webp"'),
    );
  });
});

describe('generateCityLandingPageImages', () => {
  it('aggregates hero and gallery images when all predictions succeed', async () => {
    const outputs = [
      'https://images/hero.webp',
      'https://images/gallery-1.webp',
      'https://images/gallery-2.webp',
      'https://images/gallery-3.webp',
    ];
    const predictionOutputs = new Map();
    let predictionIndex = 0;

    globalThis.fetch = vi.fn(async (url, options = {}) => {
      if (url === `${API_BASE}/predictions`) {
        const id = `pred-${predictionIndex}`;
        predictionOutputs.set(id, outputs[predictionIndex]);
        predictionIndex += 1;
        return createFetchResponse({ id });
      }

      const id = url.replace(`${API_BASE}/predictions/`, '');
      const output = predictionOutputs.get(id);
      return createFetchResponse({ status: 'succeeded', output: [output] });
    });

    const result = await generateCityLandingPageImages({ city: 'Leiden' });

    expect(result).toEqual({
      hero: 'https://images/hero.webp',
      gallery: [
        'https://images/gallery-1.webp',
        'https://images/gallery-2.webp',
        'https://images/gallery-3.webp',
      ],
      success: true,
    });
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('returns a fallback payload when any prediction rejects', async () => {
    const predictionOutputs = new Map();
    let predictionIndex = 0;

    globalThis.fetch = vi.fn(async (url) => {
      if (url === `${API_BASE}/predictions`) {
        const id = `pred-${predictionIndex}`;
        predictionOutputs.set(id, predictionIndex === 0 ? 'error' : `https://images/${predictionIndex}.webp`);
        predictionIndex += 1;
        return createFetchResponse({ id });
      }

      const id = url.replace(`${API_BASE}/predictions/`, '');
      if (predictionOutputs.get(id) === 'error') {
        return createFetchResponse({ status: 'failed', error: 'API unavailable' });
      }

      return createFetchResponse({ status: 'succeeded', output: [`https://images/${id}.webp`] });
    });

    const result = await generateCityLandingPageImages({ city: 'Zwolle' });

    expect(result).toEqual({
      hero: null,
      gallery: [],
      success: false,
      error: 'Image generation failed: API unavailable',
    });
  });
});
