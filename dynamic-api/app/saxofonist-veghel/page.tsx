'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function SaxofonistVeghelPage() {
  return (
    <>
      <HeroSection
        eyebrow="Live Saxofonist"
        title="Saxofonist Veghel | DJ met Saxofonist"
        subtitle="Boek een live saxofonist in Veghel! Unieke combinatie van DJ + saxofonist voor jouw bruiloft of feest"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Luister Samples"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="#samples"
        backgroundClass="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['Live Sax Veghel', 'DJ + Sax Combo', '50+ Shows']}
        socialProof="🎷 De beste saxofonist van Veghel"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Waarom Een Saxofonist in Veghel?
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Op zoek naar een <strong>saxofonist in Veghel</strong>? Een live saxofonist maakt
              je bruiloft of feest in Veghel extra bijzonder! De combinatie van een <strong>DJ met
              saxofonist Veghel</strong> zorgt voor een unieke sfeer die je gasten niet snel vergeten.
            </p>
            <p>
              Onze <strong>saxofonist Veghel</strong> speelt live mee met de beste house, deep house
              en party classics. Perfect voor bruiloften, bedrijfsfeesten en jubilea in Veghel en omgeving!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-12 text-center">
            Wat Maakt Onze Saxofonist Veghel Uniek?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎷</div>
              <h3 className="font-semibold text-lg mb-2">Live Performance</h3>
              <p className="text-gray-600 text-sm">
                Professionele saxofonist Veghel speelt live tijdens de grootste hits
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="font-semibold text-lg mb-2">DJ + Sax Combo</h3>
              <p className="text-gray-600 text-sm">
                Perfecte samenspel tussen DJ en saxofonist Veghel
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="font-semibold text-lg mb-2">Premium Ervaring</h3>
              <p className="text-gray-600 text-sm">
                Maak je event in Veghel onvergetelijk met live saxofoon
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="font-semibold text-lg mb-2">Visueel Spektakel</h3>
              <p className="text-gray-600 text-sm">
                Saxofonist Veghel met professionele lichtshow en sfeer
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <StatHighlights
            title="Ervaring als Saxofonist Veghel"
            stats={[
              {
                label: 'Shows in Veghel',
                value: '50+',
                description: 'DJ + Sax shows als saxofonist Veghel verzorgd'
              },
              {
                label: 'Tevreden Klanten',
                value: '100%',
                description: 'Alle klanten bevelen onze saxofonist Veghel aan'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect beoordeeld als saxofonist Veghel'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      <section id="samples" className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
            Saxofonist Veghel in Actie
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-spacing-lg">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">🎥 Video showreel saxofonist Veghel</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Bruiloft Veghel 2024</h3>
              <p className="text-gray-600 text-sm">
                Fragment van onze saxofonist tijdens een bruiloft in Veghel
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">🎥 Video DJ + Sax Veghel</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Bedrijfsfeest Veghel</h3>
              <p className="text-gray-600 text-sm">
                DJ + Saxofonist Veghel tijdens corporate event
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
            Pakketten DJ + Saxofonist Veghel
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-spacing-xl">
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl font-bold mb-2">Sax Experience</h3>
                <div className="text-4xl font-bold text-brand-600 mb-2">€1.345</div>
                <p className="text-gray-600">DJ + 2 uur live saxofonist</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Professionele DJ (4 uur)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Live saxofonist Veghel (2 uur)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Premium licht & geluid</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Muziek op maat</span>
                </li>
              </ul>
              <Button className="w-full">Boek Sax Experience</Button>
            </Card>

            <Card className="p-spacing-xl border-2 border-brand-600">
              <div className="text-center mb-6">
                <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAIR</span>
                <h3 className="font-display text-2xl font-bold mb-2 mt-2">Sax All-In</h3>
                <div className="text-4xl font-bold text-brand-600 mb-2">€1.795</div>
                <p className="text-gray-600">DJ + 4 uur live saxofonist</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Professionele DJ (6 uur)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Live saxofonist Veghel (4 uur)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Premium licht & laser show</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Optionele photobooth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Hele dag begeleiding</span>
                </li>
              </ul>
              <Button className="w-full bg-brand-600">Boek Sax All-In</Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Veelgestelde Vragen Saxofonist Veghel
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een saxofonist in Veghel?
              </summary>
              <p className="mt-4 text-gray-600">
                Een saxofonist Veghel in combinatie met DJ kost vanaf €1.345 voor 2 uur live sax.
                Voor het hele feest (4 uur sax) betaal je €1.795. Alle apparatuur en transport is inbegrepen.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke muziek speelt de saxofonist Veghel?
              </summary>
              <p className="mt-4 text-gray-600">
                Onze saxofonist Veghel speelt live mee met house, deep house, lounge, jazz en party classics.
                We stemmen het repertoire af op jouw wensen en gasten.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Is de saxofonist Veghel ook beschikbaar zonder DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Ja! Onze saxofonist Veghel kan ook solo optreden tijdens borrels, diners of ceremonies.
                Vraag een persoonlijke offerte aan voor de mogelijkheden.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu Saxofonist Veghel
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Maak je event in Veghel onvergetelijk met een live saxofonist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50">
              Vraag saxofonist Veghel offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}