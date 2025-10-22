'use client';

import React, { useState } from 'react';
import { Menu, Phone, ShieldCheck, User } from 'lucide-react';
import Button from '../ui/Button';

interface NavigationProps {
  className?: string;
  onMenuToggle?: () => void;
}

const primaryLinks = ['Diensten', 'Pakketten', 'Reviews', 'Over ons'];
const footerLinks = [
  ['DJ voor bruiloften', 'DJ voor bedrijfsfeesten', 'DJ + Sax', 'Silent Disco'],
  ['Werkwijze', 'FAQ', 'Contact', 'Blog'],
];

/**
 * Navigation Component
 * Responsive navigation patterns for desktop and mobile
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
const Navigation: React.FC<NavigationProps> = ({ className = '', onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <div className={`space-y-spacing-xl ${className}`}>
      {/* Desktop/Mobile Header */}
      <header className="flex flex-wrap items-center justify-between gap-spacing-md rounded-3xl border border-gray-200 bg-white/90 p-spacing-xl shadow-lg">
        <div className="flex items-center gap-spacing-md">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            DJ
          </div>
          <nav className="hidden items-center gap-spacing-lg text-sm font-semibold text-neutral-dark md:flex">
            {primaryLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="transition hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-spacing-sm">
          <Button
            variant="ghost"
            size="sm"
            className="hidden gap-spacing-xs text-sm text-neutral-dark md:flex"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            2500+ events
          </Button>
          <Button size="lg" className="gap-spacing-xs">
            <Phone className="size-4" aria-hidden="true" />
            Plan een intake
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden aspect-square px-2"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-md md:hidden">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark mb-spacing-md">Menu</h3>
          <div className="space-y-spacing-sm">
            {primaryLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-white px-spacing-lg py-spacing-md min-h-[44px] text-left text-sm font-semibold text-neutral-dark shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                {link}
                <span className="text-xs text-primary" aria-hidden="true">→</span>
              </button>
            ))}
            <Button variant="secondary" size="lg" className="w-full gap-spacing-xs mt-spacing-md">
              <User className="size-4" aria-hidden="true" />
              Inloggen klantenportal
            </Button>
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <footer className="grid gap-spacing-lg rounded-3xl border border-gray-200 bg-white/80 p-spacing-xl shadow-lg md:grid-cols-3">
        {footerLinks.map((column, index) => (
          <div key={index} className="space-y-spacing-sm">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
              {index === 0 ? 'Diensten' : 'Resources'}
            </h4>
            <ul className="space-y-spacing-xs text-sm text-neutral-dark">
              {column.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition hover:text-primary focus:text-primary focus:outline-none focus:underline rounded"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="space-y-spacing-sm">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</h4>
          <p className="text-sm text-neutral-dark">
            Vragen? Mail naar{' '}
            <a
              href="mailto:info@misterdj.nl"
              className="text-primary underline hover:text-primary-blue focus:outline-none focus:ring-2 focus:ring-primary"
            >
              info@misterdj.nl
            </a>
          </p>
          <Button variant="secondary" size="lg">
            Download mediakit
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Navigation;
