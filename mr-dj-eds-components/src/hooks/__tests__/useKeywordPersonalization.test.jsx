import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterAll, vi } from 'vitest';
import { useKeywordPersonalization } from '../useKeywordPersonalization.js';

const resolveApiBaseMock = vi.fn();
vi.mock('../../lib/apiBase.js', () => ({
  resolveApiBase: resolveApiBaseMock
}));

const trackEventMock = vi.fn();
vi.mock('../../lib/analytics.js', () => ({
  trackEvent: trackEventMock
}));

const getWindowMock = vi.fn();
const getDocumentMock = vi.fn();
vi.mock('../../lib/environment.js', () => ({
  getWindow: () => getWindowMock(),
  getDocument: () => getDocumentMock()
}));

const fetchMock = vi.fn();

describe('useKeywordPersonalization', () => {
  beforeEach(() => {
    resolveApiBaseMock.mockReset();
    trackEventMock.mockReset();
    getWindowMock.mockReset();
    getDocumentMock.mockReset();
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('loads personalization data, merges variant payload and extracts meta from URL params', async () => {
    const searchParams = new URLSearchParams({
      keyword: 'club',
      keywords: 'club,dj',
      utm_term: 'club dj',
      utm_campaign: 'club_launch',
      utm_source: 'google',
      persona: 'nightlife',
      intent: 'nightlife',
      search: 'Club DJ',
      q: 'dj'
    });

    resolveApiBaseMock.mockReturnValue('https://api.example.com');
    getWindowMock.mockReturnValue({
      location: {
        search: `?${searchParams.toString()}`,
        pathname: '/events/nightlife'
      },
      dataLayer: []
    });
    getDocumentMock.mockReturnValue({ referrer: 'https://example.com/ads' });

    const payload = {
      variant: {
        id: 'nightlife-variant',
        hero: {
          title: 'Nightlife Energy',
          ctaPrimaryText: 'Boek direct'
        },
        features: {
          items: [{ title: 'Laser show', icon: '✨', description: 'Volledige club-setup.' }]
        },
        pricing: {
          valueEmphasis: ['Aftermovie inbegrepen'],
          ctaOverrides: { Zilver: 'Reserveer nu' }
        }
      },
      meta: {
        variantId: 'nightlife-variant',
        matchType: 'keyword',
        matchedKeywords: ['club dj'],
        keywordInput: ['club'],
        automationTriggered: true
      }
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => payload
    });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.meta).toEqual(payload.meta);
    expect(result.current.personalization.hero.title).toBe('Nightlife Energy');
    expect(result.current.personalization.hero.badges).toContain('Gemiddeld 4,9/5 beoordeling');
    expect(result.current.personalization.features.items).toEqual(payload.variant.features.items);
    expect(result.current.personalization.pricing.valueEmphasis).toEqual(['Aftermovie inbegrepen']);
    expect(result.current.personalization.pricing.ctaOverrides.Zilver).toBe('Reserveer nu');

    const firstCallUrl = fetchMock.mock.calls[0][0];
    expect(firstCallUrl.startsWith('https://api.example.com/personalization/keyword?')).toBe(true);
    const [, queryString] = firstCallUrl.split('?');
    const query = new URLSearchParams(queryString);
    expect(query.get('keyword')).toBe('club');
    expect(query.get('keywords')).toBe('club,dj');
    expect(query.get('utm_term')).toBe('club dj');
    expect(query.get('utm_campaign')).toBe('club_launch');
    expect(query.get('utm_source')).toBe('google');
    expect(query.get('persona')).toBe('nightlife');
    expect(query.get('intent')).toBe('nightlife');
    expect(query.get('search')).toBe('Club DJ');
    expect(query.get('q')).toBe('dj');
    expect(query.get('landing')).toBe('/events/nightlife');
    expect(query.get('referrer')).toBe('https://example.com/ads');

    expect(trackEventMock).toHaveBeenCalledWith('personalization_variant_loaded', {
      variant_id: 'nightlife-variant',
      match_type: 'keyword',
      matched_keywords: 'club dj',
      automation_triggered: true
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.example.com/personalization/events',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'impression',
          variantId: 'nightlife-variant',
          keyword: 'club',
          payload: { matchType: 'keyword' }
        })
      })
    );
  });

  it('falls back to default personalization when the network request fails', async () => {
    const searchParams = new URLSearchParams({ keyword: 'wedding' });

    resolveApiBaseMock.mockReturnValue('https://api.example.com');
    getWindowMock.mockReturnValue({
      location: { search: `?${searchParams.toString()}`, pathname: '/wedding' },
      dataLayer: []
    });
    getDocumentMock.mockReturnValue({ referrer: '' });

    fetchMock.mockResolvedValueOnce({ ok: false });

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Kon personalisatievariant niet laden');
    expect(result.current.personalization.id).toBe('default_master');
    expect(result.current.meta).toBeNull();
    expect(trackEventMock).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('stops loading immediately when window is not available', async () => {
    resolveApiBaseMock.mockReturnValue('https://api.example.com');
    getWindowMock.mockReturnValue(undefined);
    getDocumentMock.mockReturnValue(undefined);

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.personalization.id).toBe('default_master');
    expect(result.current.error).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends log events with merged payload data', async () => {
    const searchParams = new URLSearchParams({ keyword: 'corporate' });

    resolveApiBaseMock.mockReturnValue('https://api.example.com');
    getWindowMock.mockReturnValue({
      location: { search: `?${searchParams.toString()}`, pathname: '/corporate' },
      dataLayer: []
    });
    getDocumentMock.mockReturnValue({ referrer: 'https://example.com' });

    const payload = {
      variant: { id: 'corporate-variant' },
      meta: {
        variantId: 'corporate-variant',
        matchType: 'persona',
        matchedKeywords: [],
        keywordInput: ['corporate'],
        automationTriggered: false
      }
    };

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => payload });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const { result } = renderHook(() => useKeywordPersonalization());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.logEvent('cta_click', { location: 'hero_cta' });
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://api.example.com/personalization/events',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cta_click',
          variantId: 'corporate-variant',
          keyword: 'corporate',
          payload: { location: 'hero_cta' }
        })
      })
    );

    expect(trackEventMock).toHaveBeenLastCalledWith('personalization_event', {
      variant_id: 'corporate-variant',
      event_type: 'cta_click',
      location: 'hero_cta'
    });
  });
});
