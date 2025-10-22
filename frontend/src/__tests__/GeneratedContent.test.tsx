import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SocialMediaAd from '../components/Generated/MKT3_2_20251016_062454'
import InstagramReelsSection from '../components/Generated/MKT2_3_20251016_062323'
import type { GeneratedContentConfig } from '../context/generatedContentTypes'
import { GeneratedContentConfigProvider } from '../context/GeneratedContentConfigProvider'
import { apiClient } from '../lib/apiClient'

describe('SocialMediaAd analytics integration', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tracks impressions using analytics configuration from props', async () => {
    const trackEvent = vi.fn()

    render(
      <SocialMediaAd
        videoUrl="https://cdn.example.com/intro.mp4"
        platform="instagram"
        headline="Experience the DJ magic"
        description="Nieuwe mixen en onvergetelijke vibes"
        ctaText="Boek nu"
        analyticsConfig={{
          trackEvent,
          eventNamesByPlatform: { instagram: 'instagram_impression' },
          payload: { campaignId: 'ig-2025' },
        }}
      />,
    )

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith(
        'instagram_impression',
        expect.objectContaining({
          platform: 'instagram',
          campaignId: 'ig-2025',
          headline: 'Experience the DJ magic',
        }),
      )
    })
  })

  it('falls back to analytics configuration provided via context', async () => {
    const trackEvent = vi.fn()

    const config: GeneratedContentConfig = {
      analytics: {
        trackEvent,
        eventNamesByPlatform: { facebook: 'fb_impression' },
        payload: { region: 'NL' },
      },
    }

    render(
      <GeneratedContentConfigProvider value={config}>
        <SocialMediaAd
          videoUrl="https://cdn.example.com/intro.mp4"
          platform="facebook"
          headline="Live mixing on demand"
          description="Laat ons jouw event onvergetelijk maken"
          ctaText="Plan een call"
        />
      </GeneratedContentConfigProvider>,
    )

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith(
        'fb_impression',
        expect.objectContaining({ platform: 'facebook', region: 'NL' }),
      )
    })
  })
})

describe('InstagramReelsSection data fetching', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches reels from a configured endpoint', async () => {
    const getSpy = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({
        data: [
          {
            id: 'abc',
            media_url: 'https://cdn.example.com/video.mp4',
            like_count: 42,
            view_count: 128,
            caption: 'Sunset rooftop session',
          },
        ],
      })

    render(
      <InstagramReelsSection
        feedConfig={{
          source: 'instagram',
          endpoint: '/api/instagram/reels',
        }}
      />,
    )

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledWith(
        '/api/instagram/reels',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Sunset rooftop session')).toBeInTheDocument()
      expect(screen.getByText('❤️ 42')).toBeInTheDocument()
      expect(screen.getByText('👁️ 128')).toBeInTheDocument()
    })
  })

  it('respects rate limiting when refetching rapidly', async () => {
    const getSpy = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({
        data: [
          {
            id: 'xyz',
            media_url: 'https://cdn.example.com/video-2.mp4',
            like_count: 10,
            view_count: 25,
            caption: 'Club night highlights',
          },
        ],
      })

    const feedConfig = {
      source: 'instagram' as const,
      endpoint: '/api/instagram/reels',
      rateLimitMs: 60_000,
    }

    const { rerender } = render(<InstagramReelsSection feedConfig={feedConfig} />)

    await waitFor(() => {
      expect(screen.getByText('Club night highlights')).toBeInTheDocument()
      expect(getSpy).toHaveBeenCalledTimes(1)
    })

    rerender(<InstagramReelsSection feedConfig={{ ...feedConfig }} />)

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(
        screen.getByText('Content recently refreshed. Please wait before requesting new reels.'),
      ).toBeInTheDocument()
    })
  })

  it('can render mock data from context without hitting the network', async () => {
    const getSpy = vi.spyOn(apiClient, 'get')
    const config: GeneratedContentConfig = {
      dataFeeds: {
        instagramReels: {
          source: 'mock',
          mockData: [
            {
              id: 'mock-1',
              videoUrl: 'https://cdn.example.com/mock.mp4',
              audioTitle: 'Mock Anthem',
              audioSources: [],
              downloadUrl: 'https://cdn.example.com/mock.mp4',
              likes: 5,
              views: 15,
              description: 'Mocked reel for testing',
            },
          ],
        },
      },
    }

    render(
      <GeneratedContentConfigProvider value={config}>
        <InstagramReelsSection />
      </GeneratedContentConfigProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Mocked reel for testing')).toBeInTheDocument()
      expect(getSpy).not.toHaveBeenCalled()
    })
  })
})
