import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const resolveApiBaseMock = vi.fn(() => 'https://api.example.com');
const trackEventMock = vi.fn();
const mockGetWindow = vi.fn();
const mockGetDocument = vi.fn();

vi.mock('../lib/apiBase.js', () => ({
  resolveApiBase: resolveApiBaseMock
}));

vi.mock('../lib/analytics.js', () => ({
  trackEvent: trackEventMock
}));

vi.mock('../lib/environment.js', () => ({
  getWindow: mockGetWindow,
  getDocument: mockGetDocument,
  isBrowser: () => true,
  getNavigator: () => ({})
}));

// eslint-disable-next-line import/first
import { useKeywordPersonalization } from '../useKeywordPersonalization.js';

const createFetchResponse = (data, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(data)
  });

describe('useKeywordPersonalization', () => {
  beforeEach(() => {
    trackEventMock.mockReset();
    resolveApiBaseMock.mockClear();
    mockGetWindow.mockReset();
    mockGetDocument.mockReset();
    global.fetch = vi.fn();
  });

  it('loads personalization data and merges meta information from url and payload', async () => {
    mockGetWindow.mockReturnValue({
      location: {
        search:
          '?keyword=dj%20utrecht&keywords=dj%20sax&utm_term=feest&utm_campaign=winter&utm_source=google&persona=corporate&intent=nightlife&search=club%20dj&q=dj%20band',
        pathname: '/landing-page'
      }
    });
    mockGetDocument.mockReturnValue({ referrer: 'https://example.com/referrer' });

    const payload = {
      variant: {
        id: 'keyword_match',
        hero: { title: 'Keyword Hero Title' },
        features: {
          items: [
            {
              title: 'Custom Feature',
              icon: '⭐',
              description: 'Overrides fallback features'
            }
          ]
        },
        pricing: {
          valueEmphasis: ['Custom value'],
          ctaOverrides: {
            Zilver: 'Nu boeken'
          }
        }
      },
      meta: {
        variantId: 'keyword_match',
        matchType: 'keyword',
        matchedKeywords: ['dj utrecht'],
        keywordInput: ['dj utrecht'],
        automationTriggered: true
      }
    };

    global.fetch
      .mockImplementationOnce(() => createFetchResponse(payload))
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(resolveApiBaseMock).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    const [requestUrl] = global.fetch.mock.calls[0];
    const apiUrl = new URL(requestUrl);
    expect(apiUrl.origin).toBe('https://api.example.com');
    expect(apiUrl.pathname).toBe('/personalization/keyword');
    expect(apiUrl.searchParams.get('keyword')).toBe('dj utrecht');
    expect(apiUrl.searchParams.get('keywords')).toBe('dj sax');
    expect(apiUrl.searchParams.get('utm_term')).toBe('feest');
    expect(apiUrl.searchParams.get('utm_campaign')).toBe('winter');
    expect(apiUrl.searchParams.get('utm_source')).toBe('google');
    expect(apiUrl.searchParams.get('persona')).toBe('corporate');
    expect(apiUrl.searchParams.get('intent')).toBe('nightlife');
    expect(apiUrl.searchParams.get('search')).toBe('club dj');
    expect(apiUrl.searchParams.get('q')).toBe('dj band');
    expect(apiUrl.searchParams.get('landing')).toBe('/landing-page');
    expect(apiUrl.searchParams.get('referrer')).toBe('https://example.com/referrer');

    expect(result.current.meta).toEqual(payload.meta);
    expect(result.current.personalization.id).toBe('keyword_match');
    expect(result.current.personalization.hero.title).toBe('Keyword Hero Title');
    expect(result.current.personalization.features.items).toEqual(payload.variant.features.items);
    expect(result.current.personalization.pricing.valueEmphasis).toEqual(['Custom value']);
    expect(result.current.personalization.pricing.ctaOverrides?.Zilver).toBe('Nu boeken');
    expect(result.current.error).toBeNull();

    expect(trackEventMock).toHaveBeenCalledWith('personalization_variant_loaded', {
      variant_id: 'keyword_match',
      match_type: 'keyword',
      matched_keywords: 'dj utrecht',
      automation_triggered: true
    });
  });

  it('falls back to default personalization when the network request fails', async () => {
    mockGetWindow.mockReturnValue({
      location: { search: '?keyword=dj', pathname: '/fallback' }
    });
    mockGetDocument.mockReturnValue({ referrer: '' });

    global.fetch.mockImplementationOnce(() => createFetchResponse({}, false));

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.personalization.id).toBe('default_master');
    expect(result.current.error).toBe('Kon personalisatievariant niet laden');
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it('stops loading immediately when window is unavailable', async () => {
    mockGetWindow.mockReturnValue(undefined);

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.meta).toBeNull();
    expect(result.current.personalization.id).toBe('default_master');
  });

  it('dispatches logEvent with merged payload when meta is available', async () => {
    mockGetWindow.mockReturnValue({
      location: {
        search: '?keyword=dj%20bruiloft',
        pathname: '/meta-test'
      }
    });
    mockGetDocument.mockReturnValue({ referrer: '' });

    const payload = {
      variant: {
        id: 'wedding',
        hero: { title: 'Wedding Hero' }
      },
      meta: {
        variantId: 'wedding',
        matchType: 'keyword',
        matchedKeywords: ['dj bruiloft'],
        keywordInput: ['dj bruiloft']
      }
    };

    global.fetch
      .mockImplementationOnce(() => createFetchResponse(payload))
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    trackEventMock.mockClear();
    await act(async () => {
      result.current.logEvent('cta_click', { location: 'hero', value: 'primary' });
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);
    const [, , postCall] = global.fetch.mock.calls;
    expect(postCall[0]).toBe('https://api.example.com/personalization/events');
    expect(postCall[1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const body = JSON.parse(postCall[1].body);
    expect(body).toEqual({
      type: 'cta_click',
      variantId: 'wedding',
      keyword: 'dj bruiloft',
      payload: { location: 'hero', value: 'primary' }
    });

    expect(trackEventMock).toHaveBeenCalledWith('personalization_event', {
      variant_id: 'wedding',
      event_type: 'cta_click',
      location: 'hero',
      value: 'primary'
    });
  });
});
