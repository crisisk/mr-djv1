import React, { forwardRef } from 'react';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    type = 'button',
    ...props
  },
  ref,
) {
  const baseStyle =
    'font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70';

  const variantStyles = {
    primary:
      'bg-[var(--color-primary-blue)] text-white hover:bg-[#00487A] focus-visible:ring-[#66A6D9] focus-visible:ring-offset-white',
    secondary:
      'bg-[var(--color-secondary-gold)] text-white hover:bg-[#7A5500] focus-visible:ring-[#C28E2C] focus-visible:ring-offset-white',
    outline:
      'bg-transparent border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] hover:text-white focus-visible:ring-[#66A6D9] focus-visible:ring-offset-white',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 focus-visible:ring-neutral-200 focus-visible:ring-offset-white',
    default:
      'bg-[var(--color-primary-blue)] text-white hover:bg-[#00487A] focus-visible:ring-[#66A6D9] focus-visible:ring-offset-white',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    sm: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    md: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    lg: 'px-6 py-3 text-lg',
  };

  const resolvedVariant = variantStyles[variant] ? variant : 'primary';
  const resolvedSize = sizeStyles[size] ? size : 'medium';

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyle} ${variantStyles[resolvedVariant]} ${sizeStyles[resolvedSize]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
