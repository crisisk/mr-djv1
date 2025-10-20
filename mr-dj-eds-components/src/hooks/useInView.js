import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight IntersectionObserver wrapper that reports when an element
 * intersects the viewport. Automatically falls back to an always-visible state
 * when the API is not available (e.g. during SSR or legacy browsers).
 */
export function useInView(options = {}) {
  const observerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = observerRef.current;

    if (!element) {
      return undefined;
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref: observerRef, isInView };
}

export default useInView;
