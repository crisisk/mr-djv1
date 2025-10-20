import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, className = '' }) => {
  const baseStyle = 'font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4';

  const variantStyles = {
    primary: 'bg-[var(--color-primary-blue)] text-white hover:bg-[#00487A] focus:ring-[#66A6D9] focus:ring-offset-2 focus:ring-offset-white',
    secondary: 'bg-[var(--color-secondary-gold)] text-white hover:bg-[#7A5500] focus:ring-[#C28E2C] focus:ring-offset-2 focus:ring-offset-white',
    outline: 'bg-transparent border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] hover:text-white focus:ring-[#66A6D9] focus:ring-offset-2 focus:ring-offset-white',
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
