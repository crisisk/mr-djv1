'use client';

import React from 'react';
import HeroSection from '../../components/organisms/HeroSection';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function PakkettenPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        eyebrow="Pakketten & Prijzen"
        title="Transparante Prijzen Voor Elk Budget"
        subtitle="Van basis DJ pakket tot complete all-in ervaring - altijd zonder verborgen kosten"
        ctaPrimaryText="Vraag Offerte Aan"
        ctaSecondaryText="Vergelijk Pakketten"
        ctaPrimaryHref="/contact"
        ctaSecondaryHref="#pricing"
        backgroundClass="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['Vanaf €695', 'All-in opties', 'Geen verborgen kosten']}
        socialProof="💰 Transparante prijzen sinds 2008"
      />

      {/* Pricing Tables */}
      <section id="pricing">
        <PricingTables />
      </section>

      {/* Detailed Comparison */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gedetailleerde Pakket Vergelijking
            </h2>
            <p className="text-lg text-gray-600">
              Zie precies wat elk pakket bevat
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Functie</th>
                  <th className="border border-gray-200 px-6 py-4 text-center font-semibold">Basis</th>
                  <th className="border border-gray-200 px-6 py-4 text-center font-semibold">Standaard</th>
                  <th className="border border-gray-200 px-6 py-4 text-center font-semibold bg-brand-50">Premium</th>
                  <th className="border border-gray-200 px-6 py-4 text-center font-semibold">All-In</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Professionele DJ', basis: '✓', standard: '✓', premium: '✓', allin: '✓' },
                  { feature: 'Geluidsinstallatie', basis: 'Basic', standard: 'Pro', premium: 'Premium', allin: 'Premium+' },
                  { feature: 'Lichtshow basis', basis: '✓', standard: '✓', premium: '✓', allin: '✓' },
                  { feature: 'Moving heads', basis: '—', standard: '2x', premium: '4x', allin: '6x' },
                  { feature: 'Lasershow', basis: '—', standard: '—', premium: '✓', allin: '✓' },
                  { feature: 'Rookmachine', basis: '—', standard: '✓', premium: '✓', allin: '✓' },
                  { feature: 'Draadloze microfoons', basis: '1x', standard: '2x', premium: '2x', allin: '3x' },
                  { feature: 'Photobooth', basis: '—', standard: '—', premium: '2 uur', allin: 'Onbeperkt' },
                  { feature: 'Live saxofonist', basis: '—', standard: '—', premium: '—', allin: '✓ (1 uur)' },
                  { feature: 'Voor- en nabespreking', basis: 'Telefoon', standard: 'Telefoon', premium: 'Persoonlijk', allin: 'Persoonlijk' },
                  { feature: 'Spotify playlist service', basis: '✓', standard: '✓', premium: '✓', allin: '✓' },
                  { feature: 'Opbouw & transport', basis: '✓', standard: '✓', premium: '✓', allin: '✓' },
                  { feature: '100% Dansgarantie', basis: '✓', standard: '✓', premium: '✓', allin: '✓' }
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-6 py-4 font-medium">{row.feature}</td>
                    <td className="border border-gray-200 px-6 py-4 text-center">{row.basis}</td>
                    <td className="border border-gray-200 px-6 py-4 text-center">{row.standard}</td>
                    <td className="border border-gray-200 px-6 py-4 text-center bg-brand-50">{row.premium}</td>
                    <td className="border border-gray-200 px-6 py-4 text-center">{row.allin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons Pricing */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Extra Opties & Add-ons
            </h2>
            <p className="text-lg text-gray-600">
              Maak je pakket compleet met deze extra&apos;s
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: '🎷',
                title: 'Live Saxofonist',
                price: 'vanaf €350',
                description: '1 uur live saxofoon performance tijdens je feest',
                features: ['Professionele muzikant', 'Eigen repertoire', 'Mix met DJ mogelijk']
              },
              {
                icon: '📸',
                title: 'Photobooth',
                price: 'vanaf €295',
                description: '2-4 uur onbeperkt foto\'s maken met props',
                features: ['Instant prints', 'Digital copies', 'Props pakket']
              },
              {
                icon: '💡',
                title: 'Extra Verlichting',
                price: 'vanaf €150',
                description: 'Upgrade je lichtshow met extra moving heads',
                features: ['2x Moving heads', 'Extra effecten', 'Aangepaste kleuren']
              },
              {
                icon: '🎤',
                title: 'Extra Microfoons',
                price: 'vanaf €50',
                description: 'Extra draadloze microfoons voor speeches',
                features: ['Per stuk', 'Professioneel', 'Plug & play']
              },
              {
                icon: '⏰',
                title: 'Extra Uren',
                price: '€125/uur',
                description: 'Verleng je feest met extra DJ uren',
                features: ['Per uur', 'Flexibel in te zetten', 'Zelfde kwaliteit']
              },
              {
                icon: '🎵',
                title: 'Ceremonie Muziek',
                price: 'vanaf €250',
                description: 'Muzikale begeleiding tijdens de ceremonie',
                features: ['Discrete opstelling', '2x Microfoon', 'Op maat muziek']
              }
            ].map((addon, idx) => (
              <Card key={idx} className="p-spacing-lg">
                <div className="text-5xl mb-4">{addon.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{addon.title}</h3>
                <div className="text-2xl font-bold text-brand-600 mb-3">{addon.price}</div>
                <p className="text-gray-600 mb-4">{addon.description}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {addon.features.map((feature, fidx) => (
                    <li key={fidx}>✓ {feature}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Altijd Inbegrepen
            </h2>
            <p className="text-lg text-gray-600">
              Dit krijg je bij elk pakket, zonder extra kosten
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🚗', title: 'Transport & Opbouw', desc: 'Binnen 50km van Eindhoven altijd gratis' },
              { icon: '🎧', title: 'Professionele DJ', desc: 'Ervaren DJ die je publiek perfect kan lezen' },
              { icon: '⚡', title: 'Backup Apparatuur', desc: 'Dubbele systemen voor 100% betrouwbaarheid' },
              { icon: '📞', title: 'Persoonlijk Contact', desc: 'Direct contact met je DJ, geen tussenpersonen' },
              { icon: '🎵', title: 'Spotify Playlist Service', desc: 'Deel je favoriete nummers vooraf' },
              { icon: '💰', title: 'Geen Verborgen Kosten', desc: 'Transparante prijs, alles inclusief' }
            ].map((item, idx) => (
              <Card key={idx} className="p-spacing-lg flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ About Pricing */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde Vragen Over Prijzen
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Zijn de prijzen all-in of komen er extra kosten bij?',
                answer: 'Onze prijzen zijn inclusief DJ, apparatuur, opbouw, transport (binnen 50km) en BTW. Alleen voor extra opties (zoals photobooth of live saxofonist) berekenen we meerkosten, maar die worden altijd vooraf duidelijk gecommuniceerd.'
              },
              {
                question: 'Kan ik een offerte op maat krijgen?',
                answer: 'Ja, absoluut! De pakketten zijn een indicatie. We maken graag een offerte op maat gebaseerd op jouw specifieke wensen, locatie en budget. Neem contact op voor een persoonlijk voorstel.'
              },
              {
                question: 'Welk pakket past bij mij?',
                answer: 'Voor een basis feest (verjaardagen, kleine events) is het Basis pakket vaak voldoende. Voor bruiloften adviseren we minimaal Standaard. Wil je echt uitpakken? Kies dan Premium of All-In. Twijfel je? Bel ons voor advies!'
              },
              {
                question: 'Hoe werkt de betaling?',
                answer: 'Na akkoord op de offerte vragen we een aanbetaling van 30% om de datum te reserveren. De restbetaling volgt uiterlijk 2 weken voor het event. Betalen kan via ideal, bankoverschrijving of contant.'
              },
              {
                question: 'Wat als ik moet annuleren?',
                answer: 'Tot 3 maanden voor het event kun je kosteloos annuleren. Tussen 3 maanden en 1 maand voor het event berekenen we 50%. Bij annulering binnen 1 maand is het volledige bedrag verschuldigd. We adviseren altijd een annuleringsverzekering.'
              },
              {
                question: 'Zijn er kortingen mogelijk?',
                answer: 'Voor doordeweekse data (maandag t/m donderdag) geven we vaak 10-15% korting. Ook hebben we regelmatig seizoensacties. Vraag naar de actuele mogelijkheden bij je offerte aanvraag!'
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <summary className="cursor-pointer list-none flex justify-between items-center font-semibold text-lg">
                  <span>{faq.question}</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="ghost" size="lg" onClick={() => window.location.href = '/faq'}>
              Alle vragen →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Weet Je Al Welk Pakket Je Wilt?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag direct een offerte aan of plan een gesprek voor persoonlijk advies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Vraag offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/contact'}
            >
              Plan adviesgesprek
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-90">
            ⚡ Offerte binnen 24 uur • 💬 Vrijblijvend advies
          </p>
        </div>
      </section>
    </>
  );
}
