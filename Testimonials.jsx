import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const AUTOPLAY_INTERVAL = 6500;
const DRAG_THRESHOLD_PX = 40;
const MAX_RATING = 5;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const updatePreference = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(updatePreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updatePreference);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(updatePreference);
      }
    };
  }, []);

  return prefersReducedMotion;
};

const VisuallyHidden = ({ as: Component = "span", className = "", children, ...props }) => (
  <Component className={`sr-only ${className}`.trim()} {...props}>
    {children}
  </Component>
);

const getInitials = (name = "") => {
  if (!name) {
    return "MR";
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "MR";
};

const Star = ({ isActive }) => (
  <svg
    aria-hidden="true"
    className={`h-4 w-4 transition-colors duration-200 ${
      isActive ? "text-secondary" : "text-neutral-gray-400"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Rating = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-hidden="true">
    {Array.from({ length: MAX_RATING }, (_, index) => (
      <Star key={index} isActive={index < rating} />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial, prefersReducedMotion }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  const initials = useMemo(() => getInitials(testimonial.author), [testimonial.author]);

  return (
    <article
      ref={cardRef}
      className={`h-full w-full max-w-[360px] shrink-0 snap-center px-spacing-sm transition duration-500 ease-out ${
        isVisible
          ? "opacity-100 [transform:translateY(0)]"
          : "opacity-0 [transform:translateY(16px)]"
      }`}
    >
      <div className="relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-light/95 via-white to-white/80 p-[1px] shadow-[0_30px_60px_rgba(15,23,42,0.25)]">
        <div className="relative flex h-full flex-col gap-spacing-lg rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white p-spacing-xl">
          <span className="absolute -top-6 left-spacing-xl inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-primary text-font-size-h5 font-bold text-neutral-light shadow-[0_12px_25px_rgba(79,70,229,0.3)]">
            {initials}
          </span>
          <Rating rating={testimonial.rating ?? MAX_RATING} />
          <p className="text-font-size-body italic text-neutral-gray-700">“{testimonial.quote}”</p>
          <footer className="mt-auto flex flex-col gap-spacing-xs border-t border-neutral-gray-100 pt-spacing-md">
            <p className="text-font-size-body font-semibold text-neutral-dark">
              {testimonial.author}
            </p>
            {testimonial.source ? (
              <p className="text-font-size-small text-neutral-gray-500">{testimonial.source}</p>
            ) : null}
          </footer>
        </div>
      </div>
    </article>
  );
};

const TestimonialsCarousel = ({ testimonials, title, prefersReducedMotion }) => {
  const carouselId = useId();
  const autoplayAnnouncementId = useId();
  const trackRef = useRef(null);
  const pointerStartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(prefersReducedMotion);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsManuallyPaused(true);
      setIsInteractionPaused(false);
    }
  }, [prefersReducedMotion]);

  const totalItems = testimonials.length;
  const isPaused = prefersReducedMotion || isManuallyPaused || isInteractionPaused;

  useEffect(() => {
    if (typeof window === "undefined" || isPaused || totalItems <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalItems);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused, totalItems]);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) {
      return;
    }

    const child = node.children[activeIndex];
    if (!child) {
      return;
    }

    node.scrollTo({
      left: child.offsetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, prefersReducedMotion]);

  const goToIndex = useCallback(
    (index) => {
      setActiveIndex((current) => {
        if (index < 0) {
          return totalItems - 1;
        }
        if (index >= totalItems) {
          return 0;
        }
        return index;
      });
    },
    [totalItems],
  );

  const handlePointerDown = useCallback((event) => {
    pointerStartRef.current = event.clientX ?? event.touches?.[0]?.clientX ?? null;
    setIsInteractionPaused(true);
  }, []);

  const handlePointerUp = useCallback(
    (event) => {
      if (pointerStartRef.current == null) {
        setIsInteractionPaused(false);
        return;
      }

      const endX = event.clientX ?? event.changedTouches?.[0]?.clientX ?? null;
      if (endX == null) {
        pointerStartRef.current = null;
        setIsInteractionPaused(false);
        return;
      }

      const delta = endX - pointerStartRef.current;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
        goToIndex(activeIndex + (delta < 0 ? 1 : -1));
      }

      setIsInteractionPaused(false);
      pointerStartRef.current = null;
    },
    [activeIndex, goToIndex],
  );

  const handlePointerLeave = useCallback(() => {
    pointerStartRef.current = null;
    if (!prefersReducedMotion) {
      setIsInteractionPaused(false);
    }
  }, [prefersReducedMotion]);

  const toggleAutoplay = useCallback(() => {
    if (prefersReducedMotion) {
      return;
    }

    setIsManuallyPaused((previous) => !previous);
  }, [prefersReducedMotion]);

  const autoplayButtonLabel = prefersReducedMotion
    ? "Autoplay uitgeschakeld (voorkeuren)"
    : isManuallyPaused
      ? "Start autoplay"
      : "Pauzeer autoplay";

  return (
    <div className="flex flex-col gap-spacing-xl">
      <div className="flex flex-wrap items-center justify-between gap-spacing-sm">
        <h2 className="text-font-size-h2 font-extrabold text-neutral-dark">{title}</h2>
        <button
          aria-controls={carouselId}
          aria-describedby={autoplayAnnouncementId}
          aria-pressed={!isManuallyPaused}
          className="rounded-full border border-neutral-gray-200 bg-white px-spacing-md py-spacing-xs text-font-size-small font-semibold text-neutral-gray-600 shadow-sm transition hover:border-neutral-gray-300 hover:text-neutral-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          disabled={prefersReducedMotion}
          onClick={toggleAutoplay}
          type="button"
        >
          {autoplayButtonLabel}
        </button>
      </div>

      <div
        aria-describedby={autoplayAnnouncementId}
        aria-label={title}
        aria-live="polite"
        className="relative"
        id={carouselId}
        role="group"
      >
        <VisuallyHidden id={autoplayAnnouncementId}>
          {prefersReducedMotion
            ? "Automatisch afspelen is uitgeschakeld vanwege systeeminstellingen."
            : isPaused
              ? "Carrousel gepauzeerd. Gebruik de pijlen of swipe om testimonials te bekijken."
              : "Carrousel speelt automatisch af. Gebruik de pauzeknop om te stoppen."}
        </VisuallyHidden>

        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/20 bg-gradient-to-r from-white/30 via-white/0 to-white/30"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-light/70 p-spacing-lg">
          <div className="flex items-center justify-between gap-spacing-sm pb-spacing-md">
            <p className="text-font-size-small font-semibold uppercase tracking-[0.3em] text-secondary">
              Social proof
            </p>
            <div className="flex items-center gap-spacing-xs text-font-size-small text-neutral-gray-500">
              <span>
                {activeIndex + 1} / {totalItems}
              </span>
            </div>
          </div>

          <div
            className="flex snap-x snap-mandatory overflow-x-hidden"
            onMouseDown={handlePointerDown}
            onMouseLeave={handlePointerLeave}
            onMouseUp={handlePointerUp}
            onTouchCancel={handlePointerLeave}
            onTouchEnd={handlePointerUp}
            onTouchStart={handlePointerDown}
            ref={trackRef}
            role="presentation"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.author}-${index}`}
                prefersReducedMotion={prefersReducedMotion}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        <div className="mt-spacing-md flex items-center justify-center gap-spacing-xs">
          {testimonials.map((testimonial, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${testimonial.author}-indicator-${index}`}
                aria-label={`Toon testimonial ${index + 1}`}
                className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-secondary shadow-[0_6px_16px_rgba(56,189,248,0.45)]"
                    : "bg-neutral-gray-300 hover:bg-neutral-gray-400"
                }`}
                onClick={() => goToIndex(index)}
                type="button"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const testimonialsTranslation = t("testimonials.items", { returnObjects: true });
  const testimonialsData = Array.isArray(testimonialsTranslation) ? testimonialsTranslation : [];
  const resolvedTitle = t("testimonials.title", {
    defaultValue: "Wat klanten zeggen",
  });

  if (testimonialsData.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-gray-100 py-spacing-4xl">
      <div className="container mx-auto px-spacing-md">
        <TestimonialsCarousel
          prefersReducedMotion={prefersReducedMotion}
          testimonials={testimonialsData}
          title={resolvedTitle}
        />
      </div>
    </section>
  );
};

export default Testimonials;
