#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.join(__dirname, '..', 'app');

// Major Dutch cities (focus on Brabant + major cities)
const cities = [
  // Brabant (primary)
  { name: 'Eindhoven', slug: 'eindhoven', region: 'Noord-Brabant' },
  { name: 'Tilburg', slug: 'tilburg', region: 'Noord-Brabant' },
  { name: 'Den Bosch', slug: 'den-bosch', region: 'Noord-Brabant' },
  { name: 'Breda', slug: 'breda', region: 'Noord-Brabant' },
  { name: 'Helmond', slug: 'helmond', region: 'Noord-Brabant' },
  { name: 'Oss', slug: 'oss', region: 'Noord-Brabant' },
  { name: 'Veldhoven', slug: 'veldhoven', region: 'Noord-Brabant' },
  { name: 'Roosendaal', slug: 'roosendaal', region: 'Noord-Brabant' },
  { name: 'Bergen op Zoom', slug: 'bergen-op-zoom', region: 'Noord-Brabant' },
  { name: 'Veghel', slug: 'veghel', region: 'Noord-Brabant' },
  { name: 'Waalwijk', slug: 'waalwijk', region: 'Noord-Brabant' },
  { name: 'Uden', slug: 'uden', region: 'Noord-Brabant' },

  // Other major cities
  { name: 'Amsterdam', slug: 'amsterdam', region: 'Noord-Holland' },
  { name: 'Rotterdam', slug: 'rotterdam', region: 'Zuid-Holland' },
  { name: 'Utrecht', slug: 'utrecht', region: 'Utrecht' },
  { name: 'Den Haag', slug: 'den-haag', region: 'Zuid-Holland' },
  { name: 'Arnhem', slug: 'arnhem', region: 'Gelderland' },
  { name: 'Nijmegen', slug: 'nijmegen', region: 'Gelderland' },
  { name: 'Maastricht', slug: 'maastricht', region: 'Limburg' },
  { name: 'Venlo', slug: 'venlo', region: 'Limburg' },
];

// Legal pages
const legalPages = [
  {
    slug: 'algemene-voorwaarden',
    title: 'Algemene Voorwaarden',
    description: 'De algemene voorwaarden van Mister DJ voor het huren van een DJ voor uw bruiloft, feest of bedrijfsevenement.'
  },
  {
    slug: 'privacyverklaring',
    title: 'Privacyverklaring',
    description: 'Privacyverklaring van Mister DJ. Lees hoe wij omgaan met uw persoonlijke gegevens.'
  },
  {
    slug: 'cookiebeleid',
    title: 'Cookiebeleid',
    description: 'Cookiebeleid van Mister DJ. Lees welke cookies wij gebruiken en waarom.'
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    description: 'Disclaimer van Mister DJ over aansprakelijkheid en gebruik van de website.'
  }
];

// Create legal pages
function createLegalPages() {
  console.log('\n📄 Creating legal pages...');

  legalPages.forEach(page => {
    const dir = path.join(appDir, page.slug);
    const filePath = path.join(dir, 'page.tsx');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = generateLegalPageContent(page);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${page.slug}/page.tsx`);
  });
}

// Create city-specific pages
function createCityPages() {
  console.log('\n🏙️  Creating city-specific pages...');

  cities.forEach(city => {
    const dir = path.join(appDir, city.slug);
    const filePath = path.join(dir, 'page.tsx');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = generateCityPageContent(city);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${city.slug}/page.tsx`);
  });
}

// Create dj-city combination pages
function createDjCityPages() {
  console.log('\n🎵 Creating dj-city combination pages...');

  cities.forEach(city => {
    const dir = path.join(appDir, `dj-${city.slug}`);
    const filePath = path.join(dir, 'page.tsx');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = generateDjCityPageContent(city);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: dj-${city.slug}/page.tsx`);
  });
}

// Create sax-city landing pages
function createSaxCityPages() {
  console.log('\n🎷 Creating sax-city landing pages...');

  cities.forEach(city => {
    const dir = path.join(appDir, `saxofonist-${city.slug}`);
    const filePath = path.join(dir, 'page.tsx');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = generateSaxCityPageContent(city);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: saxofonist-${city.slug}/page.tsx`);
  });
}

function generateLegalPageContent(page) {
  return `'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ${toPascalCase(page.slug)}Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-spacing-2xl px-spacing-xl bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm mb-4 inline-block">
            ← Terug naar home
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            ${page.title}
          </h1>
          <p className="text-lg text-gray-600">
            ${page.description}
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
            ${generateLegalContent(page.slug)}
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
}`;
}

function generateCityPageContent(city) {
  return `'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function ${toPascalCase(city.slug)}Page() {
  return (
    <>
      {/* Hero Section - City specific */}
      <HeroSection
        eyebrow="DJ ${city.name}"
        title="DJ Huren in ${city.name}"
        subtitle="Professionele DJ service voor bruiloften, feesten en bedrijfsevents in ${city.name} en omgeving"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Vraag Offerte"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="#contact"
        backgroundClass="bg-brand-gradient"
        titleColor="text-white"
        subtitleColor="text-white/90"
        badges={['Lokale DJ', '15+ jaar in ${city.region}', '100+ events in ${city.name}']}
        socialProof="⭐ 5.0 sterren • Specialist in ${city.name} en omgeving"
      />

      {/* Local expertise */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen Voor Een Lokale DJ in ${city.name}?
            </h2>
            <p className="text-lg text-gray-600">
              Als vaste DJ in ${city.name} kennen wij alle mooie locaties, werken we samen met de beste
              leveranciers en weten we wat er leeft in de ${city.name}se party scene.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-semibold text-lg mb-2">Lokale Kennis</h3>
              <p className="text-gray-600 text-sm">
                We kennen alle populaire locaties in ${city.name} en weten precies wat er nodig is.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Lokaal Netwerk</h3>
              <p className="text-gray-600 text-sm">
                Samenwerking met fotografen, cateraars en andere leveranciers uit ${city.name}.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="font-semibold text-lg mb-2">Geen Reiskosten</h3>
              <p className="text-gray-600 text-sm">
                Als lokale DJ in ${city.name} rekenen we geen extra reiskosten voor events in de stad.
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
              DJ Services in ${city.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bruiloft DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor jullie bruiloft in ${city.name}. Van ceremonie tot avondfeest.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/bruiloft'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-3">Feest DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                Van verjaardagsfeest tot jubileum - wij zorgen voor een volle dansvloer in ${city.name}.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/feesten'}>
                Meer info →
              </Button>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-display text-xl font-semibold mb-3">Bedrijfsfeest DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ service voor zakelijke events en bedrijfsfeesten in ${city.name}.
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
            title="Onze Ervaring in ${city.name}"
            stats={[
              {
                label: 'Events in ${city.name}',
                value: '100+',
                description: 'Bruiloften, feesten en zakelijke events in ${city.name} verzorgd'
              },
              {
                label: 'Lokale Klanten',
                value: '50+',
                description: 'Tevreden klanten in ${city.name} en directe omgeving'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect gemiddelde van ${city.name}se klanten'
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
            Populaire Locaties in ${city.name}
          </h2>
          <Card className="p-spacing-xl">
            <p className="text-gray-600 mb-4">
              We hebben ervaring met DJ sets op de volgende locaties in en rond ${city.name}:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-2">Trouwlocaties ${city.name}:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Diverse kastelen en landgoederen</li>
                  <li>• Horecagelegenheden in centrum</li>
                  <li>• Unieke industriële locaties</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Feestlocaties ${city.name}:</p>
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
            DJ Nodig in ${city.name}?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan voor jouw event in ${city.name}
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
}`;
}

function generateDjCityPageContent(city) {
  return `'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function Dj${toPascalCase(city.slug)}Page() {
  return (
    <>
      <HeroSection
        eyebrow="Bruiloft & Feest DJ"
        title="DJ ${city.name} | DJ Huren ${city.name}"
        subtitle="Professionele DJ ${city.name} voor bruiloften, feesten en events. Boek nu de beste DJ van ${city.name}!"
        ctaPrimaryText="Bekijk Beschikbaarheid"
        ctaSecondaryText="Bel Direct"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="tel:0408422594"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['DJ ${city.name}', 'Lokale Specialist', '100+ Events']}
        socialProof="⭐ 5.0 sterren • Meest geboekte DJ in ${city.name}"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            DJ ${city.name}: De #1 Keuze Voor Jouw Event
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Ben je op zoek naar een <strong>DJ in ${city.name}</strong>? Dan ben je bij ons aan het juiste adres!
              Als meest ervaren <strong>DJ ${city.name}</strong> hebben wij al meer dan 100 bruiloften, feesten
              en bedrijfsevents in ${city.name} verzorgd.
            </p>
            <p>
              Wat maakt ons de beste <strong>DJ ${city.name}</strong>? Onze jarenlange ervaring, perfecte kennis
              van alle locaties in ${city.name}, en natuurlijk onze 100% dansgarantie. Als <strong>DJ ${city.name}</strong>
              zorgen wij ervoor dat jouw gasten de hele avond op de dansvloer staan!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Wij Dé DJ van ${city.name} Zijn"
            stats={[
              {
                label: 'Events als DJ ${city.name}',
                value: '100+',
                description: 'Bruiloften en feesten in ${city.name} verzorgd'
              },
              {
                label: 'Reviews DJ ${city.name}',
                value: '5.0★',
                description: 'Perfect gemiddelde op Google en social media'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug als DJ ${city.name}'
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
            DJ ${city.name} Voor Elk Type Event
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💍</div>
              <h3 className="font-semibold text-xl mb-3">Bruiloft DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                De beste bruiloft DJ van ${city.name}. Van ceremonie tot avondfeest, wij verzorgen jullie complete dag.
              </p>
              <Button variant="ghost" size="sm">Meer over bruiloften →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-semibold text-xl mb-3">Feest DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                DJ ${city.name} voor verjaardagen, jubilea en drive-in shows. 100% dansgarantie!
              </p>
              <Button variant="ghost" size="sm">Meer over feesten →</Button>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-semibold text-xl mb-3">Zakelijke DJ ${city.name}</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ voor bedrijfsfeesten en corporate events in ${city.name}.
              </p>
              <Button variant="ghost" size="sm">Meer over zakelijk →</Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Veelgestelde Vragen Over DJ ${city.name}
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een DJ in ${city.name}?
              </summary>
              <p className="mt-4 text-gray-600">
                Als DJ ${city.name} hanteren wij transparante prijzen vanaf €695 voor een basisfeest.
                Voor een bruiloft DJ ${city.name} starten we vanaf €895. Bekijk al onze pakketten of
                vraag een persoonlijke offerte aan.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Hoe ver van tevoren moet ik een DJ ${city.name} boeken?
              </summary>
              <p className="mt-4 text-gray-600">
                Voor bruiloften adviseren we als DJ ${city.name} minimaal 6-9 maanden van tevoren,
                vooral voor populaire datums. Voor andere feesten kan dit vaak korter.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke locaties in ${city.name} ken je als DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Als vaste DJ ${city.name} kennen we alle populaire trouw- en feestlocaties in ${city.name}
                en omgeving. We hebben ervaring met kastelen, horecagelegenheden, zalencentra en industriële
                locaties in heel ${city.name}.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu DJ ${city.name}
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan als DJ ${city.name} voor jouw event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50">
              Vraag DJ ${city.name} offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel DJ ${city.name}: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}`;
}

function generateSaxCityPageContent(city) {
  return `'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function Saxofonist${toPascalCase(city.slug)}Page() {
  return (
    <>
      <HeroSection
        eyebrow="Live Saxofonist"
        title="Saxofonist ${city.name} | DJ met Saxofonist"
        subtitle="Boek een live saxofonist in ${city.name}! Unieke combinatie van DJ + saxofonist voor jouw bruiloft of feest"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Luister Samples"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="#samples"
        backgroundClass="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['Live Sax ${city.name}', 'DJ + Sax Combo', '50+ Shows']}
        socialProof="🎷 De beste saxofonist van ${city.name}"
      />

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
            Waarom Een Saxofonist in ${city.name}?
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Op zoek naar een <strong>saxofonist in ${city.name}</strong>? Een live saxofonist maakt
              je bruiloft of feest in ${city.name} extra bijzonder! De combinatie van een <strong>DJ met
              saxofonist ${city.name}</strong> zorgt voor een unieke sfeer die je gasten niet snel vergeten.
            </p>
            <p>
              Onze <strong>saxofonist ${city.name}</strong> speelt live mee met de beste house, deep house
              en party classics. Perfect voor bruiloften, bedrijfsfeesten en jubilea in ${city.name} en omgeving!
            </p>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-12 text-center">
            Wat Maakt Onze Saxofonist ${city.name} Uniek?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎷</div>
              <h3 className="font-semibold text-lg mb-2">Live Performance</h3>
              <p className="text-gray-600 text-sm">
                Professionele saxofonist ${city.name} speelt live tijdens de grootste hits
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="font-semibold text-lg mb-2">DJ + Sax Combo</h3>
              <p className="text-gray-600 text-sm">
                Perfecte samenspel tussen DJ en saxofonist ${city.name}
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="font-semibold text-lg mb-2">Premium Ervaring</h3>
              <p className="text-gray-600 text-sm">
                Maak je event in ${city.name} onvergetelijk met live saxofoon
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="font-semibold text-lg mb-2">Visueel Spektakel</h3>
              <p className="text-gray-600 text-sm">
                Saxofonist ${city.name} met professionele lichtshow en sfeer
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <StatHighlights
            title="Ervaring als Saxofonist ${city.name}"
            stats={[
              {
                label: 'Shows in ${city.name}',
                value: '50+',
                description: 'DJ + Sax shows als saxofonist ${city.name} verzorgd'
              },
              {
                label: 'Tevreden Klanten',
                value: '100%',
                description: 'Alle klanten bevelen onze saxofonist ${city.name} aan'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect beoordeeld als saxofonist ${city.name}'
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
            Saxofonist ${city.name} in Actie
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-spacing-lg">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">🎥 Video showreel saxofonist ${city.name}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Bruiloft ${city.name} 2024</h3>
              <p className="text-gray-600 text-sm">
                Fragment van onze saxofonist tijdens een bruiloft in ${city.name}
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">🎥 Video DJ + Sax ${city.name}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Bedrijfsfeest ${city.name}</h3>
              <p className="text-gray-600 text-sm">
                DJ + Saxofonist ${city.name} tijdens corporate event
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
            Pakketten DJ + Saxofonist ${city.name}
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
                  <span className="text-gray-700">Live saxofonist ${city.name} (2 uur)</span>
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
                  <span className="text-gray-700">Live saxofonist ${city.name} (4 uur)</span>
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
            Veelgestelde Vragen Saxofonist ${city.name}
          </h2>

          <div className="space-y-4">
            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Wat kost een saxofonist in ${city.name}?
              </summary>
              <p className="mt-4 text-gray-600">
                Een saxofonist ${city.name} in combinatie met DJ kost vanaf €1.345 voor 2 uur live sax.
                Voor het hele feest (4 uur sax) betaal je €1.795. Alle apparatuur en transport is inbegrepen.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Welke muziek speelt de saxofonist ${city.name}?
              </summary>
              <p className="mt-4 text-gray-600">
                Onze saxofonist ${city.name} speelt live mee met house, deep house, lounge, jazz en party classics.
                We stemmen het repertoire af op jouw wensen en gasten.
              </p>
            </details>

            <details className="group bg-white border border-gray-200 rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">
                Is de saxofonist ${city.name} ook beschikbaar zonder DJ?
              </summary>
              <p className="mt-4 text-gray-600">
                Ja! Onze saxofonist ${city.name} kan ook solo optreden tijdens borrels, diners of ceremonies.
                Vraag een persoonlijke offerte aan voor de mogelijkheden.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Boek Nu Saxofonist ${city.name}
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Maak je event in ${city.name} onvergetelijk met een live saxofonist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50">
              Vraag saxofonist ${city.name} offerte
            </Button>
            <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white/10">
              Bel: 040-8422594
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}`;
}

function generateLegalContent(slug) {
  // Placeholder content for legal pages
  const content = {
    'algemene-voorwaarden': `
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
    `,
    'privacyverklaring': `
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
    `,
    'cookiebeleid': `
      <h2>1. Wat zijn cookies?</h2>
      <p>Cookies zijn kleine tekstbestanden die op uw computer of mobiel apparaat worden geplaatst wanneer u onze website bezoekt.</p>

      <h2>2. Welke cookies gebruiken wij?</h2>
      <ul>
        <li><strong>Functionele cookies:</strong> Voor de werking van de website (altijd actief)</li>
        <li><strong>Analytische cookies:</strong> Google Analytics voor websitestatistieken (met toestemming)</li>
        <li><strong>Marketing cookies:</strong> Voor gepersonaliseerde advertenties (met toestemming)</li>
      </ul>

      <h2>3. Cookies van derden</h2>
      <p>Wij gebruiken Google Analytics voor statistieken. Google kan deze informatie aan derden verschaffen indien Google hiertoe wettelijk wordt verplicht.</p>

      <h2>4. Cookies beheren</h2>
      <p>U kunt cookies uitschakelen via uw browserinstellingen. Let op: sommige functionaliteiten van de website werken mogelijk niet optimaal zonder cookies.</p>

      <h2>5. Toestemming intrekken</h2>
      <p>U kunt uw toestemming voor cookies op elk moment intrekken via de cookie-instellingen op onze website.</p>
    `,
    'disclaimer': `
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
    `
  };

  return content[slug] || '<p>Content voor deze pagina wordt binnenkort toegevoegd.</p>';
}

function toPascalCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// Main execution
console.log('🚀 Starting page generation...\n');
console.log(`Total pages to generate: ${legalPages.length + (cities.length * 3)}`);
console.log(`- Legal pages: ${legalPages.length}`);
console.log(`- City pages: ${cities.length}`);
console.log(`- DJ-city pages: ${cities.length}`);
console.log(`- Sax-city pages: ${cities.length}`);
console.log(`\n${'='.repeat(50)}\n`);

createLegalPages();
createCityPages();
createDjCityPages();
createSaxCityPages();

console.log(`\n${'='.repeat(50)}`);
console.log('\n✅ All pages generated successfully!');
console.log(`\nTotal pages created: ${legalPages.length + (cities.length * 3)}`);
console.log('\nNext steps:');
console.log('1. Review generated pages in app/ directory');
console.log('2. Run: npm run build');
console.log('3. Deploy to production\n');
