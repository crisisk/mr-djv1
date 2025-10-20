import React from 'react';
import Button from '../Atoms/Buttons.jsx';
import { colors, spacing, typography } from '../../theme/tokens.js';

const HeroSection = ({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundClass = '',
  backgroundImage = null,
  titleColor = '',
  subtitleColor = '',
  variant = 'A',
  children,
}) => {
  const sectionStyle = {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: !backgroundImage && !backgroundClass ? colors.neutral.dark : undefined,
  };

  const backgroundImageStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  const titleStyle = {
    color: titleColor ? undefined : backgroundImage ? colors.neutral.light : colors.secondary.main,
    fontSize: typography.fontSize.h1,
    fontFamily: typography.fontFamily.heading,
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.tight,
    marginBottom: spacing.md,
  };

  const subtitleStyle = {
    color: subtitleColor ? undefined : colors.neutral.light,
    fontSize: typography.fontSize.h3,
    fontFamily: typography.fontFamily.primary,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing.xl,
  };

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing.md,
  };

  // Handle CTA button clicks with GTM tracking
  const handlePrimaryClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_type: 'primary',
        cta_text: ctaPrimaryText,
        variant: variant,
        section: 'hero'
      });
    }
  };

  const handleSecondaryClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_type: 'secondary',
        cta_text: ctaSecondaryText,
        variant: variant,
        section: 'hero'
      });
    }
  };

  return (
    <div
      className={`${!backgroundImage && backgroundClass ? backgroundClass : ''} min-h-[60vh] flex items-center relative`}
      style={{ ...sectionStyle, ...backgroundImageStyle }}
    >
      <div className="container mx-auto text-center relative z-10">
        <h1
          className={`${titleColor} ${backgroundImage ? 'drop-shadow-lg' : ''}`.trim()}
          style={titleStyle}
        >
          {title}
        </h1>
        <p
          className={`max-w-4xl mx-auto ${subtitleColor} ${backgroundImage ? 'drop-shadow-md' : ''}`.trim()}
          style={subtitleStyle}
        >
          {subtitle}
        </p>
        <div className="justify-center" style={actionsStyle}>
          <Button variant="secondary" size="lg" onClick={handlePrimaryClick}>
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button variant="outline" size="lg" onClick={handleSecondaryClick}>
              {ctaSecondaryText}
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
