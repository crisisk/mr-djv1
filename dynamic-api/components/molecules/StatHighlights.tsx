'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string | number;
  description?: string;
}

interface StatHighlightsProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  orientation?: 'horizontal' | 'vertical';
  emphasizeColor?: string;
  className?: string;
  animated?: boolean;
}

const defaultStats: Stat[] = [
  {
    label: 'Gemiddelde reviewscore',
    value: '9,8',
    description: 'Op basis van 250+ recensies via ThePerfectWedding, Google en Trustpilot.',
  },
  {
    label: 'Aanvragen binnen 24 uur beantwoord',
    value: '100%',
    description: 'Dedicated planningsteam dat elke lead persoonlijk opvolgt.',
  },
  {
    label: 'Succesvolle evenementen in 2024',
    value: '312',
    description: 'Van intieme bruiloften tot corporate events met 1000+ gasten.',
  },
];

const orientationMap = {
  horizontal: 'grid grid-cols-1 md:grid-cols-3 gap-spacing-lg md:gap-spacing-xl',
  vertical: 'grid grid-cols-1 gap-spacing-lg',
};

/**
 * StatHighlights Component
 * Displays key statistics and metrics in an engaging visual format
 *
 * @example
 * ```tsx
 * <StatHighlights
 *   title="Bewezen Resultaten"
 *   subtitle="Waarom klanten voor ons kiezen"
 *   stats={[
 *     { label: 'Tevreden klanten', value: '2500+', description: 'Sinds 2008' },
 *     { label: 'Gemiddelde score', value: '9.8', description: 'Op basis van reviews' },
 *   ]}
 *   orientation="horizontal"
 *   animated={true}
 * />
 * ```
 */
const StatHighlights: React.FC<StatHighlightsProps> = ({
  title,
  subtitle,
  stats = defaultStats,
  orientation = 'horizontal',
  emphasizeColor = 'text-primary',
  className = '',
  animated = false,
}) => {
  const layoutClasses = orientationMap[orientation] || orientationMap.horizontal;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const Container = animated ? motion.section : 'section';
  const Article = animated ? motion.article : 'article';

  return (
    <Container
      className={`rounded-2xl bg-white p-spacing-xl shadow-xl border border-gray-200 flex flex-col gap-spacing-lg ${className}`}
      {...(animated && {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: containerVariants,
      })}
    >
      {(title || subtitle) && (
        <div className="space-y-spacing-xs">
          {title && (
            <h3 className="text-font-size-h3 font-bold text-neutral-dark">{title}</h3>
          )}
          {subtitle && (
            <p className="text-font-size-body text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      <div className={layoutClasses}>
        {stats.map(({ value, label, description }, index) => (
          <Article
            key={`${label}-${index}`}
            className="flex flex-col gap-spacing-sm rounded-xl border border-gray-100 bg-gray-50/50 p-spacing-lg shadow-sm hover:shadow-md transition-shadow"
            {...(animated && { variants: itemVariants })}
          >
            <span className={`text-font-size-h1 font-extrabold tracking-tight ${emphasizeColor}`}>
              {value}
            </span>
            <span className="text-font-size-h3 font-semibold text-neutral-dark">{label}</span>
            {description && (
              <p className="text-font-size-body text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </Article>
        ))}
      </div>
    </Container>
  );
};

export default StatHighlights;
