
import * as React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ className, variant='primary', size='md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-2xl transition-[background,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';
  const variants = {
    primary: 'bg-brand-600 text-white hover:brightness-110 active:scale-[.98] shadow-md',
    secondary: 'bg-white text-text hover:bg-surface-muted border border-gray-200 shadow-sm',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };
  const sizes = { sm:'h-9 px-4 text-sm', md:'h-11 px-6 text-base', lg:'h-12 px-8 text-lg' };
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
