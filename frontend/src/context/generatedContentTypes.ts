import type { ReactNode } from 'react'
import type { ApiClientOptions } from '../lib/apiClient'

export type TrackEventFn = (eventName: string, payload?: Record<string, unknown>) => void

export interface AnalyticsConfiguration {
  trackEvent?: TrackEventFn
  eventNamesByPlatform?: Record<string, string>
  defaultEventName?: string
  payload?: Record<string, unknown>
}

export interface InstagramReelsFeedConfig {
  source: 'instagram' | 'cms' | 'mock'
  endpoint?: string
  requestOptions?: Omit<ApiClientOptions, 'method' | 'body'>
  transform?: (payload: unknown) => unknown
  rateLimitMs?: number
  mockData?: unknown
}

export interface GeneratedContentConfig {
  analytics?: AnalyticsConfiguration
  dataFeeds?: {
    instagramReels?: InstagramReelsFeedConfig
    [key: string]: unknown
  }
}

export interface GeneratedContentProviderProps {
  value: GeneratedContentConfig
  children: ReactNode
}
