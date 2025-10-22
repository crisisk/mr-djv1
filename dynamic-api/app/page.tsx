'use client';

import React, { lazy, Suspense } from 'react';
import Image from 'next/image';
import HeroSection from '../components/organisms/HeroSection';
import StatHighlights from '../components/molecules/StatHighlights';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// Dynamic import for heavy components
const PricingTables = lazy(() => import('../components/organisms/PricingTables'));

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Wedding/DJ focused */}
      <HeroSection
        title="Mister DJ - Dé feestspecialist van het zuiden"
        subtitle="Heb je iets te vieren of gewoon zin in een lekker feestje? Mr. DJ verzorgt de complete show en krijgt de voetjes van de vloer!"
        ctaPrimaryText="Vraag Gratis Offerte"
        ctaSecondaryText="Bekijk Portfolio"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="/galerij"
        backgroundClass="bg-brand-gradient"
        titleColor="text-white"
        subtitleColor="text-white/90"
        badges={['Al 15 jaar met 100% dansgarantie', 'Ruim 2500 geslaagde feesten verzorgd', 'Persoonlijk en op maat']}
        socialProof="⭐⭐⭐⭐⭐ Professioneel tot in de puntjes"
      />

      {/* Services Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Van onvergetelijke bruiloft tot bijzondere borrel
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Wij verzorgden al meer dan 2500 feesten en kunnen terugkijken op evenzoveel tevreden feestbeesten. Van bruiloften om nooit meer te vergeten, tot borrels, verjaardagen en examenfeesten: Mister DJ draait het dak eraf en krijgt de voetjes van de vloer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Bruiloft DJ Card */}
            <Card className="group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/gallery/bruiloft-001.webp"
                  alt="Bruiloft DJ Service"
                  fill
                  priority
                  quality={80}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-4xl mb-4">💍</div>
              <h3 className="font-display text-xl font-semibold mb-2">Bruiloft DJ</h3>
              <p className="text-gray-600 mb-4">
                Van first dance tot laatste knaller - wij maken jullie bruiloft onvergetelijk met perfecte muziek voor elk moment.
              </p>
              <a href="/bruiloft">
                <Button variant="secondary" size="sm" className="text-brand-600 hover:bg-brand-50">
                  Meer info →
                </Button>
              </a>
            </Card>

            {/* Feesten & Partijen Card */}
            <Card className="group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/gallery/feest-001.webp"
                  alt="Feesten & Partijen DJ"
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-2">Feesten & Partijen</h3>
              <p className="text-gray-600 mb-4">
                Drive-in shows, verjaardagen, jubilea - altijd de juiste muziek en een volle dansvloer gegarandeerd.
              </p>
              <a href="/feesten">
                <Button variant="secondary" size="sm" className="text-brand-600 hover:bg-brand-50">
                  Meer info →
                </Button>
              </a>
            </Card>

            {/* Zakelijke Events Card */}
            <Card className="group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/gallery/feest-005.webp"
                  alt="Zakelijke Events DJ"
                  fill
                  loading="lazy"
                  quality={75}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-4xl mb-4">💼</div>
              <h3 className="font-display text-xl font-semibold mb-2">Zakelijke Events</h3>
              <p className="text-gray-600 mb-4">
                Professionele DJ-service voor bedrijfsfeesten, beurzen en events met passende muziek en aankleding.
              </p>
              <a href="/zakelijk">
                <Button variant="secondary" size="sm" className="text-brand-600 hover:bg-brand-50">
                  Meer info →
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section using StatHighlights */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Bewezen Kwaliteit"
            subtitle="Waarom klanten al 15 jaar voor ons kiezen"
            stats={[
              {
                label: 'Jaar Ervaring',
                value: '15+',
                description: 'Sinds 2008 verzorgen wij professionele DJ services in heel Nederland'
              },
              {
                label: 'Events Gedraaid',
                value: '2500+',
                description: 'Van intieme bruiloften tot grote corporate events met 1000+ gasten'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug - al 15 jaar nog nooit voorgekomen!'
              },
              {
                label: 'Gemiddelde Review',
                value: '5★',
                description: 'Perfect gemiddelde op basis van 250+ reviews via Google en ThePerfectWedding'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Portfolio Preview Gallery */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impressies van onze events
            </h2>
            <p className="text-lg text-gray-600">
              Een kijkje achter de schermen en sfeerbeelden van onze gedraaide events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: 'bruiloft-001.webp', title: 'Bruiloft Eindhoven', category: 'Bruiloft' },
              { img: 'feest-001.webp', title: 'Bedrijfsfeest Amsterdam', category: 'Corporate' },
              { img: 'bruiloft-006.webp', title: 'Trouwfeest Veldhoven', category: 'Bruiloft' },
              { img: 'bruiloft-003.webp', title: 'Bruiloft Den Bosch', category: 'Bruiloft' },
              { img: 'feest-005.webp', title: 'Corporate Event', category: 'Zakelijk' },
              { img: 'feest-010.webp', title: 'Drive-in Show', category: 'Feest' }
            ].map((item, idx) => (
              <Card key={idx} className="group cursor-pointer hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={`/media/optimized/webp/gallery/${item.img}`}
                    alt={item.title}
                    fill
                    loading="lazy"
                    quality={70}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white text-sm font-semibold mb-1">{item.category}</p>
                    <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => window.location.href = '/galerij'}>
              Bekijk alle foto&apos;s en video&apos;s
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wat onze klanten zeggen
            </h2>
            <p className="text-lg text-gray-600">
              Lees waarom bruidsparen en bedrijven ons al jaren vertrouwen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "Mister DJ heeft onze bruiloft onvergetelijk gemaakt! De dansvloer was de hele avond vol en de muziekkeuze was perfect. Iedereen heeft genoten!",
                author: "Lisa & Tom",
                role: "Bruiloft Eindhoven, 2024",
                rating: 5
              },
              {
                quote: "Professioneel, betrouwbaar en geweldige muziek. Ons bedrijfsfeest was een groot succes dankzij Mister DJ. Alle collega's zijn nog steeds enthousiast!",
                author: "Mark van der Berg",
                role: "TechCorp BV, 2024",
                rating: 5
              },
              {
                quote: "De drive-in show was spectaculair! Onze gasten praten er nog steeds over. Topservice en perfecte uitvoering van begin tot eind.",
                author: "Sandra Jansen",
                role: "50-jarig Jubileum, 2024",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-spacing-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section using PricingTables component */}
      <Suspense fallback={<div className="py-spacing-3xl text-center">Laden...</div>}>
        <PricingTables />
      </Suspense>

      {/* FAQ Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-lg text-gray-600">
              De antwoorden op de meest gestelde vragen over onze DJ services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Hoe ver van tevoren moet ik boeken?',
                answer: 'Voor bruiloften adviseren wij minimaal 6-9 maanden van tevoren te boeken, vooral in het hoogseizoen (mei-september). Voor andere feesten kan dit korter, afhankelijk van beschikbaarheid.'
              },
              {
                question: 'Wat is inbegrepen in een all-in pakket?',
                answer: 'Een all-in pakket bevat: professionele DJ, compleet licht- en geluidsysteem, optionele photobooth, voor- en nabesprekingsgesprek, en onbeperkt muziek de hele avond. Transport en opbouw is inbegrepen.'
              },
              {
                question: 'Kan ik zelf muziekwensen doorgeven?',
                answer: 'Absoluut! We bespreken vooraf jullie muziekvoorkeuren en kunnen met een Spotify-playlist werken. Ook tijdens het feest nemen we natuurlijk verzoekjes aan.'
              },
              {
                question: 'Hoe werkt de 100% dansgarantie?',
                answer: 'Met onze jarenlange ervaring lezen we het publiek perfect en spelen we altijd de juiste muziek op het juiste moment. Mocht de dansvloer toch leeg blijven, dan krijg je je geld terug - al is dit in 15 jaar nog nooit voorgekomen!'
              },
              {
                question: 'Verzorgen jullie ook de ceremonie of receptie?',
                answer: 'Ja! We kunnen de hele dag verzorgen, van ceremonie-muziek tot receptie en avondfeest. Dit bespreken we graag in een persoonlijk gesprek.'
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
              Bekijk alle vragen →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar om jullie feest onvergetelijk te maken?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan en ontdek wat wij voor jullie kunnen betekenen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '#contact'}
            >
              Vraag gratis offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '#contact'}
            >
              Plan een videocall
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neem contact op
            </h2>
            <p className="text-lg text-gray-600">
              Vul onderstaand formulier in en we nemen binnen 24 uur contact met je op
            </p>
          </div>

          <Card className="p-spacing-xl">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="Jouw naam"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="jij@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="+31 6 12345678"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type evenement
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                >
                  <option value="">Kies een optie</option>
                  <option value="bruiloft">Bruiloft</option>
                  <option value="feest">Feest/Verjaardag</option>
                  <option value="bedrijfsfeest">Bedrijfsfeest</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Datum evenement
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  placeholder="Vertel ons meer over jouw event..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-600 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                  Ja, ik wil de nieuwsbrief ontvangen met tips en aanbiedingen
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Verstuur aanvraag
              </Button>

              <p className="text-sm text-gray-600 text-center">
                ⚡ We reageren binnen 24 uur op alle aanvragen
              </p>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
