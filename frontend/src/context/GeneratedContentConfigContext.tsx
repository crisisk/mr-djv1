import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ApiClientOptions } from "../lib/apiClient";

export type TrackEventFn = (eventName: string, payload?: Record<string, unknown>) => void;

export interface AnalyticsConfiguration {
  trackEvent?: TrackEventFn;
  eventNamesByPlatform?: Record<string, string>;
  defaultEventName?: string;
  payload?: Record<string, unknown>;
}

export interface InstagramReelsFeedConfig {
  source: "instagram" | "cms" | "mock";
  endpoint?: string;
  requestOptions?: Omit<ApiClientOptions, "method" | "body">;
  transform?: (payload: unknown) => unknown;
  rateLimitMs?: number;
  mockData?: unknown;
}

export interface GeneratedContentConfig {
  analytics?: AnalyticsConfiguration;
  dataFeeds?: {
    instagramReels?: InstagramReelsFeedConfig;
    [key: string]: unknown;
  };
}

const GeneratedContentConfigContext = createContext<GeneratedContentConfig>({});

export const GeneratedContentConfigProvider = ({
  value,
  children,
}: {
  value: GeneratedContentConfig;
  children: ReactNode;
}) => (
  <GeneratedContentConfigContext.Provider value={value}>
    {children}
  </GeneratedContentConfigContext.Provider>
);

export const useGeneratedContentConfig = () => useContext(GeneratedContentConfigContext);

export default GeneratedContentConfigContext;
