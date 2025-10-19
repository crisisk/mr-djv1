import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';

const OverOnsPage = () => {
  return (
    <div className="OverOnsPage">
      <Helmet>
        <title>Over Mr. DJ | Professionele DJ Service Nederland</title>
        <meta
          name="description"
          content="Leer Mr. DJ kennen - professionele DJ service met jarenlange ervaring in bruiloften, bedrijfsfeesten en party's door heel Nederland."
        />
      </Helmet>

      <Header />

      <HeroSection
        title="Over Mr. DJ"
        subtitle="Passie voor muziek, gedreven door perfectie"
        ctaPrimaryText="Neem Contact Op"
        backgroundClass="bg-[#1A2C4B]"
      />

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Ons Verhaal
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Het begon allemaal met een passie voor muziek en de drang om mensen een onvergetelijke
                avond te bezorgen. Wat startte als een hobby tijdens studentenfeesten, groeide uit tot
                een professionele DJ service die nu door heel Nederland optreedt.
              </p>
              <p>
                Met meer dan 15 jaar ervaring hebben we inmiddels honderden bruiloften, bedrijfsfeesten
                en party's verzorgd. Van intieme familiefeesten tot grote corporate events met 500+ gasten.
                Elke keer opnieuw is het onze missie om dé perfecte muzikale ervaring te creëren.
              </p>
              <p>
                Wat ons onderscheidt? We geloven niet in 'one size fits all'. Elk evenement is uniek
                en verdient een persoonlijke aanpak. Daarom nemen we uitgebreid de tijd voor een
                voorbereiding, stemmen we de muziek af op jouw smaak en passen we ons aan tijdens het
                feest op basis van de sfeer en reacties van het publiek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
            Ons Team
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-48 h-48 bg-[#00AEEF] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-6xl">
                🎧
              </div>
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-2">Mr. DJ</h3>
              <p className="text-[#00AEEF] font-semibold mb-4">Founder & Lead DJ</p>
              <p className="text-gray-700">
                15+ jaar ervaring. Specialist in bruiloften en corporate events. Altijd op zoek naar
                de perfecte vibe en de nieuwste hits om het publiek te laten dansen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-[#D4AF37] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-6xl">
                🎷
              </div>
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-2">Leslie Moore</h3>
              <p className="text-[#D4AF37] font-semibold mb-4">Saxofonist</p>
              <p className="text-gray-700">
                Professioneel saxofonist met conservatorium opleiding. Speelt mee met de DJ sets
                en brengt een unieke live dimensie aan elk feest. Gespecialiseerd in house, pop en soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
              Onze Kernwaarden
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Professionaliteit</h3>
                <p className="text-gray-700">
                  Stipt op tijd, nette presentatie, betrouwbare apparatuur en duidelijke communicatie.
                  Dat is wat je van ons mag verwachten.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Passie</h3>
                <p className="text-gray-700">
                  Muziek is onze passie. We blijven ons ontwikkelen, volgen trends en zoeken altijd
                  naar manieren om jullie feest nóg beter te maken.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Persoonlijk Contact</h3>
                <p className="text-gray-700">
                  Geen standaard pakket, maar maatwerk. We luisteren naar jullie wensen en denken
                  actief mee om het perfecte feest te creëren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
              Onze Ervaring In Cijfers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#00AEEF] mb-2">15+</div>
                <p className="text-gray-700">Jaar Ervaring</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-[#00AEEF] mb-2">500+</div>
                <p className="text-gray-700">Events Verzorgd</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-[#00AEEF] mb-2">4.9</div>
                <p className="text-gray-700">Gemiddelde Review</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-[#00AEEF] mb-2">95%</div>
                <p className="text-gray-700">Klanten Raden Ons Aan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Onze Apparatuur
            </h2>
            <p className="text-gray-700 mb-8">
              We werken uitsluitend met professionele A-merk apparatuur voor optimale geluidskwaliteit
              en betrouwbaarheid. Onze apparatuur wordt regelmatig onderhouden en ge-upgrade om altijd
              de beste prestaties te kunnen leveren.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">🔊 Geluid</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Pioneer DJ CDJ-3000 / XDJ-XZ</li>
                  <li>• JBL PRX / RCF HD Line Array Speakers</li>
                  <li>• Crown XTi / Powersoft Versterkers</li>
                  <li>• Shure / Sennheiser Draadloze Microfoons</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">💡 Licht</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Chauvet / ADJ Moving Heads</li>
                  <li>• Laser Effecten (Coherent / Kvant)</li>
                  <li>• LED Bars & Uplights</li>
                  <li>• DMX Besturing & Show Programming</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1A2C4B] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Klaar Om Kennis Te Maken?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We horen graag over jullie plannen! Bel of mail ons voor een vrijblijvend gesprek
            over de mogelijkheden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+31408422594"
              className="inline-block bg-[#00AEEF] hover:bg-[#0096D6] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Bel: +31 (0) 40 8422594
            </a>
            <a
              href="/contact"
              className="inline-block bg-[#D4AF37] hover:bg-[#C4A137] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Stuur Een Bericht
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OverOnsPage;
