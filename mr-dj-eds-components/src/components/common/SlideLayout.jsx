import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const variantStyles = {
  light: 'bg-neutral-light text-neutral-dark',
  brand: 'bg-gradient-to-br from-neutral-dark via-neutral-dark/95 to-neutral-dark text-neutral-light',
  ocean: 'bg-gradient-to-br from-primary/15 via-neutral-light to-neutral-light text-neutral-dark',
};

const SlideLayout = ({
  title,
  subtitle,
  variant = 'light',
  align = 'start',
  className,
  children,
}) => {
  const baseStyles = 'w-full rounded-3xl shadow-xl border border-neutral-gray-100/80 px-spacing-2xl py-spacing-2xl md:px-spacing-3xl md:py-spacing-3xl';

  return (
    <section
      className={cn(
        baseStyles,
        variantStyles[variant] ?? variantStyles.light,
        align === 'center' ? 'text-center' : 'text-left',
        'flex flex-col gap-spacing-xl',
        className,
      )}
    >
      {(title || subtitle) && (
        <header className={cn('space-y-spacing-xs', align === 'center' && 'mx-auto max-w-3xl')}>
          {title && (
            <h2 className="text-font-size-h1 font-extrabold tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-font-size-body text-neutral-gray-500 md:text-lg">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
};

SlideLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.oneOf(['light', 'brand', 'ocean']),
  align: PropTypes.oneOf(['start', 'center']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SlideLayout;
