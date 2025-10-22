'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function PrivacyverklaringPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
            ← Terug naar home
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Privacyverklaring
          </h1>
          <p className="text-lg text-gray-600">
            Privacyverklaring van Mister DJ. Lees hoe wij omgaan met uw persoonlijke gegevens.
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
            
      <h2>1. Persoonsgegevens die wij verwerken</h2>
      <p>Mister DJ verwerkt uw persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt.</p>

      <h2>2. Waarom we gegevens nodig hebben</h2>
      <p>Wij verwerken uw gegevens voor: contactopname, facturering, uitvoering van de overeenkomst, en marketing (met toestemming).</p>

      <h2>3. Hoelang we gegevens bewaren</h2>
      <p>Wij bewaren uw gegevens niet langer dan noodzakelijk, met een maximum van 7 jaar voor administratieve doeleinden.</p>

      <h2>4. Delen met derden</h2>
      <p>Wij delen uw gegevens alleen met derden als dit noodzakelijk is voor uitvoering van onze diensten of wettelijk verplicht.</p>

      <h2>5. Uw rechten</h2>
      <p>U heeft recht op inzage, correctie, verwijdering, beperking, bezwaar en overdracht van uw gegevens. Neem hiervoor contact met ons op.</p>
    
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