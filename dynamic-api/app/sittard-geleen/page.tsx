'use client';

import React from 'react';
import HeroSection from '../../components/organisms/HeroSection';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function SittardGeleenPage() {
  return (
    <>
      <HeroSection
        eyebrow="DJ Sittard-Geleen"
        title="DJ Huren in Sittard-Geleen"
        subtitle="Professionele DJ service voor bruiloften, feesten en bedrijfsevents in Sittard-Geleen en omgeving"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Vraag Offerte"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="/contact"
        backgroundClass="bg-brand-gradient"
        titleColor="text-white"
        subtitleColor="text-white/90"
        badges={['Lokale DJ', '15+ jaar ervaring', 'Limburg']}
        socialProof="⭐ 5.0 sterren • Specialist in Sittard-Geleen en omgeving"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              DJ Service in Sittard-Geleen
            </h2>
            <p className="text-lg text-gray-600">
              Als ervaren DJ in Limburg verzorgen wij professionele events in Sittard-Geleen en omgeving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-semibold text-lg mb-2">Lokale Kennis</h3>
              <p className="text-gray-600 text-sm">
                Bekend met alle populaire locaties in Sittard-Geleen.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Betrouwbaar</h3>
              <p className="text-gray-600 text-sm">
                15+ jaar ervaring in Limburg.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="font-semibold text-lg mb-2">Geen Verrassingen</h3>
              <p className="text-gray-600 text-sm">
                Transparante prijzen inclusief reiskosten.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              DJ Services in Sittard-Geleen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bruiloft DJ</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor jullie bruiloft in Sittard-Geleen.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/bruiloft'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-3">Feest DJ</h3>
              <p className="text-gray-600 mb-4">
                Van verjaardagsfeest tot jubileum - wij zorgen voor een volle dansvloer.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/feesten'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bedrijfsfeest DJ</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor bedrijfsevents in Sittard-Geleen.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/zakelijk'}>
                Meer info →
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pakketten voor Sittard-Geleen
            </h2>
            <p className="text-lg text-gray-600">
              Transparante all-in prijzen inclusief reiskosten
            </p>
          </div>
          <PricingTables />
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar voor een Onvergetelijk Feest in Sittard-Geleen?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag direct een vrijblijvende offerte aan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Vraag Offerte
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://wa.me/31620383638?text=Hallo%20Mister%20DJ%2C%20ik%20wil%20graag%20informatie%20over%20Sittard-Geleen', '_blank')}
            >
              💬 WhatsApp Contact
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
