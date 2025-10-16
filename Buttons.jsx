import React, { forwardRef } from 'react';

const VARIANT_STYLES = {
  primary: 'bg-primary text-neutral-light hover:bg-primary/90 focus-visible:ring-primary/40',
  secondary: 'bg-secondary text-neutral-dark hover:bg-secondary/90 focus-visible:ring-secondary/40',
  outline: 'border border-neutral-dark text-neutral-dark hover:bg-neutral-light focus-visible:ring-neutral-dark/40',
  ghost: 'text-neutral-dark hover:bg-neutral-gray-100 focus-visible:ring-neutral-dark/30',
};

const SIZE_STYLES = {
  sm: 'px-spacing-sm py-spacing-xs text-font-size-small',
  md: 'px-spacing-md py-spacing-sm text-font-size-body',
  lg: 'px-spacing-lg py-spacing-md text-font-size-h4',
};

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const Button = forwardRef(({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }, ref) => {
  const variantClasses = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const sizeClasses = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${variantClasses} ${sizeClasses} ${className}`.trim()}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export default Button;
