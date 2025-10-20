import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadHCaptchaScript } from '../lib/hcaptcha.js';

const isBrowser = typeof window !== 'undefined';

function safeRemoveWidget(widgetId) {
  if (!isBrowser || !window.hcaptcha || widgetId === null || widgetId === undefined) {
    return;
  }

  if (typeof window.hcaptcha.remove === 'function') {
    window.hcaptcha.remove(widgetId);
    return;
  }

  try {
    window.hcaptcha.reset(widgetId);
  } catch (_error) {
    // no-op: best effort cleanup
  }
}

export function useHCaptchaWidget(siteKey) {
  const containerNodeRef = useRef(null);
  const widgetIdRef = useRef(null);

  const [hasContainer, setHasContainer] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(!siteKey);
  const [isLoading, setIsLoading] = useState(Boolean(siteKey));

  const setContainerRef = useCallback((node) => {
    containerNodeRef.current = node;
    setHasContainer(Boolean(node));
  }, []);

  const reset = useCallback(() => {
    setToken('');
    if (error) {
      setError('');
    }

    if (isBrowser && window.hcaptcha && widgetIdRef.current !== null) {
      try {
        window.hcaptcha.reset(widgetIdRef.current);
      } catch (_error) {
        // ignore reset issues, widget will rerender on demand
      }
    }
  }, [error]);

  useEffect(() => {
    if (!siteKey || !hasContainer) {
      setIsReady(true);
      setIsLoading(false);
      return () => {};
    }

    if (!isBrowser) {
      return () => {};
    }

    let cancelled = false;

    const cleanup = () => {
      safeRemoveWidget(widgetIdRef.current);
      widgetIdRef.current = null;
    };

    const renderWidget = (hcaptcha) => {
      if (cancelled || !containerNodeRef.current) {
        return;
      }

      cleanup();

      widgetIdRef.current = hcaptcha.render(containerNodeRef.current, {
        sitekey: siteKey,
        callback: (value) => {
          if (cancelled) {
            return;
          }

          setToken(value);
          setError('');
        },
        'expired-callback': () => {
          if (cancelled) {
            return;
          }

          setToken('');
          setError('hCaptcha is verlopen. Bevestig opnieuw dat je geen robot bent.');
        },
        'error-callback': () => {
          if (cancelled) {
            return;
          }

          setToken('');
          setError('Kan hCaptcha niet laden. Probeer het opnieuw.');
        }
      });

      setIsReady(true);
      setIsLoading(false);
    };

    setIsReady(false);
    setIsLoading(true);

    if (window.hcaptcha) {
      renderWidget(window.hcaptcha);
    } else {
      loadHCaptchaScript()
        .then((hcaptcha) => {
          if (!cancelled) {
            renderWidget(hcaptcha);
          }
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          setError('Kon de beveiligingscontrole niet laden. Ververs de pagina en probeer opnieuw.');
          setIsLoading(false);
        });
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [siteKey, hasContainer]);

  const helpers = useMemo(
    () => ({
      containerRef: setContainerRef,
      token,
      error,
      setError,
      reset,
      isReady,
      isLoading
    }),
    [error, isLoading, isReady, reset, setContainerRef, token]
  );

  return helpers;
}

