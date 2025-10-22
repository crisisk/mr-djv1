'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import StatHighlights from '../../components/molecules/StatHighlights';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function OverOnsPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        eyebrow="Over Mister DJ"
        title="15+ Jaar Passie Voor Perfecte Feesten"
        subtitle="Van klein drive-in project tot een van de meest gewaardeerde DJ services in Brabant"
        ctaPrimaryText="Neem Contact Op"
        ctaSecondaryText="Bekijk Portfolio"
        ctaPrimaryHref="/contact"
        ctaSecondaryHref="/galerij"
        backgroundClass="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['Sinds 2008', '2500+ Events', '⭐ 5.0 Reviews']}
        socialProof="🎉 Vertrouwd door duizenden klanten in Nederland"
      />

      {/* Our Story */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ons Verhaal
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Het begon in 2008 met een passie voor muziek en een droom: mensen samenbrengen
                  en onvergetelijke momenten creëren. Wat startte als een klein drive-in project
                  is uitgegroeid tot een van de meest gewaardeerde DJ services in Brabant.
                </p>
                <p>
                  Door de jaren heen hebben we meer dan 2500 events mogen verzorgen - van intieme
                  bruiloften tot grote corporate events met duizenden bezoekers. Elke keer opnieuw
                  geven we alles om jullie feest onvergetelijk te maken.
                </p>
                <p>
                  Onze kracht? We luisteren écht naar wat jullie willen. Geen standaard playlists,
                  maar muziek die perfect past bij jullie en je gasten. Gecombineerd met onze
                  jarenlange ervaring resulteert dat altijd in een volle dansvloer en blije gezichten.
                </p>
                <p className="font-semibold text-gray-900">
                  Want dat is waar het om draait: samen zorgen we voor de mooiste herinneringen.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/team/team-001.webp"
                  alt="Mister DJ Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/team/team-002.webp"
                  alt="DJ Setup"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/team/team-003.webp"
                  alt="Event Photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/media/optimized/webp/team/team-004.webp"
                  alt="DJ Performance"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <StatHighlights
            title="Mister DJ In Cijfers"
            subtitle="15 jaar passie voor perfecte feesten"
            stats={[
              {
                label: 'Jaar Ervaring',
                value: '15+',
                description: 'Sinds 2008 actief in de entertainment industrie'
              },
              {
                label: 'Events Verzorgd',
                value: '2500+',
                description: 'Bruiloften, feesten en corporate events'
              },
              {
                label: 'Tevreden Klanten',
                value: '100%',
                description: 'Perfect gemiddelde op Google en ThePerfectWedding'
              },
              {
                label: 'Team Leden',
                value: '5+',
                description: 'Professionele DJ\'s en technici'
              }
            ]}
            orientation="horizontal"
            animated={true}
          />
        </div>
      </section>

      {/* Our Values */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Kernwaarden
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dit is waar wij voor staan en waar jullie op kunnen rekenen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-spacing-lg">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="font-display text-xl font-semibold mb-3">Betrouwbaar</h3>
              <p className="text-gray-600">
                Wat we beloven, maken we waar. Op tijd, compleet en precies zoals afgesproken.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="font-display text-xl font-semibold mb-3">Professioneel</h3>
              <p className="text-gray-600">
                Premium apparatuur, verzorgde presentatie en jarenlange ervaring in élke situatie.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-display text-xl font-semibold mb-3">Flexibel</h3>
              <p className="text-gray-600">
                Elk event is uniek. We passen ons aan jullie wensen en kunnen altijd schakelen.
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="font-display text-xl font-semibold mb-3">Passie</h3>
              <p className="text-gray-600">
                Muziek is onze passie. We geven elke keer alles om jullie feest perfect te maken.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ons Team
            </h2>
            <p className="text-lg text-gray-600">
              De gezichten achter jullie onvergetelijke feest
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'DJ Marc', role: 'Founder & Lead DJ', img: 'team-001.webp' },
              { name: 'DJ Kevin', role: 'Wedding Specialist', img: 'team-002.webp' },
              { name: 'DJ Stefan', role: 'Corporate Events', img: 'team-003.webp' },
              { name: 'DJ Tim', role: 'Party & Events', img: 'team-004.webp' },
              { name: 'Sax Player', role: 'Live Saxofonist', img: 'team-005.webp' }
            ].map((member, idx) => (
              <Card key={idx} className="text-center p-spacing-md">
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`/media/optimized/webp/team/${member.img}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen Voor Mister DJ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dit maakt ons anders dan andere DJ services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="font-semibold text-xl mb-3">Muziek Op Maat</h3>
              <p className="text-gray-600">
                Geen standaard playlists. We luisteren naar jullie voorkeuren en spelen wat bij jullie past.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-semibold text-xl mb-3">Premium Apparatuur</h3>
              <p className="text-gray-600">
                Alleen de beste geluids- en lichtapparatuur voor optimale kwaliteit en sfeer.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-semibold text-xl mb-3">Direct Contact</h3>
              <p className="text-gray-600">
                Rechtstreeks contact met je DJ. Geen tussenpersonen, snelle communicatie.
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-xl mb-3">Altijd Backup</h3>
              <p className="text-gray-600">
                Dubbele apparatuur en backup systemen. Jullie feest gaat altijd door!
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-xl mb-3">100% Dansgarantie</h3>
              <p className="text-gray-600">
                Met onze ervaring garanderen we een volle dansvloer. Al 15 jaar bewezen!
              </p>
            </Card>

            <Card className="p-spacing-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold text-xl mb-3">All-In Pakketten</h3>
              <p className="text-gray-600">
                Transparante prijzen zonder verrassingen. Alles inclusief in één pakket.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Werkgebied
            </h2>
            <p className="text-lg text-gray-600">
              Gevestigd in Brabant, actief in heel Nederland
            </p>
          </div>

          <Card className="p-spacing-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-xl mb-4">Primair Werkgebied</h3>
                <p className="text-gray-700 mb-4">
                  We zijn gevestigd in Eindhoven en verzorgen voornamelijk events in:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Eindhoven en omgeving</li>
                  <li>✓ Brabant (Den Bosch, Tilburg, Breda)</li>
                  <li>✓ Limburg (Maastricht, Venlo)</li>
                  <li>✓ Gelderland (Nijmegen, Arnhem)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-4">Heel Nederland</h3>
                <p className="text-gray-700 mb-4">
                  Voor grotere events komen we graag naar:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Amsterdam en Randstad</li>
                  <li>✓ Utrecht en omgeving</li>
                  <li>✓ Rest van Nederland</li>
                  <li>✓ Ook België mogelijk</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600">
                📍 Reiskosten berekenen we transparant en zijn vaak al inbegrepen in onze pakketten
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar Om Kennis Te Maken?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Plan een vrijblijvend gesprek en ontdek wat wij voor jullie kunnen betekenen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Neem contact op
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/pakketten'}
            >
              Bekijk pakketten
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
