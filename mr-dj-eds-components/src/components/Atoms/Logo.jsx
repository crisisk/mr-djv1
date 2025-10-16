import React from 'react';

/**
 * Logo Component
 * Displays the Mr. DJ logo with WebP fallback to PNG
 *
 * Props:
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 */
const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-auto',
    medium: 'h-12 w-auto',
    large: 'h-16 w-auto',
  };

  return (
    <picture className={`inline-block ${className}`}>
      <source srcSet="/images/logo.webp" type="image/webp" />
      <img
        src="/images/logo.png"
        alt="Mr. DJ - Dé Feestspecialist van het Zuiden"
        className={`${sizeClasses[size]} object-contain`}
        loading="eager"
        width="auto"
        height={size === 'small' ? 32 : size === 'large' ? 64 : 48}
      />
    </picture>
  );
};

export default Logo;
