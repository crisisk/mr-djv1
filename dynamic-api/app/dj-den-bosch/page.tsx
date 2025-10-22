'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function DjDenBoschPage() {
  return (
    <>
      <HeroSection
        eyebrow="Bruiloft & Feest DJ"
        title="DJ Den Bosch | DJ Huren Den Bosch"
        subtitle="Professionele DJ Den Bosch voor bruiloften, feesten en events. Boek nu de beste DJ van Den Bosch!"
        ctaPrimaryText="Bekijk Beschikbaarheid"
        ctaSecondaryText="Bel Direct"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="tel:0408422594"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['DJ Den Bosch', 'Lokale Specialist', '100+ Events']}
        socialProof="⭐ 5.0 sterren • Meest geboekte DJ in Den Bosch"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            DJ Den Bosch: De #1 Keuze Voor Jouw Event
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Ben je op zoek naar een <strong>DJ in Den Bosch</strong>? Dan ben je bij ons aan het juiste adres!
              Als meest ervaren <strong>DJ Den Bosch</strong> hebben wij al meer dan 100 bruiloften, feesten
              en bedrijfsevents in Den Bosch verzorgd.
            </p>
            <p>
              Wat maakt ons de beste <strong>DJ Den Bosch</strong>? Onze jarenlange ervaring, perfecte kennis
              van alle locaties in Den Bosch, en natuurlijk onze 100% dansgarantie. Als <strong>DJ Den Bosch</strong>
              zorgen wij ervoor dat jouw gasten de hele avond op de dansvloer staan!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Wij Dé DJ van Den Bosch Zijn"
            stats={[
              {
                label: 'Events als DJ Den Bosch',
                value: '100+',
                description: 'Bruiloften en feesten in Den Bosch verzorgd'
              },
              {
                label: 'Reviews DJ Den Bosch',
                value: '5.0★',
                description: 'Perfect gemiddelde op Google en social media'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug als DJ Den Bosch'
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
            DJ Den Bosch Voor Elk Type Event
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-semibold text-xl mb-3">Bruiloft DJ Den Bosch</h3>
              <p className="text-gray-600 mb-4">
                De beste bruiloft DJ van Den Bosch. Van ceremonie tot avondfeest, wij verzorgen jullie complete dag.
              </p>
              <Button variant="ghost" size="sm">Meer over bruiloften →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-semibold text-xl mb-3">Feest DJ Den Bosch</h3>
              <p className="text-gray-600 mb-4">
                DJ Den Bosch voor verjaardagen, jubilea en drive-in shows. 100% dansgarantie!
              </p>
              <Button variant="ghost" size="sm">Meer over feesten →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-semibold text-xl mb-3">Zakelijke DJ Den Bosch</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor bedrijfsfeesten en corporate events in Den Bosch.
              </p>
              <Button variant="ghost" size="sm">Meer over zakelijk →</Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Veelgestelde Vragen Over DJ Den Bosch
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een DJ in Den Bosch?
              </summary>
              <p className="mt-4 text-gray-600">
                Als DJ Den Bosch hanteren wij transparante prijzen vanaf €695 voor een basisfeest.
                Voor een bruiloft DJ Den Bosch starten we vanaf €895. Bekijk al onze pakketten of
                vraag een persoonlijke offerte aan.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Hoe ver van tevoren moet ik een DJ Den Bosch boeken?
              </summary>
              <p className="mt-4 text-gray-600">
                Voor bruiloften adviseren we als DJ Den Bosch minimaal 6-9 maanden van tevoren,
                vooral voor populaire datums. Voor andere feesten kan dit vaak korter.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke locaties in Den Bosch ken je als DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Als vaste DJ Den Bosch kennen we alle populaire trouw- en feestlocaties in Den Bosch
                en omgeving. We hebben ervaring met kastelen, horecagelegenheden, zalencentra en industriële
                locaties in heel Den Bosch.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu DJ Den Bosch
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan als DJ Den Bosch voor jouw event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50">
              Vraag DJ Den Bosch offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel DJ Den Bosch: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}