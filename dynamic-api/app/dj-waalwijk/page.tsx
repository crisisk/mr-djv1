'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function DjWaalwijkPage() {
  return (
    <>
      <HeroSection
        eyebrow="Bruiloft & Feest DJ"
        title="DJ Waalwijk | DJ Huren Waalwijk"
        subtitle="Professionele DJ Waalwijk voor bruiloften, feesten en events. Boek nu de beste DJ van Waalwijk!"
        ctaPrimaryText="Bekijk Beschikbaarheid"
        ctaSecondaryText="Bel Direct"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="tel:0408422594"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['DJ Waalwijk', 'Lokale Specialist', '100+ Events']}
        socialProof="⭐ 5.0 sterren • Meest geboekte DJ in Waalwijk"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            DJ Waalwijk: De #1 Keuze Voor Jouw Event
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Ben je op zoek naar een <strong>DJ in Waalwijk</strong>? Dan ben je bij ons aan het juiste adres!
              Als meest ervaren <strong>DJ Waalwijk</strong> hebben wij al meer dan 100 bruiloften, feesten
              en bedrijfsevents in Waalwijk verzorgd.
            </p>
            <p>
              Wat maakt ons de beste <strong>DJ Waalwijk</strong>? Onze jarenlange ervaring, perfecte kennis
              van alle locaties in Waalwijk, en natuurlijk onze 100% dansgarantie. Als <strong>DJ Waalwijk</strong>
              zorgen wij ervoor dat jouw gasten de hele avond op de dansvloer staan!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Wij Dé DJ van Waalwijk Zijn"
            stats={[
              {
                label: 'Events als DJ Waalwijk',
                value: '100+',
                description: 'Bruiloften en feesten in Waalwijk verzorgd'
              },
              {
                label: 'Reviews DJ Waalwijk',
                value: '5.0★',
                description: 'Perfect gemiddelde op Google en social media'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug als DJ Waalwijk'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
            DJ Waalwijk Voor Elk Type Event
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-semibold text-xl mb-3">Bruiloft DJ Waalwijk</h3>
              <p className="text-gray-600 mb-4">
                De beste bruiloft DJ van Waalwijk. Van ceremonie tot avondfeest, wij verzorgen jullie complete dag.
              </p>
              <Button variant="ghost" size="sm">Meer over bruiloften →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-semibold text-xl mb-3">Feest DJ Waalwijk</h3>
              <p className="text-gray-600 mb-4">
                DJ Waalwijk voor verjaardagen, jubilea en drive-in shows. 100% dansgarantie!
              </p>
              <Button variant="ghost" size="sm">Meer over feesten →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-semibold text-xl mb-3">Zakelijke DJ Waalwijk</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor bedrijfsfeesten en corporate events in Waalwijk.
              </p>
              <Button variant="ghost" size="sm">Meer over zakelijk →</Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Veelgestelde Vragen Over DJ Waalwijk
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een DJ in Waalwijk?
              </summary>
              <p className="mt-4 text-gray-600">
                Als DJ Waalwijk hanteren wij transparante prijzen vanaf €695 voor een basisfeest.
                Voor een bruiloft DJ Waalwijk starten we vanaf €895. Bekijk al onze pakketten of
                vraag een persoonlijke offerte aan.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Hoe ver van tevoren moet ik een DJ Waalwijk boeken?
              </summary>
              <p className="mt-4 text-gray-600">
                Voor bruiloften adviseren we als DJ Waalwijk minimaal 6-9 maanden van tevoren,
                vooral voor populaire datums. Voor andere feesten kan dit vaak korter.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke locaties in Waalwijk ken je als DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Als vaste DJ Waalwijk kennen we alle populaire trouw- en feestlocaties in Waalwijk
                en omgeving. We hebben ervaring met kastelen, horecagelegenheden, zalencentra en industriële
                locaties in heel Waalwijk.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu DJ Waalwijk
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan als DJ Waalwijk voor jouw event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50">
              Vraag DJ Waalwijk offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel DJ Waalwijk: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}