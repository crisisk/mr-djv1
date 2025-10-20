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
    <div className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center">
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md`}>
          {resolvedTitle}
        </h1>
        <p className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor}`}>
          {resolvedSubtitle}
        </p>
        <div
          className="flex flex-col items-center justify-center space-y-spacing-sm lg:flex-row lg:space-y-0 lg:space-x-spacing-md"
          role="group"
          aria-labelledby={ctaGroupLabelId}
          aria-describedby={ctaGroupDescriptionId}
        >
          <span id={ctaGroupLabelId} className="sr-only">
            Call-to-action knoppen
          </span>
          <span id={ctaGroupDescriptionId} className="sr-only">
            Kies een actie om direct met Mister DJ in contact te komen.
          </span>
          <Button
            variant="secondary"
            size="lg"
            aria-label={`Primaire actie: ${resolvedPrimaryCta}`}
            aria-describedby={ctaGroupDescriptionId}
          >
            {resolvedPrimaryCta}
          </Button>
          {resolvedSecondaryCta && (
            <Button
              variant="outline"
              size="lg"
              aria-label={`Secundaire actie: ${resolvedSecondaryCta}`}
              aria-describedby={ctaGroupDescriptionId}
            >
              {resolvedSecondaryCta}
            </Button>
          )}
        </div>
        {children && (
          <div
            className="mt-spacing-xl flex flex-col items-center space-y-spacing-md lg:mt-spacing-2xl lg:flex-row lg:justify-center lg:space-y-0 lg:space-x-spacing-xl"
            role="group"
            aria-labelledby={statsGroupLabelId}
          >
            <span id={statsGroupLabelId} className="sr-only">
              Belangrijke statistieken over Mister DJ
            </span>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroSection
