import React from 'react'
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

  return (
    <div className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center">
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md`}>
          {resolvedTitle}
        </h1>
        <p className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor}`}>
          {resolvedSubtitle}
        </p>
        <div className="flex justify-center space-x-spacing-md">
          <Button variant="secondary" size="lg">
            {resolvedPrimaryCta}
          </Button>
          {resolvedSecondaryCta && (
            <Button variant="outline" size="lg">
              {resolvedSecondaryCta}
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

export default HeroSection
