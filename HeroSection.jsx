import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Buttons.jsx'

const HeroSection = ({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundClass = 'bg-neutral-dark',
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  children,
}) => {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('hero.title')
  const resolvedSubtitle = subtitle ?? t('hero.subtitle')
  const resolvedPrimaryCta = ctaPrimaryText ?? t('hero.ctaPrimaryText')
  const resolvedSecondaryCta = ctaSecondaryText ?? t('hero.ctaSecondaryText')

  const ctaGroupLabelId = useId()
  const ctaGroupDescriptionId = useId()
  const statsGroupLabelId = useId()

  return (
    <div
      className={`${backgroundClass} hero-motion py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}
    >
      <div className="container mx-auto text-center hero-motion__inner">
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md hero-motion__headline`}>
          {resolvedTitle}
        </h1>
        <p
          className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor} hero-motion__subtitle`}
        >
          {resolvedSubtitle}
        </p>
        <div className="flex justify-center space-x-spacing-md hero-motion__ctaGroup">
          <Button variant="secondary" size="lg" className="hero-motion__cta">
            {resolvedPrimaryCta}
          </Button>
          {resolvedSecondaryCta && (
            <Button variant="outline" size="lg" className="hero-motion__cta hero-motion__cta--secondary">
              {resolvedSecondaryCta}
            </Button>
          )}
        </div>
        {children && <div className="hero-motion__statsSlot">{children}</div>}
      </div>
    </div>
  )
}

export default HeroSection
