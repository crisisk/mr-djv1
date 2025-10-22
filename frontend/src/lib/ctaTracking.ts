import { pushEvent } from "./analytics/ga4";
import { apiClient } from "./apiClient";

export interface BookingCtaPayload {
  /**
   * Identifier for the CTA source (e.g. `exit-intent`, `sticky-cta`).
   */
  cta: string;
  /**
   * Optional explicit personalization variant identifier.
   * Falls back to detected personalization context.
   */
  variantId?: string;
  /**
   * Optional keyword captured by CRO flows.
   */
  keyword?: string;
  /**
   * Extra metadata that should accompany the analytics event.
   */
  metadata?: Record<string, unknown>;
  /**
   * Target location to navigate the user after logging the CTA.
   * Accepts fragment identifiers (e.g. `#contact`) or absolute/relative URLs.
   */
  navigateTo?: string;
}

interface PersonalizationBootstrap {
  variantId?: string;
  keyword?: string;
}

const CTA_ENDPOINT = "/api/personalization/events";
const DEFAULT_VARIANT_ID = "mr-dj-default";
const DEFAULT_NAVIGATION_TARGET = "/#contact";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normaliseNavigationTarget(target?: string): string | null {
  if (!target || typeof target !== "string") {
    return null;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/#${trimmed.replace(/^#/, "")}`;
}

function resolvePersonalizationContext(): PersonalizationBootstrap {
  if (!isBrowser()) {
    return {};
  }

  const globalWindow = window as unknown as Record<string, unknown>;
  const possibleKeys = [
    "__MR_DJ_PERSONALIZATION__",
    "__PERSONALIZATION__",
    "__MRDJ_PERSONALIZATION__",
  ];

  for (const key of possibleKeys) {
    const value = globalWindow[key];
    if (value && typeof value === "object") {
      const source = value as Record<string, unknown>;
      const variant = typeof source.variantId === "string" ? source.variantId : undefined;
      const keyword = typeof source.keyword === "string" ? source.keyword : undefined;
      if (variant || keyword) {
        return { variantId: variant, keyword };
      }
    }
  }

  return {};
}

function navigateToTarget(target?: string) {
  if (!isBrowser()) {
    return;
  }

  const resolved = normaliseNavigationTarget(target ?? DEFAULT_NAVIGATION_TARGET);
  if (!resolved) {
    return;
  }

  if (resolved.startsWith("#")) {
    const element = document.querySelector<HTMLElement>(resolved);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof element.focus === "function") {
        element.focus({ preventScroll: true });
      }
      if (history.pushState) {
        history.pushState(null, "", resolved);
      } else {
        window.location.hash = resolved;
      }
      return;
    }

    // Fallback to changing the hash so the browser attempts to locate it.
    window.location.hash = resolved.replace(/^#/, "");
    return;
  }

  window.location.assign(resolved);
}

export async function recordBookingCta({
  cta,
  variantId,
  keyword,
  metadata,
  navigateTo,
}: BookingCtaPayload): Promise<void> {
  if (!cta || typeof cta !== "string") {
    if (import.meta.env?.MODE !== "production") {
      console.warn("[ctaTracking] Cannot record CTA without a valid identifier.");
    }
    navigateToTarget(navigateTo);
    return;
  }

  const personalization = resolvePersonalizationContext();
  const effectiveVariant = variantId || personalization.variantId || DEFAULT_VARIANT_ID;
  const effectiveKeyword = keyword || personalization.keyword;

  const eventParams: Record<string, unknown> = {
    cta_name: cta,
    variant_id: effectiveVariant,
  };

  if (effectiveKeyword) {
    eventParams.keyword = effectiveKeyword;
  }

  if (metadata && typeof metadata === "object") {
    Object.assign(eventParams, metadata);
  }

  try {
    pushEvent({
      name: "cta_click",
      params: eventParams,
    });
  } catch (error) {
    if (import.meta.env?.MODE !== "production") {
      console.warn("[ctaTracking] Failed to push GA4 event", error);
    }
  }

  try {
    await apiClient.post(CTA_ENDPOINT, {
      type: "cta_click",
      variantId: effectiveVariant,
      keyword: effectiveKeyword,
      payload: {
        cta,
        ...(metadata ?? {}),
      },
    });
  } catch (error) {
    if (import.meta.env?.MODE !== "production") {
      console.warn("[ctaTracking] Failed to record CTA click", error);
    }
  }

  navigateToTarget(navigateTo);
}
