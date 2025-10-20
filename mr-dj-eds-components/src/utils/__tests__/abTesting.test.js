import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCookie, setCookie, getOrAssignVariant } from '../abTesting.js';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');

describe('abTesting utilities', () => {
  let cookieStore;
  let sessionStorageMock;
  let originalMathRandom;

  const createSessionStorage = () => {
    let store = {};
    return {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      getStore: () => store
    };
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);

    originalMathRandom = Math.random;

    cookieStore = {};

    const documentMock = {};
    Object.defineProperty(documentMock, 'cookie', {
      configurable: true,
      get: () =>
        Object.entries(cookieStore)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
      set: (value) => {
        const [pair] = value.split(';');
        const [rawKey, rawVal] = pair.split('=');
        const key = rawKey?.trim();
        const val = rawVal;

        if (!key) {
          return;
        }

        const expiresMatch = value.match(/expires=([^;]+)/i);
        if (expiresMatch) {
          const expiresDate = new Date(expiresMatch[1]);
          if (Number.isNaN(expiresDate.getTime()) || expiresDate < new Date()) {
            delete cookieStore[key];
            return;
          }
        }

        if (typeof val === 'undefined' || val === '') {
          delete cookieStore[key];
          return;
        }

        cookieStore[key] = val;
      }
    });

    sessionStorageMock = createSessionStorage();

    globalThis.document = documentMock;
    globalThis.window = {
      location: { search: '', pathname: '/', href: 'https://example.com/' },
      history: { pushState: vi.fn() },
      sessionStorage: sessionStorageMock
    };
    globalThis.sessionStorage = sessionStorageMock;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
    vi.useRealTimers();
    sessionStorageMock.clear();
    cookieStore = {};
    if (globalThis.window) {
      globalThis.window.location.search = '';
    }
    delete globalThis.window;
    delete globalThis.sessionStorage;
    delete globalThis.document;
    vi.restoreAllMocks();
  });

  it('persists randomly assigned variants via cookies and session storage', () => {
    Math.random = vi.fn().mockReturnValue(0.2);

    const firstVariant = getOrAssignVariant();

    expect(firstVariant).toBe('A');
    expect(getCookie('mr_dj_ab_variant')).toBe('A');
    expect(sessionStorage.getItem('ab_variant')).toBe('A');

    Math.random.mockReturnValue(0.9);

    const secondVariant = getOrAssignVariant();

    expect(secondVariant).toBe('A');
    expect(Math.random).toHaveBeenCalledTimes(1);
  });

  it('allows URL overrides and persists the specified variant', () => {
    Math.random = vi.fn().mockReturnValue(0.1);
    window.location.search = '?variant=B';

    const variant = getOrAssignVariant();

    expect(variant).toBe('B');
    expect(getCookie('mr_dj_ab_variant')).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
  });

  it('hydrates session storage from existing cookies when session is empty', () => {
    setCookie('mr_dj_ab_variant', 'B', 30);
    sessionStorage.clear();

    const variant = getOrAssignVariant();

    expect(variant).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
  });
});
