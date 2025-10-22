'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { heroTitle, heroSubtitle, heroCTA, fadeInUp } from '@/lib/animations';

type OverlayType = 'soft' | 'radial' | 'solid';

interface VideoSource {
  src: string;
  type: string;
}

interface VideoConfig {
  sources?: VideoSource[];
  poster?: string;
  overlay?: OverlayType;
}

interface Badge {
  text: string;
  id: string;
}

interface Metric {
  label: string;
  value: string;
}

interface PersonaMicrocopy {
  primary: string;
  secondary?: string;
}

interface VideoHeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  video?: VideoConfig;
  badges?: Badge[];
  metrics?: Metric[];
  personaKey?: string;
  personaMicrocopy?: Record<string, PersonaMicrocopy>;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  children?: React.ReactNode;
}

const overlayClasses: Record<OverlayType, string> = {
  soft: 'bg-neutral-dark/65',
  radial: 'bg-gradient-to-br from-neutral-dark/80 via-neutral-dark/60 to-neutral-dark/80',
  solid: 'bg-neutral-dark/75'
};

function resolveOverlayClass(overlay?: OverlayType): string {
  return overlayClasses[overlay || 'radial'];
}

function selectPersonaMicrocopy(
  microcopyMap?: Record<string, PersonaMicrocopy>,
  personaKey?: string
): PersonaMicrocopy | null {
  if (!microcopyMap) return null;
  if (personaKey && microcopyMap[personaKey]) {
    return microcopyMap[personaKey];
  }
  return microcopyMap.default || null;
}

export default function VideoHeroSection({
  eyebrow,
  title,
  subtitle,
  video,
  badges = [],
  metrics = [],
  personaKey = 'default',
  personaMicrocopy,
  ctaPrimaryText,
  ctaSecondaryText,
  onPrimaryClick,
  onSecondaryClick,
  children
}: VideoHeroSectionProps) {
  const overlayClass = resolveOverlayClass(video?.overlay);
  const microcopy = useMemo(
    () => selectPersonaMicrocopy(personaMicrocopy, personaKey),
    [personaKey, personaMicrocopy]
  );

  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-dark">
      {/* Video Background */}
      {video?.sources && video.sources.length > 0 && (
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

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-spacing-lg px-spacing-lg py-spacing-3xl text-center text-neutral-light">
        {/* Eyebrow */}
        {eyebrow && (
          <motion.span
            className="text-xs uppercase tracking-[0.4em] text-secondary/80"
            {...fadeInUp}
          >
            {eyebrow}
          </motion.span>
        )}

        {/* Title */}
        <motion.h1
          className="text-balance text-font-size-display font-extrabold text-neutral-light drop-shadow-xl"
          {...heroTitle}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-lg text-neutral-light/85 md:text-xl lg:max-w-3xl"
            {...heroSubtitle}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-spacing-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {badges.slice(0, 4).map((badge) => (
              <span
                key={badge.id}
                className="rounded-full border border-neutral-light/30 bg-neutral-light/10 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
              >
                {badge.text}
              </span>
            ))}
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap justify-center gap-spacing-md"
          {...heroCTA}
        >
          {ctaPrimaryText && (
            <Button size="lg" onClick={onPrimaryClick}>
              {ctaPrimaryText}
            </Button>
          )}
          {ctaSecondaryText && (
            <Button
              size="lg"
              className="border-2 border-neutral-light bg-transparent text-neutral-light hover:bg-neutral-light/10"
              onClick={onSecondaryClick}
            >
              {ctaSecondaryText}
            </Button>
          )}
        </motion.div>

        {/* Persona Microcopy */}
        {microcopy && (
          <motion.div
            className="rounded-2xl border border-secondary/30 bg-secondary/10 px-spacing-md py-spacing-sm text-xs text-secondary/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {microcopy.primary}
            {microcopy.secondary && (
              <span className="block text-neutral-light/80">{microcopy.secondary}</span>
            )}
          </motion.div>
        )}

        {/* Metrics */}
        {metrics.length > 0 && (
          <motion.dl
            className="mt-spacing-md grid w-full gap-spacing-lg text-left md:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {metrics.map((metric) => (
              <div
                key={`${metric.label}-${metric.value}`}
                className="rounded-2xl border border-neutral-light/10 bg-neutral-dark/40 p-spacing-md backdrop-blur-sm"
              >
                <dt className="text-xs uppercase tracking-wide text-neutral-light/60">
                  {metric.label}
                </dt>
                <dd className="text-2xl font-semibold text-neutral-light">{metric.value}</dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>

      {children}
    </section>
  );
}
