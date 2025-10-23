import { useEffect } from "react";
import posthog from "posthog-js";

import { isValidPosthogKey, runtimeConfig } from "../../config/runtimeConfig";

const isBrowser = typeof window !== "undefined";
let isInitialised = false;

type ClickTarget = HTMLElement & { innerText?: string };

type TrackingEvent = {
  type: "click" | "form_submit" | "scroll";
  payload: Record<string, unknown>;
};

function track(event: TrackingEvent) {
  if (!isBrowser) {
    return;
  }

  try {
    posthog.capture(event.type, event.payload);
  } catch (error) {
    if (import.meta.env.MODE !== "production") {
      console.error("Kon PostHog event niet versturen", error);
    }
  }
}

export function UserBehaviorTracker() {
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const { apiKey, apiHost } = runtimeConfig.analytics.posthog;

    if (!isValidPosthogKey(apiKey)) {
      if (import.meta.env.MODE !== "production") {
        console.warn(
          "PostHog initialisatie overgeslagen: geen geldige API-sleutel gevonden in runtime configuratie.",
        );
      }
      return;
    }

    if (!isInitialised) {
      posthog.init(apiKey, {
        api_host: apiHost ?? undefined,
        loaded: () => {
          if (import.meta.env.MODE !== "production") {
            console.debug("PostHog initialised");
          }
        },
      });
      posthog.capture("$pageview");
      isInitialised = true;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as ClickTarget | null;
      if (!target) {
        return;
      }

      const tagName = target.tagName?.toLowerCase();
      if (tagName === "button" || tagName === "a") {
        track({
          type: "click",
          payload: {
            element: tagName,
            text: target.innerText ? target.innerText.trim().slice(0, 120) : undefined,
          },
        });
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) {
        return;
      }

      track({
        type: "form_submit",
        payload: {
          formId: form.id || undefined,
          action: form.getAttribute("action") || undefined,
        },
      });
    };

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) {
        return;
      }

      const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
      track({
        type: "scroll",
        payload: {
          scrollPercentage: Math.round(scrollPercentage),
        },
      });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

export default UserBehaviorTracker;
