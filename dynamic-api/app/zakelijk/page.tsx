'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function ZakelijkPage() {
  return (
    <>
      {/* Hero Section - Corporate focused */}
      <HeroSection
        eyebrow="Mister DJ Zakelijk"
        title="Dé professionele Brabantse gangmaker op jouw zakelijke feest"
        subtitle="Ben je voor je bedrijf op zoek naar een DJ die op een professionele manier jullie feest of evenement van een feestelijke muzikale aankleding voorziet? Dan ben je bij Mister DJ aan het juiste adres."
        ctaPrimaryText="Vraag Offerte Op Maat"
        ctaSecondaryText="Bekijk Referenties"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="#testimonials"
        backgroundClass="bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['Meer dan 15 jaar ervaring', '2500+ geslaagde feesten', 'Complete drive in show']}
        socialProof="💼 Professioneel tot in de puntjes"
      />

      {/* Service Types - Corporate specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mister DJ is er voor alle zakelijke feesten
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Voor ons ervaren DJ team is niets te gek. Wij kunnen zakelijke feesten en evenementen van 50 tot wel 500 personen van een passende en sfeervolle muzikale aankleding voorzien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Team Building */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="font-display text-xl font-semibold mb-3">Team Building</h3>
              <p className="text-gray-600 mb-4">
                Muziek en entertainment die teams samenbrengt. Van actieve teamdagen tot gezellige borrels.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Interactieve DJ sets</li>
                <li>✓ Teamspellen met muziek</li>
                <li>✓ Flexibele opstellingen</li>
              </ul>
            </Card>

            {/* Personeelsfeest */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-3">Personeelsfeest</h3>
              <p className="text-gray-600 mb-4">
                Van zomerbarbecue tot kerstdiner - wij zorgen voor de perfecte muzikale ondersteuning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Diverse muziekstijlen</li>
                <li>✓ Professionele presentatie</li>
                <li>✓ Complete sound & light</li>
              </ul>
            </Card>

            {/* Nieuwjaarsreceptie */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🥂</div>
              <h3 className="font-display text-xl font-semibold mb-3">Nieuwjaarsreceptie</h3>
              <p className="text-gray-600 mb-4">
                Stijlvolle achtergrondmuziek en entertainment voor jouw nieuwjaarsborrel of receptie.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Klassevol en discreet</li>
                <li>✓ Aanpasbaar volume</li>
                <li>✓ Live saxofonist optie</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats - Corporate specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Bedrijven Voor Ons Kiezen"
            stats={[
              {
                label: 'Corporate Events',
                value: '500+',
                description: 'Van start-ups tot Fortune 500 bedrijven in heel Nederland'
              },
              {
                label: 'Tevreden Bedrijven',
                value: '200+',
                description: 'Vaste klanten die jaar na jaar voor ons kiezen'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect gemiddelde van corporate klanten'
              },
              {
                label: 'Professionele Service',
                value: '100%',
                description: 'Altijd op tijd, perfect verzorgd en volgens afspraak'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Mister DJ Voor Zakelijke Events?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-xl mb-3">Professionele Uitstraling</h3>
              <p className="text-gray-600">
                Nette kleding, verzorgde presentatie en professionele communicatie. We passen ons aan jouw bedrijfscultuur en dresscode.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-xl mb-3">Complete Ontzorging</h3>
              <p className="text-gray-600">
                Van technische rider tot timeline - wij regelen alles. Jij hoeft je alleen maar te verheugen op een geslaagd event.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="font-semibold text-xl mb-3">Muziek Op Maat</h3>
              <p className="text-gray-600">
                We stemmen de muziek af op jouw doelgroep - van lounge classics tot moderne hits. Altijd het juiste volume en sfeer.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-xl mb-3">Vaste Contactpersoon</h3>
              <p className="text-gray-600">
                Direct contact met je DJ, geen tussenpersonen. Snelle communicatie en duidelijke afspraken van begin tot eind.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery - Corporate event photos */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sfeerbeelden Van Zakelijke Events
            </h2>
            <p className="text-lg text-gray-600">
              Impressies van bedrijfsfeesten en corporate events die wij hebben verzorgd
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18].map((num) => (
              <div key={num} className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={`/media/optimized/webp/gallery/feest-${String(num).padStart(3, '0')}.webp`}
                  alt={`Corporate Event ${num}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Bekijk foto</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => window.location.href = '/galerij?filter=zakelijk'}>
              Bekijk alle corporate foto&apos;s
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Corporate specific */}
      <section id="testimonials" className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wat Bedrijven Zeggen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "Perfect verzorgd personeelsfeest! De DJ was professioneel, flexibel en zorgde voor een geweldige sfeer. Al onze medewerkers hebben enorm genoten.",
                author: "Mark van der Berg",
                role: "HR Manager, TechCorp BV",
                company: "150 medewerkers"
              },
              {
                quote: "Voor onze nieuwjaarsreceptie was Mister DJ de perfecte keuze. Stijlvolle muziek, discrete opstelling en zeer professioneel. Zeker een aanrader!",
                author: "Linda Vermeulen",
                role: "Event Manager, Innovate Solutions",
                company: "Nieuwjaarsreceptie 2024"
              },
              {
                quote: "Al 3 jaar op rij verzorgt Mister DJ ons zomerfeest. Altijd top geregeld, goede communicatie en de medewerkers vinden het fantastisch!",
                author: "Robert Jansen",
                role: "CEO, BuildRight BV",
                company: "300 medewerkers"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-spacing-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Corporate Services
            </h2>
            <p className="text-lg text-gray-600">
              Professionele DJ entertainment voor elk zakelijk event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Bedrijfsfeesten', desc: 'Zomer- en kerstfeesten, jubilea' },
              { title: 'Teambuilding Events', desc: 'Actieve teamdagen met muziek' },
              { title: 'Nieuwjaarsrecepties', desc: 'Stijlvolle achtergrondmuziek' },
              { title: 'Personeelsborrels', desc: 'Informele drinks met DJ' },
              { title: 'Product Launches', desc: 'Entertainment bij presentaties' },
              { title: 'Beurzen & Events', desc: 'Sfeerverhogende DJ sets' }
            ].map((service, idx) => (
              <Card key={idx} className="p-spacing-lg text-center">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Corporate specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde Vragen Over Zakelijke Events
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Kunnen jullie een offerte op maat maken?',
                answer: 'Ja, absoluut! Elk bedrijfsfeest is anders. We bespreken graag jullie wensen, budget en doelgroep om een passende offerte te maken. Neem vrijblijvend contact op voor een gesprek.'
              },
              {
                question: 'Hebben jullie ervaring met grote corporate events?',
                answer: 'Ja, we hebben events verzorgd van 50 tot 1000+ gasten. We hebben de juiste apparatuur en ervaring voor zowel intieme borrels als grote personeelsfeesten.'
              },
              {
                question: 'Kunnen jullie een technische rider leveren?',
                answer: 'Ja, we kunnen een volledige technische rider leveren met alle specificaties van onze apparatuur, stroombehoefte en opbouwruimte. Handig voor overleg met de locatie.'
              },
              {
                question: 'Werken jullie samen met event bureaus?',
                answer: 'Ja, we werken regelmatig samen met event bureaus en hebben ervaring met grotere producties. We stemmen alles goed af met andere leveranciers.'
              },
              {
                question: 'Kunnen jullie ook achtergrondmuziek tijdens het diner verzorgen?',
                answer: 'Zeker! We kunnen de hele dag/avond verzorgen - van achtergrondmuziek tijdens borrel en diner tot een feestelijke dansavond. Alles is mogelijk.'
              },
              {
                question: 'Wat zijn de kosten voor een corporate DJ?',
                answer: 'Dit hangt af van de duur, locatie en specifieke wensen. Onze corporate pakketten starten vanaf €895. Vraag een offerte aan voor een prijsopgave op maat.'
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
              Meer vragen →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-blue-600 via-slate-600 to-gray-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar Voor Een Professioneel Bedrijfsfeest?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan en bespreek de mogelijkheden
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Vraag zakelijke offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/contact'}
            >
              Plan kennismakingsgesprek
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-90">
            ⚡ We reageren binnen 24 uur • 📧 Ook per e-mail te bereiken
          </p>
        </div>
      </section>
    </>
  );
}
