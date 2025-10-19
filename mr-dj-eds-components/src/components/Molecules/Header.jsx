import React, { useState, useEffect } from 'react';
import Logo from '../Atoms/Logo.jsx';
import { trackPhoneClick, trackContactNavigation, getUserVariant } from '../../utils/trackConversion';

/**
 * Professional Header Component with Mobile Menu
 * Premium site header with logo, navigation, and mobile responsiveness
 *
 * Props:
 * - transparent: boolean - If true, header has transparent background
 */
const Header = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track phone click
  const handlePhoneClick = () => {
    const variant = getUserVariant();
    trackPhoneClick(variant, 'header');
  };

  // Track contact navigation
  const handleContactClick = (e) => {
    const variant = getUserVariant();
    trackContactNavigation(variant, 'header');
  };

  const bgClass = transparent && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-lg shadow-sm';

  return (
    <header className={`${bgClass} py-4 sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Logo size="medium" />
            <span className="ml-3 text-xl font-bold text-[#1A2C4B] hidden sm:inline">
              Mr. DJ
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/bruiloft-dj" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              Bruiloft DJ
            </a>
            <a href="/zakelijk" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              Zakelijk
            </a>
            <a href="/feest-dj" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              Feest DJ
            </a>
            <a href="/verhuur" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              Verhuur
            </a>
            <a href="/over-ons" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              Over Ons
            </a>
            <a href="/faq" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium">
              FAQ
            </a>
            <a href="/contact" onClick={handleContactClick} className="text-base bg-gradient-to-r from-[#00AEEF] to-[#0096D6] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-bold">
              Contact
            </a>
            <a href="tel:+31408422594" onClick={handlePhoneClick} className="text-base bg-[#D4AF37] text-white px-6 py-2.5 rounded-full hover:bg-[#C4A137] transition font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel Direct
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A2C4B] hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-3">
              <a href="/bruiloft-dj" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                Bruiloft DJ
              </a>
              <a href="/zakelijk" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                Zakelijk
              </a>
              <a href="/feest-dj" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                Feest DJ
              </a>
              <a href="/verhuur" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                Verhuur
              </a>
              <a href="/over-ons" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                Over Ons
              </a>
              <a href="/faq" className="text-base text-[#1A2C4B] hover:text-[#00AEEF] transition font-medium py-2">
                FAQ
              </a>
              <a href="/contact" onClick={handleContactClick} className="text-base bg-[#00AEEF] text-white px-6 py-3 rounded-lg hover:bg-[#0096D6] transition font-bold text-center mt-2">
                Contact Opnemen
              </a>
              <a href="tel:+31408422594" onClick={handlePhoneClick} className="text-base bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#C4A137] transition font-bold text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Bel: +31 (0) 40 842 2594
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
