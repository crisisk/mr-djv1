import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCookie, setCookie, getOrAssignVariant } from '../abTesting';
import { setupDomMocks } from './testUtils';

let environment;

beforeEach(() => {
  environment = setupDomMocks({ withDataLayer: false });
});

afterEach(() => {
  const { storage, document, location } = environment;
  storage.clear();
  document.__clear();
  if (location) {
    location.search = '';
  }
  vi.restoreAllMocks();
  environment.restore();
  environment = undefined;
});

describe('abTesting utilities', () => {
  it('persists the randomly assigned variant in cookies and session storage', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.2);

    const firstVariant = getOrAssignVariant();

    expect(firstVariant).toBe('A');
    expect(getCookie('mr_dj_ab_variant')).toBe('A');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'A');
    expect(sessionStorage.getItem('ab_variant')).toBe('A');
    expect(randomSpy).toHaveBeenCalledTimes(1);

    randomSpy.mockReturnValue(0.9);

    const secondVariant = getOrAssignVariant();

    expect(secondVariant).toBe('A');
    expect(randomSpy).toHaveBeenCalledTimes(1);
  });

  it('allows manual variant override via URL parameter', () => {
    const { location } = environment;
    location.search = '?variant=B';

    const variant = getOrAssignVariant();

    expect(variant).toBe('B');
    expect(getCookie('mr_dj_ab_variant')).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
  });

  it('hydrates session storage when a persisted cookie exists', () => {
    setCookie('mr_dj_ab_variant', 'B', 30);
    sessionStorage.clear();

    const variant = getOrAssignVariant();

    expect(variant).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
    expect(sessionStorage.getItem('ab_variant')).toBe('B');
  });
});
