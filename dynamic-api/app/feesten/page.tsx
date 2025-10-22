'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import PricingTables from '../../components/organisms/PricingTables';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function FeestenPage() {
  return (
    <>
      {/* Hero Section - Party focused */}
      <HeroSection
        eyebrow="Feesten & Partijen DJ"
        title="Elk Feest Een Spektakel"
        subtitle="Van drive-in shows tot verjaardagsfeesten - wij zorgen voor een volle dansvloer en onvergetelijke avond"
        ctaPrimaryText="Bekijk Pakketten"
        ctaSecondaryText="Gratis Offerte"
        ctaPrimaryHref="#pricing"
        ctaSecondaryHref="#contact"
        backgroundClass="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['1500+ Feesten', '⭐ 5.0 Reviews', '100% Dansgarantie']}
        socialProof="🎉 De specialist in feest entertainment sinds 2008"
      />

      {/* Service Types - Party specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Voor Elk Type Feest
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Van intiem tot spectaculair - wij passen ons aan jouw feest
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Drive-in Show */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="font-display text-xl font-semibold mb-3">Drive-in Show</h3>
              <p className="text-gray-600 mb-4">
                Professionele drive-in show met disco, lichtshow en entertainment voor jubilea en grote feesten.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Complete licht- en geluidsset</li>
                <li>✓ Professionele DJ booth</li>
                <li>✓ Laser en effectverlichting</li>
              </ul>
            </Card>

            {/* Verjaardagsfeest */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="font-display text-xl font-semibold mb-3">Verjaardagsfeest</h3>
              <p className="text-gray-600 mb-4">
                Van 18e verjaardag tot Sarah/Abraham - wij zorgen voor de perfecte muziek en sfeer.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Muziek op maat</li>
                <li>✓ Interactieve DJ</li>
                <li>✓ Optionele photobooth</li>
              </ul>
            </Card>

            {/* Jubileum */}
            <Card className="text-center">
              <div className="text-6xl mb-4">🎊</div>
              <h3 className="font-display text-xl font-semibold mb-3">Jubileum</h3>
              <p className="text-gray-600 mb-4">
                Vier je 12,5, 25 of 40 jaar jubileum met de beste hits uit jouw tijd en moderne classics.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Muziek door de decennia</li>
                <li>✓ Persoonlijke aanpak</li>
                <li>✓ Live saxofonist optie</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats - Party specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Waarom Kiezen Voor Onze Feest DJ Service"
            stats={[
              {
                label: 'Feesten Verzorgd',
                value: '1500+',
                description: 'Van kleine verjaardagen tot grote drive-in shows in heel Nederland'
              },
              {
                label: 'Gemiddelde Review',
                value: '5.0★',
                description: 'Perfect gemiddelde op Google en social media reviews'
              },
              {
                label: 'Dansgarantie',
                value: '100%',
                description: 'Volle dansvloer of geld terug - al 15 jaar niet voorgekomen!'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Gallery - Party photos */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sfeerbeelden Van Onze Feesten
            </h2>
            <p className="text-lg text-gray-600">
              Laat je inspireren door de energie en sfeer van onze verzorgde feesten
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <div key={num} className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={`/media/optimized/webp/gallery/feest-${String(num).padStart(3, '0')}.webp`}
                  alt={`Feest ${num}`}
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
            <Button size="lg" onClick={() => window.location.href = '/galerij?filter=feest'}>
              Bekijk alle feestfoto&apos;s (28)
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Party specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wat Feestvierders Zeggen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "De drive-in show was echt spectaculair! De lichtshow en muziek waren perfect. Al onze gasten hebben de hele avond gedanst!",
                author: "Mark & Linda",
                role: "25 jaar jubileum, Tilburg",
                image: "feest-001.webp"
              },
              {
                quote: "Precies wat we zochten voor het 18e verjaardagsfeest van onze dochter. De DJ speelde alle hits en de sfeer was geweldig!",
                author: "Familie Janssen",
                role: "Verjaardagsfeest Eindhoven",
                image: "feest-005.webp"
              },
              {
                quote: "Van begin tot eind perfect geregeld. De DJ wist precies hoe hij het feest op moest bouwen. Heel veel complimenten gekregen!",
                author: "Robert",
                role: "50e verjaardag Breda",
                image: "feest-010.webp"
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

      {/* Add-ons */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Extra Opties Voor Jouw Feest
            </h2>
            <p className="text-lg text-gray-600">
              Maak je feest nog spectaculairder met deze extra&apos;s
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🎷', title: 'Live Saxofonist', desc: 'Live sax voor extra sfeer' },
              { icon: '📸', title: 'Photobooth', desc: 'Instant foto&apos;s voor gasten' },
              { icon: '💡', title: 'Extra Verlichting', desc: 'Moving heads en lasers' },
              { icon: '🎤', title: 'Karaoke', desc: 'Zelf meezingen op hits' }
            ].map((addon, idx) => (
              <Card key={idx} className="text-center p-spacing-lg">
                <div className="text-5xl mb-3">{addon.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{addon.title}</h3>
                <p className="text-sm text-gray-600">{addon.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <PricingTables />
      </section>

      {/* FAQ - Party specific */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde Vragen Over Feest DJ
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Wat is het verschil tussen een normale DJ en een drive-in show?',
                answer: 'Een drive-in show is een complete mobiele discotheek met professionele DJ booth, uitgebreide verlichting (lasers, moving heads, effecten) en premium geluidsysteem. Perfect voor grotere feesten en jubilea waar je echt wilt opvallen!'
              },
              {
                question: 'Hoe ver van tevoren moet ik boeken?',
                answer: 'Voor populaire data (weekenden, feestdagen) adviseren we 2-3 maanden van tevoren. Voor doordeweekse dagen kan dit vaak korter. Check snel onze beschikbaarheid!'
              },
              {
                question: 'Kunnen jullie ook buiten spelen?',
                answer: 'Ja! We hebben apparatuur geschikt voor zowel binnen als buiten. We houden rekening met weersomstandigheden en hebben altijd een backup plan.'
              },
              {
                question: 'Wat voor muziek spelen jullie?',
                answer: 'We draaien alle genres en decennia - van 60s/70s classics tot de nieuwste hits. We stemmen de muziek af op jouw gasten en voorkeuren. Je mag ook een Spotify playlist delen!'
              },
              {
                question: 'Is de 100% dansgarantie serieus?',
                answer: 'Absoluut! Met 15 jaar ervaring weten we precies welke muziek wanneer te spelen. Als de dansvloer toch leeg blijft, krijg je je geld terug. Dit is in 15 jaar nog nooit voorgekomen!'
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
      <section id="contact" className="py-spacing-3xl px-spacing-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar Voor Een Onvergetelijk Feest?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag vrijblijvend een offerte aan voor jouw feest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-50"
            >
              Vraag feest offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Bel direct: 040-8422594
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
