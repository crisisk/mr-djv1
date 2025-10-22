'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
            ← Terug naar home
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Algemene Voorwaarden
          </h1>
          <p className="text-lg text-gray-600">
            De algemene voorwaarden van Mister DJ voor het huren van een DJ voor uw bruiloft, feest of bedrijfsevenement.
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
            
      <h2>1. Algemeen</h2>
      <p>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offerte en overeenkomsten tussen Mister DJ en de opdrachtgever.</p>

      <h2>2. Offerte en Overeenkomst</h2>
      <p>Alle offertes zijn vrijblijvend en 30 dagen geldig. Een overeenkomst komt tot stand na schriftelijke bevestiging door beide partijen.</p>

      <h2>3. Prijzen en Betaling</h2>
      <p>Alle prijzen zijn inclusief BTW en exclusief reiskosten buiten een straal van 25km vanaf Veldhoven. Betaling dient uiterlijk 2 weken voor het evenement te geschieden.</p>

      <h2>4. Annulering</h2>
      <p>Bij annulering tot 3 maanden voor het evenement: 25% van de totaalprijs. Bij annulering tot 1 maand voor het evenement: 50%. Bij annulering binnen 1 maand: 100%.</p>

      <h2>5. Aansprakelijkheid</h2>
      <p>Mister DJ is niet aansprakelijk voor schade ontstaan door overmacht. Aansprakelijkheid is in alle gevallen beperkt tot het factuurbedrag.</p>

      <h2>6. Geschillen</h2>
      <p>Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement Oost-Brabant.</p>
    
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