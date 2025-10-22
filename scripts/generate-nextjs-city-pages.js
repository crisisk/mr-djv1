#!/usr/bin/env node

/**
 * Generate Missing Next.js City Pages
 */

const fs = require('fs');
const path = require('path');

const missingCities = [
  { slug: 'beek', name: 'Beek', province: 'Limburg' },
  { slug: 'best', name: 'Best', province: 'Noord-Brabant' },
  { slug: 'boxtel', name: 'Boxtel', province: 'Noord-Brabant' },
  { slug: 'brunssum', name: 'Brunssum', province: 'Limburg' },
  { slug: 'dongen', name: 'Dongen', province: 'Noord-Brabant' },
  { slug: 'drunen', name: 'Drunen', province: 'Noord-Brabant' },
  { slug: 'echt-susteren', name: 'Echt-Susteren', province: 'Limburg' },
  { slug: 'eijsden', name: 'Eijsden', province: 'Limburg' },
  { slug: 'etten-leur', name: 'Etten-Leur', province: 'Noord-Brabant' },
  { slug: 'geldrop', name: 'Geldrop', province: 'Noord-Brabant' },
  { slug: 'gennep', name: 'Gennep', province: 'Limburg' },
  { slug: 'goirle', name: 'Goirle', province: 'Noord-Brabant' },
  { slug: 'haelen', name: 'Haelen', province: 'Limburg' },
  { slug: 'heerlen', name: 'Heerlen', province: 'Limburg' },
  { slug: 'heeze', name: 'Heeze', province: 'Noord-Brabant' },
  { slug: 'hoensbroek', name: 'Hoensbroek', province: 'Limburg' },
  { slug: 'horst', name: 'Horst', province: 'Limburg' },
  { slug: 'kaatsheuvel', name: 'Kaatsheuvel', province: 'Noord-Brabant' },
  { slug: 'kerkrade', name: 'Kerkrade', province: 'Limburg' },
  { slug: 'landgraaf', name: 'Landgraaf', province: 'Limburg' },
  { slug: 'made', name: 'Made', province: 'Noord-Brabant' },
  { slug: 'meerssen', name: 'Meerssen', province: 'Limburg' },
  { slug: 'nederweert', name: 'Nederweert', province: 'Limburg' },
  { slug: 'oosterhout', name: 'Oosterhout', province: 'Noord-Brabant' },
  { slug: 'panningen', name: 'Panningen', province: 'Limburg' },
  { slug: 'reuver', name: 'Reuver', province: 'Limburg' },
  { slug: 'rijen', name: 'Rijen', province: 'Noord-Brabant' },
  { slug: 'roermond', name: 'Roermond', province: 'Limburg' },
  { slug: 'rosmalen', name: 'Rosmalen', province: 'Noord-Brabant' },
  { slug: 's-hertogenbosch', name: "'s-Hertogenbosch", province: 'Noord-Brabant' },
  { slug: 'schijndel', name: 'Schijndel', province: 'Noord-Brabant' },
  { slug: 'simpelveld', name: 'Simpelveld', province: 'Limburg' },
  { slug: 'sittard-geleen', name: 'Sittard-Geleen', province: 'Limburg' },
  { slug: 'stein', name: 'Stein', province: 'Limburg' },
  { slug: 'tegelen', name: 'Tegelen', province: 'Limburg' },
  { slug: 'valkenburg', name: 'Valkenburg', province: 'Limburg' },
  { slug: 'valkenswaard', name: 'Valkenswaard', province: 'Noord-Brabant' },
  { slug: 'veenendaal', name: 'Veenendaal', province: 'Utrecht' },
  { slug: 'venray', name: 'Venray', province: 'Limburg' },
  { slug: 'weert', name: 'Weert', province: 'Limburg' },
];

const baseDir = '/srv/apps/mr-djv1/dynamic-api/app';

const generateCityPage = (city) => `'use client';

import React from 'react';
import HeroSection from '../../components/organisms/HeroSection';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function ${city.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <>
      <HeroSection
        eyebrow="DJ ${city.name}"
        title="DJ Huren in ${city.name}"
        subtitle="Professionele DJ service voor bruiloften, feesten en bedrijfsevents in ${city.name} en omgeving"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Vraag Offerte"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="/contact"
        backgroundClass="bg-brand-gradient"
        titleColor="text-white"
        subtitleColor="text-white/90"
        badges={['Lokale DJ', '15+ jaar ervaring', '${city.province}']}
        socialProof="⭐ 5.0 sterren • Specialist in ${city.name} en omgeving"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              DJ Service in ${city.name}
            </h2>
            <p className="text-lg text-gray-600">
              Als ervaren DJ in ${city.province} verzorgen wij professionele events in ${city.name} en omgeving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-semibold text-lg mb-2">Lokale Kennis</h3>
              <p className="text-gray-600 text-sm">
                Bekend met alle populaire locaties in ${city.name}.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Betrouwbaar</h3>
              <p className="text-gray-600 text-sm">
                15+ jaar ervaring in ${city.province}.
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
              DJ Services in ${city.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bruiloft DJ</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor jullie bruiloft in ${city.name}.
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
                Professionele DJ voor bedrijfsevents in ${city.name}.
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
              Pakketten voor ${city.name}
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
            Klaar voor een Onvergetelijk Feest in ${city.name}?
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
              onClick={() => window.open('https://wa.me/31620383638?text=Hallo%20Mister%20DJ%2C%20ik%20wil%20graag%20informatie%20over%20${encodeURIComponent(city.name)}', '_blank')}
            >
              💬 WhatsApp Contact
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
`;

let created = 0;
let skipped = 0;

console.log('🚀 Generating Next.js city pages...\n');

missingCities.forEach((city) => {
  const cityDir = path.join(baseDir, city.slug);
  const pageFile = path.join(cityDir, 'page.tsx');

  if (fs.existsSync(pageFile)) {
    console.log(`⏭️  ${city.name}`);
    skipped++;
    return;
  }

  fs.mkdirSync(cityDir, { recursive: true });
  fs.writeFileSync(pageFile, generateCityPage(city));
  console.log(`✅ ${city.name} (/${city.slug})`);
  created++;
});

console.log(`\n✅ Created: ${created} | ⏭️  Skipped: ${skipped} | Total: ${missingCities.length}`);
