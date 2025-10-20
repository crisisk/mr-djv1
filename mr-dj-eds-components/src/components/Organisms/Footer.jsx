import React from 'react';
import { trackPhoneClick, trackContactNavigation, getUserVariant } from '../../utils/trackConversion';
import socialLinks from '../../config/socialLinks';

/**
 * Professional Footer Component
 * Premium site footer with company info, navigation, social media, and trust badges
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Track phone click
  const handlePhoneClick = () => {
    const variant = getUserVariant();
    trackPhoneClick(variant, 'footer');
  };

  // Track contact navigation
  const handleContactClick = (e) => {
    const variant = getUserVariant();
    trackContactNavigation(variant, 'footer');
  };

  const { facebook, instagram, linkedin } = socialLinks;

  return (
    <footer className="bg-gradient-to-br from-[#1A2C4B] via-[#2A3C5B] to-[#1A2C4B] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-2">Mr. DJ</h3>
              <p className="text-base text-gray-300">
                Dé Feestspecialist van het Zuiden
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                15+ jaar ervaring
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                500+ tevreden klanten
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                4.9/5 gemiddelde score
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-700">
              <a
                href="tel:+31408422594"
                onClick={handlePhoneClick}
                className="flex items-center gap-3 text-base hover:text-[#00AEEF] transition group"
                aria-label="Bel Mister DJ via +31 (0) 40 842 2594"
                title="Bel Mister DJ via +31 (0) 40 842 2594"
              >
                <svg className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span aria-hidden="true">+31 (0) 40 842 2594</span>
                <span className="sr-only">Bel Mister DJ via telefoon</span>
              </a>
              <a
                href="mailto:info@mr-dj.nl"
                className="flex items-center gap-3 text-base hover:text-[#00AEEF] transition group"
                aria-label="Stuur een e-mail naar info@mr-dj.nl"
                title="Stuur een e-mail naar info@mr-dj.nl"
              >
                <svg className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span aria-hidden="true">info@mr-dj.nl</span>
                <span className="sr-only">E-mail Mister DJ</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[#00AEEF] mb-4">Onze Diensten</h4>
            <ul className="space-y-3">
              <li>
                <a href="/bruiloft-dj" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Bruiloft DJ + Saxofoon
                </a>
              </li>
              <li>
                <a href="/zakelijk" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Zakelijk DJ
                </a>
              </li>
              <li>
                <a href="/feest-dj" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Feest DJ (Verjaardag & Jubileum)
                </a>
              </li>
              <li>
                <a href="/verhuur" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Licht & Geluid Verhuur
                </a>
              </li>
              <li>
                <a href="/#" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Live Saxofonist
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[#00AEEF] mb-4">Informatie</h4>
            <ul className="space-y-3">
              <li>
                <a href="/over-ons" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Over Ons
                </a>
              </li>
              <li>
                <a href="/faq" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Veelgestelde Vragen
                </a>
              </li>
              <li>
                <a href="/contact" onClick={handleContactClick} className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact
                </a>
              </li>
              <li>
                <a href="/#reviews" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Reviews & Referenties
                </a>
              </li>
              <li>
                <a href="/#pakketten" className="text-base text-gray-300 hover:text-[#D4AF37] transition flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-[#00AEEF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Pakketten & Prijzen
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[#00AEEF] mb-4">Blijf Verbonden</h4>
            <p className="text-sm text-gray-400">
              Volg ons voor de nieuwste shows, tips en exclusieve aanbiedingen
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-[#00AEEF] text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-[#0077B5] text-white rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>100% Betrouwbaar</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Bereikbaar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © {currentYear} Mr. DJ. Alle rechten voorbehouden. | Kvk: 12345678
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <a href="/privacy-policy" className="hover:text-[#00AEEF] transition">
                Privacybeleid
              </a>
              <a href="/algemene-voorwaarden" className="hover:text-[#00AEEF] transition">
                Algemene Voorwaarden
              </a>
              <a href="/cookie-policy" className="hover:text-[#00AEEF] transition">
                Cookiebeleid
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
