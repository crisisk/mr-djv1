'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function CookiebeleidPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
            ← Terug naar home
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Cookiebeleid
          </h1>
          <p className="text-lg text-gray-600">
            Cookiebeleid van Mister DJ. Lees welke cookies wij gebruiken en waarom.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-spacing-3xl px-spacing-xl">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
      <h2>1. Wat zijn cookies?</h2>
      <p>Cookies zijn kleine tekstbestanden die op uw computer of mobiel apparaat worden geplaatst wanneer u onze website bezoekt.</p>

      <h2>2. Welke cookies gebruiken wij?</h2>
      <ul>
        <li><strong>Functionele cookies:</strong> Voor de werking van de website (altijd actief)</li>
        <li><strong>Analytische cookies:</strong> Google Analytics voor websitestatistieken (met toestemming)</li>
        <li><strong>Marketing cookies:</strong> Voor gepersonaliseerde advertenties (met toestemming)</li>
      </ul>

      <h2>3. Cookies van derden</h2>
      <p>Wij gebruiken Google Analytics voor statistieken. Google kan deze informatie aan derden verschaffen indien Google hiertoe wettelijk wordt verplicht.</p>

      <h2>4. Cookies beheren</h2>
      <p>U kunt cookies uitschakelen via uw browserinstellingen. Let op: sommige functionaliteiten van de website werken mogelijk niet optimaal zonder cookies.</p>

      <h2>5. Toestemming intrekken</h2>
      <p>U kunt uw toestemming voor cookies op elk moment intrekken via de cookie-instellingen op onze website.</p>
    
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Nog vragen?
          </h2>
          <p className="text-gray-600 mb-6">
            Neem vrijblijvend contact met ons op
          </p>
          <Button size="lg" onClick={() => window.location.href = '/contact'}>
            Contact opnemen
          </Button>
        </div>
      </section>
    </div>
  );
}