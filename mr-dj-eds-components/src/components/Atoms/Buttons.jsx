import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, className = '' }) => {
  const baseStyle = 'font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4';

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-neutral-400',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-300',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-200',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
