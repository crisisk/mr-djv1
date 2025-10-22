'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function MaastrichtPage() {
  return (
    <>
      {/* Hero Section - City specific */}
      <HeroSection
        eyebrow="DJ Maastricht"
        title="DJ Huren in Maastricht"
        subtitle="Professionele DJ service voor bruiloften, feesten en bedrijfsevents in Maastricht en omgeving"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Vraag Offerte"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="#contact"
        backgroundClass="bg-brand-gradient"
        titleColor="text-white"
        subtitleColor="text-white/90"
        badges={['Lokale DJ', '15+ jaar in Limburg', '100+ events in Maastricht']}
        socialProof="⭐ 5.0 sterren • Specialist in Maastricht en omgeving"
      />

      {/* Local expertise */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen Voor Een Lokale DJ in Maastricht?
            </h2>
            <p className="text-lg text-gray-600">
              Als vaste DJ in Maastricht kennen wij alle mooie locaties, werken we samen met de beste
              leveranciers en weten we wat er leeft in de Maastrichtse party scene.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-semibold text-lg mb-2">Lokale Kennis</h3>
              <p className="text-gray-600 text-sm">
                We kennen alle populaire locaties in Maastricht en weten precies wat er nodig is.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Lokaal Netwerk</h3>
              <p className="text-gray-600 text-sm">
                Samenwerking met fotografen, cateraars en andere leveranciers uit Maastricht.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="font-semibold text-lg mb-2">Geen Reiskosten</h3>
              <p className="text-gray-600 text-sm">
                Als lokale DJ in Maastricht rekenen we geen extra reiskosten voor events in de stad.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              DJ Services in Maastricht
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bruiloft DJ Maastricht</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor jullie bruiloft in Maastricht. Van ceremonie tot avondfeest.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/bruiloft'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-3">Feest DJ Maastricht</h3>
              <p className="text-gray-600 mb-4">
                Van verjaardagsfeest tot jubileum - wij zorgen voor een volle dansvloer in Maastricht.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/feesten'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bedrijfsfeest DJ Maastricht</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ service voor zakelijke events en bedrijfsfeesten in Maastricht.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/zakelijk'}>
                Meer info →
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <StatHighlights
            title="Onze Ervaring in Maastricht"
            stats={[
              {
                label: 'Events in Maastricht',
                value: '100+',
                description: 'Bruiloften, feesten en zakelijke events in Maastricht verzorgd'
              },
              {
                label: 'Lokale Klanten',
                value: '50+',
                description: 'Tevreden klanten in Maastricht en directe omgeving'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect gemiddelde van Maastrichtse klanten'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Popular locations */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
            Populaire Locaties in Maastricht
          </h2>
          <Card className="p-spacing-xl">
            <p className="text-gray-600 mb-4">
              We hebben ervaring met DJ sets op de volgende locaties in en rond Maastricht:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-2">Trouwlocaties Maastricht:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Diverse kastelen en landgoederen</li>
                  <li>• Horecagelegenheden in centrum</li>
                  <li>• Unieke industriële locaties</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Feestlocaties Maastricht:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Zalencentra en partycentra</li>
                  <li>• Sportaccommodaties</li>
                  <li>• Bedrijfspanden en evenementenlocaties</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <PricingTables />
      </section>

      {/* CTA */}
      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            DJ Nodig in Maastricht?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan voor jouw event in Maastricht
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
            >
              Vraag offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Bel: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}