'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function BruiloftPage() {
  return (
    <>
      {/* Hero Section - Wedding focused */}
      <HeroSection
        eyebrow="Mister DJ Bruiloft Drive In Show"
        title="Mister DJ op jullie bruiloft - 100% dansgarantie"
        subtitle="De mooiste dag van je leven wordt nog mooier als je ook ja zegt tegen een bruiloft DJ van Mr. DJ. Wij garanderen al meer dan vijftien jaar professioneel verzorgde trouwfeesten op maat."
        ctaPrimaryText="Vraag Offerte"
        ctaSecondaryText="Gratis Gesprek"
        ctaPrimaryHref="#contact"
        ctaSecondaryHref="#contact"
        backgroundClass="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['500+ Bruiloften', '100% Dansgarantie', 'Altijd een reserve DJ']}
        socialProof="❤️ Inclusief licht, geluid en een flinke dosis Brabantse gezelligheid"
      />

      {/* Service Highlights - Wedding specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jullie trouwfeest tot in de puntjes verzorgd
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Je kijkt er lang naar uit en zult er nog zo veel langer aan terugdenken: jullie trouwdag. Daarom wil je die dag absoluut geen gedoe. Alles moet perfect professioneel geregeld zijn, ook het bruiloftsfeest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Ceremonie */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="font-display text-xl font-semibold mb-3">Ceremonie</h3>
              <p className="text-gray-600 mb-4">
                Klassieke en moderne muziek voor jullie ceremonie. Van binnenkomst tot het ja-woord.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Draadloze microfoons</li>
                <li>✓ Muziek op maat</li>
                <li>✓ Discrete opstelling</li>
              </ul>
            </Card>

            {/* Receptie */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🥂</div>
              <h3 className="font-display text-xl font-semibold mb-3">Receptie</h3>
              <p className="text-gray-600 mb-4">
                Lounge en background muziek die past bij jullie stijl en gasten.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Sfeervolle achtergrondmuziek</li>
                <li>✓ Aangepaste playlist</li>
                <li>✓ Perfect volume</li>
              </ul>
            </Card>

            {/* Avondfeest */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-display text-xl font-semibold mb-3">Avondfeest</h3>
              <p className="text-gray-600 mb-4">
                Dance hits en party classics voor een volle dansvloer tot in de late uurtjes.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ First dance begeleiding</li>
                <li>✓ 100% dansgarantie</li>
                <li>✓ Live saxofonist optie</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats - Wedding specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Bruidsparen Voor Ons Kiezen"
            stats={[
              {
                label: 'Bruiloften Verzorgd',
                value: '500+',
                description: 'Al 15 jaar gespecialiseerd in bruiloft entertainment in heel Nederland'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect gemiddelde op ThePerfectWedding en Google Reviews'
              },
              {
                label: 'Hele Dag Service',
                value: '12u',
                description: 'Van ceremonie tot avondfeest, wij verzorgen jullie complete dag'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Gallery - Wedding photos */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Mooiste Bruiloften
            </h2>
            <p className="text-lg text-gray-600">
              Laat je inspireren door sfeerbeelden van onze verzorgde bruiloften
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <div key={num} className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={`/media/optimized/webp/gallery/bruiloft-${String(num).padStart(3, '0')}.webp`}
                  alt={`Bruiloft ${num}`}
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
            <Button size="lg" onClick={() => window.location.href = '/galerij?filter=bruiloft'}>
              Bekijk alle bruiloftfoto&apos;s (21)
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Wedding specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wat Bruidsparen Zeggen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "De beste keuze die we gemaakt hebben voor onze bruiloft! De DJ wist precies welke muziek wanneer te spelen. Onze gasten hebben non-stop gedanst!",
                author: "Emma & Bas",
                role: "Bruiloft Tilburg, September 2024",
                image: "bruiloft-001.webp"
              },
              {
                quote: "Van ceremonie tot het laatste nummer - alles was perfect! De sfeer was geweldig en alle complimenten van onze gasten gaan over de muziek.",
                author: "Sophie & Mike",
                role: "Bruiloft Eindhoven, Juni 2024",
                image: "bruiloft-006.webp"
              },
              {
                quote: "Professioneel, meedenkend en super gezellig. De DJ + Sax combinatie was echt de kers op de taart. Iedereen vond het geweldig!",
                author: "Lisa & Tom",
                role: "Bruiloft Den Bosch, Augustus 2024",
                image: "bruiloft-003.webp"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-spacing-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={`/media/optimized/webp/gallery/${testimonial.image}`}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hoe Het Werkt
            </h2>
            <p className="text-lg text-gray-600">
              Van eerste contact tot jullie perfecte feest in 5 eenvoudige stappen
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: 1, title: 'Contact', desc: 'Vrijblijvend kennismaken en beschikbaarheid checken' },
                { step: 2, title: 'Gesprek', desc: 'Persoonlijk of videogesprek over jullie wensen' },
                { step: 3, title: 'Muziek', desc: 'Spotify playlist en muziekvoorkeuren doorgeven' },
                { step: 4, title: 'Jullie Dag', desc: 'Wij verzorgen de muziek van A tot Z' },
                { step: 5, title: 'Nabespreking', desc: 'Evaluatie en ontvangst van foto/video materiaal' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-brand-gradient text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Wedding packages */}
      <section id="pricing">
        <PricingTables />
      </section>

      {/* FAQ - Wedding specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde Vragen Over Bruiloft DJ
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Kunnen jullie de hele dag verzorgen?',
                answer: 'Ja! We kunnen de volledige dag verzorgen, van ceremonie-muziek tot receptie en het avondfeest. Dit bespreken we graag in een persoonlijk gesprek zodat we alles perfect op jullie wensen afstemmen.'
              },
              {
                question: 'Wat kost een bruiloft DJ?',
                answer: 'Onze bruiloft pakketten starten vanaf €895 voor alleen het avondfeest. Voor een hele dag arrangement inclusief ceremonie en receptie starten we vanaf €1595. Bekijk onze pakketten hierboven voor meer details.'
              },
              {
                question: 'Kunnen we zelf muziekwensen doorgeven?',
                answer: 'Absoluut! Jullie kunnen een Spotify playlist delen met must-play nummers en een do-not-play lijst. We bespreken vooraf uitgebreid jullie muziekvoorkeuren en de sfeer die jullie willen creëren.'
              },
              {
                question: 'Wat is de first dance begeleiding?',
                answer: 'Wij zorgen voor de perfecte opbouw naar jullie first dance, inclusief spotlights en sfeerverlichting. We kunnen het nummer faden of juist een spectaculaire start maken - precies zoals jullie dat willen!'
              },
              {
                question: 'Werken jullie samen met andere leveranciers?',
                answer: 'Ja, we hebben jarenlange ervaring met samenwerken met fotografen, videografen, ceremoniemeesters en locaties. We stemmen alles van tevoren goed af voor een perfecte dag.'
              },
              {
                question: 'Wat als het slecht weer is?',
                answer: 'Al onze apparatuur is geschikt voor zowel binnen als buiten gebruik. We hebben altijd een backup plan en kunnen flexibel schakelen tussen binnen en buiten locaties.'
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
      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar om jullie bruiloft onvergetelijk te maken?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een bruiloft offerte aan en plan een kennismakingsgesprek
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-50"
            >
              Vraag bruiloft offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Plan videogesprek
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-90">
            ⚡ We reageren binnen 24 uur • 📞 Ook bereikbaar via WhatsApp
          </p>
        </div>
      </section>
    </>
  );
}
