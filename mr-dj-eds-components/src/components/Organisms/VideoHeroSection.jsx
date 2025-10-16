import React, { useMemo } from 'react';
import { Button } from '../ui/button.jsx';

const overlayClasses = {
  soft: 'bg-neutral-dark/65',
  radial: 'bg-gradient-to-br from-neutral-dark/80 via-neutral-dark/60 to-neutral-dark/80',
  solid: 'bg-neutral-dark/75'
};

const VideoHeroSection = ({
  eyebrow,
  title,
  subtitle,
  video,
  badges = [],
  metrics = [],
  personaKey = 'default',
  personaMicrocopy = {},
  ctaPrimaryText,
  ctaSecondaryText,
  onPrimaryClick,
  onSecondaryClick,
  children
}) => {
  const overlayClass = overlayClasses[video?.overlay] || overlayClasses.radial;
  const microcopy = useMemo(() => {
    if (!personaMicrocopy) {
      return null;
    }

    return personaMicrocopy[personaKey] || personaMicrocopy.default || null;
  }, [personaKey, personaMicrocopy]);

  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-dark">
      {video?.sources && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={video.poster}
        >
          {video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}
      <div className={`absolute inset-0 ${overlayClass}`} aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-spacing-lg px-spacing-lg py-spacing-3xl text-center text-neutral-light">
        {eyebrow && (
          <span className="text-xs uppercase tracking-[0.4em] text-secondary/80">{eyebrow}</span>
        )}
        <h1 className="text-balance text-font-size-display font-extrabold text-neutral-light drop-shadow-xl">{title}</h1>
        {subtitle && (
          <p className="text-lg text-neutral-light/85 md:text-xl lg:max-w-3xl">{subtitle}</p>
        )}
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-spacing-sm">
            {badges.slice(0, 4).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-neutral-light/30 bg-neutral-light/10 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-spacing-md">
          {ctaPrimaryText && (
            <Button size="lg" variant="secondary" onClick={onPrimaryClick}>
              {ctaPrimaryText}
            </Button>
          )}
          {ctaSecondaryText && (
            <Button size="lg" variant="outline" className="border-neutral-light text-neutral-light" onClick={onSecondaryClick}>
              {ctaSecondaryText}
            </Button>
          )}
        </div>
        {microcopy && (
          <div className="rounded-2xl border border-secondary/30 bg-secondary/10 px-spacing-md py-spacing-sm text-xs text-secondary/90">
            {microcopy.primary}
            {microcopy.secondary && (
              <span className="block text-neutral-light/80">{microcopy.secondary}</span>
            )}
          </div>
        )}
        {metrics.length > 0 && (
          <dl className="mt-spacing-md grid w-full gap-spacing-lg text-left md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`} className="rounded-2xl border border-neutral-light/10 bg-neutral-dark/40 p-spacing-md">
                <dt className="text-xs uppercase tracking-wide text-neutral-light/60">{metric.label}</dt>
                <dd className="text-2xl font-semibold text-neutral-light">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {children}
    </section>
  );
};

export default VideoHeroSection;
