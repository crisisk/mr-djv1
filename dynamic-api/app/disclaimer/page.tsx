'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
            ← Terug naar home
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-gray-600">
            Disclaimer van Mister DJ over aansprakelijkheid en gebruik van de website.
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
            
      <h2>1. Inhoud website</h2>
      <p>Mister DJ streeft ernaar de informatie op deze website zo volledig en actueel mogelijk te houden. Ondanks deze zorg kan Mister DJ niet garanderen dat de informatie volledig en juist is.</p>

      <h2>2. Aansprakelijkheid</h2>
      <p>Mister DJ aanvaardt geen aansprakelijkheid voor schade als gevolg van onjuistheden en/of verouderde informatie op deze website.</p>

      <h2>3. Links naar andere websites</h2>
      <p>Deze website kan links bevatten naar externe websites. Mister DJ is niet verantwoordelijk voor de inhoud van deze externe websites.</p>

      <h2>4. Auteursrechten</h2>
      <p>Alle rechten met betrekking tot deze website berusten bij Mister DJ. Het is niet toegestaan zonder voorafgaande schriftelijke toestemming informatie te vermenigvuldigen of openbaar te maken.</p>

      <h2>5. Wijzigingen</h2>
      <p>Mister DJ behoudt zich het recht voor deze disclaimer te wijzigen. Controleer deze pagina regelmatig voor updates.</p>
    
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