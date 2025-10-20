import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Buttons.jsx'

const HeroSection = ({
  title,
  subtitle,
  supportingCopy,
  badge,
  testimonial,
  stats,
  ctaPrimaryText,
  ctaSecondaryText,
  ctaPrimaryProps = {},
  ctaSecondaryProps = {},
  backgroundClass = 'bg-neutral-dark',
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  supportingColor = 'text-neutral-light/90',
  children,
}) => {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('hero.title')
  const resolvedSubtitle = subtitle ?? t('hero.subtitle')
  const resolvedPrimaryCta = ctaPrimaryText ?? t('hero.ctaPrimaryText')
  const resolvedSecondaryCta = ctaSecondaryText ?? t('hero.ctaSecondaryText')
  const resolvedBadge = badge ?? t('hero.badge')
  const resolvedSupportingCopy = supportingCopy ?? t('hero.supportingCopy')
  const translatedStats = stats ?? t('hero.stats', { returnObjects: true })
  const resolvedStats = Array.isArray(translatedStats) ? translatedStats : []
  const translatedTestimonial =
    testimonial ?? t('hero.testimonial', { returnObjects: true })
  const resolvedTestimonial =
    translatedTestimonial && typeof translatedTestimonial === 'object'
      ? translatedTestimonial
      : {}

  return (
    <div
      className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}
    >
      <div className="container mx-auto text-center max-w-5xl">
        {resolvedBadge && (
          <div className="inline-flex items-center justify-center rounded-full bg-secondary/10 text-secondary px-spacing-md py-spacing-2xs text-font-size-small font-semibold mb-spacing-md">
            {resolvedBadge}
          </div>
        )}
        <h1
          className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-sm leading-tight`}
        >
          {resolvedTitle}
        </h1>
        <p
          className={`text-font-size-h3 mb-spacing-md max-w-4xl mx-auto ${subtitleColor}`}
        >
          {resolvedSubtitle}
        </p>
        {resolvedSupportingCopy && (
          <p
            className={`text-font-size-body max-w-3xl mx-auto ${supportingColor} mb-spacing-xl`}
          >
            {resolvedSupportingCopy}
          </p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-spacing-sm sm:gap-spacing-md">
          <Button variant="secondary" size="lg" {...ctaPrimaryProps}>
            {resolvedPrimaryCta}
          </Button>
          {resolvedSecondaryCta && (
            <Button
              variant="outline"
              size="lg"
              {...ctaSecondaryProps}
            >
              {resolvedSecondaryCta}
            </Button>
          )}
        </div>
        {resolvedStats?.length > 0 && (
          <div className="mt-spacing-xl grid grid-cols-1 sm:grid-cols-3 gap-spacing-md text-neutral-light/90">
            {resolvedStats.map((stat, index) => (
              <div
                key={`${stat?.label ?? 'stat'}-${index}`}
                className="rounded-lg border border-neutral-light/10 bg-neutral-dark/20 px-spacing-md py-spacing-sm"
              >
                {stat?.value && (
                  <div className="text-font-size-h2 font-bold text-secondary">
                    {stat.value}
                  </div>
                )}
                {stat?.label && (
                  <div className="text-font-size-small uppercase tracking-wide text-neutral-light/70">
                    {stat.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {resolvedTestimonial?.quote && (
          <div className="mt-spacing-xl text-neutral-light/80 max-w-3xl mx-auto italic">
            “{resolvedTestimonial.quote}”
            {resolvedTestimonial?.author && (
              <span className="not-italic block text-font-size-small text-neutral-light/70 mt-spacing-2xs">
                — {resolvedTestimonial.author}
              </span>
            )}
          </div>
        )}
        {children && <div className="mt-spacing-xl">{children}</div>}
      </div>
    </div>
  )
}

export default HeroSection
