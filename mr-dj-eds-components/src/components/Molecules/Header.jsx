import React from 'react';
import Logo from '../Atoms/Logo.jsx';

/**
 * Header Component
 * Site header with logo and navigation
 *
 * Props:
 * - transparent: boolean - If true, header has transparent background
 */
const Header = ({ transparent = false }) => {
  const bgClass = transparent
    ? 'bg-transparent'
    : 'bg-neutral-light border-b border-neutral-gray-100';

  return (
    <header className={`${bgClass} py-spacing-md sticky top-0 z-40 backdrop-blur-sm`}>
      <div className="container mx-auto px-spacing-md flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center hover:opacity-80 transition">
          <Logo size="medium" />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-spacing-lg">
          <a
            href="/#diensten"
            className="text-font-size-body text-neutral-dark hover:text-primary transition font-medium"
          >
            Diensten
          </a>
          <a
            href="/#pakketten"
            className="text-font-size-body text-neutral-dark hover:text-primary transition font-medium"
          >
            Pakketten
          </a>
          <a
            href="/#reviews"
            className="text-font-size-body text-neutral-dark hover:text-primary transition font-medium"
          >
            Reviews
          </a>
          <a
            href="tel:+31408422594"
            className="text-font-size-body bg-primary text-neutral-light px-spacing-md py-spacing-sm rounded-lg hover:bg-primary-600 transition font-bold"
          >
            +31 (0) 40 842 2594
          </a>
        </nav>

        {/* Mobile CTA */}
        <div className="md:hidden">
          <a
            href="tel:+31408422594"
            className="text-font-size-small bg-primary text-neutral-light px-spacing-sm py-spacing-xs rounded-lg hover:bg-primary-600 transition font-bold"
          >
            Bel Nu
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
