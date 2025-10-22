'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function DjVeldhovenPage() {
  return (
    <>
      <HeroSection
        eyebrow="Bruiloft & Feest DJ"
        title="DJ Veldhoven | DJ Huren Veldhoven"
        subtitle="Professionele DJ Veldhoven voor bruiloften, feesten en events. Boek nu de beste DJ van Veldhoven!"
        ctaPrimaryText="Bekijk Beschikbaarheid"
        ctaSecondaryText="Bel Direct"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="tel:0408422594"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['DJ Veldhoven', 'Lokale Specialist', '100+ Events']}
        socialProof="⭐ 5.0 sterren • Meest geboekte DJ in Veldhoven"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            DJ Veldhoven: De #1 Keuze Voor Jouw Event
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Ben je op zoek naar een <strong>DJ in Veldhoven</strong>? Dan ben je bij ons aan het juiste adres!
              Als meest ervaren <strong>DJ Veldhoven</strong> hebben wij al meer dan 100 bruiloften, feesten
              en bedrijfsevents in Veldhoven verzorgd.
            </p>
            <p>
              Wat maakt ons de beste <strong>DJ Veldhoven</strong>? Onze jarenlange ervaring, perfecte kennis
              van alle locaties in Veldhoven, en natuurlijk onze 100% dansgarantie. Als <strong>DJ Veldhoven</strong>
              zorgen wij ervoor dat jouw gasten de hele avond op de dansvloer staan!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Wij Dé DJ van Veldhoven Zijn"
            stats={[
              {
                label: 'Events als DJ Veldhoven',
                value: '100+',
                description: 'Bruiloften en feesten in Veldhoven verzorgd'
              },
              {
                label: 'Reviews DJ Veldhoven',
                value: '5.0★',
                description: 'Perfect gemiddelde op Google en social media'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug als DJ Veldhoven'
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
            DJ Veldhoven Voor Elk Type Event
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-semibold text-xl mb-3">Bruiloft DJ Veldhoven</h3>
              <p className="text-gray-600 mb-4">
                De beste bruiloft DJ van Veldhoven. Van ceremonie tot avondfeest, wij verzorgen jullie complete dag.
              </p>
              <Button variant="ghost" size="sm">Meer over bruiloften →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-semibold text-xl mb-3">Feest DJ Veldhoven</h3>
              <p className="text-gray-600 mb-4">
                DJ Veldhoven voor verjaardagen, jubilea en drive-in shows. 100% dansgarantie!
              </p>
              <Button variant="ghost" size="sm">Meer over feesten →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-semibold text-xl mb-3">Zakelijke DJ Veldhoven</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor bedrijfsfeesten en corporate events in Veldhoven.
              </p>
              <Button variant="ghost" size="sm">Meer over zakelijk →</Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Veelgestelde Vragen Over DJ Veldhoven
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een DJ in Veldhoven?
              </summary>
              <p className="mt-4 text-gray-600">
                Als DJ Veldhoven hanteren wij transparante prijzen vanaf €695 voor een basisfeest.
                Voor een bruiloft DJ Veldhoven starten we vanaf €895. Bekijk al onze pakketten of
                vraag een persoonlijke offerte aan.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Hoe ver van tevoren moet ik een DJ Veldhoven boeken?
              </summary>
              <p className="mt-4 text-gray-600">
                Voor bruiloften adviseren we als DJ Veldhoven minimaal 6-9 maanden van tevoren,
                vooral voor populaire datums. Voor andere feesten kan dit vaak korter.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke locaties in Veldhoven ken je als DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Als vaste DJ Veldhoven kennen we alle populaire trouw- en feestlocaties in Veldhoven
                en omgeving. We hebben ervaring met kastelen, horecagelegenheden, zalencentra en industriële
                locaties in heel Veldhoven.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu DJ Veldhoven
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan als DJ Veldhoven voor jouw event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50">
              Vraag DJ Veldhoven offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel DJ Veldhoven: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}