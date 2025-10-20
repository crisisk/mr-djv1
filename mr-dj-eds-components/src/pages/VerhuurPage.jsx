import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import ContactForm from '../components/Organisms/ContactForm.jsx';
import { generateBreadcrumbSchema } from '../utils/schemaOrg.js';
import { createServiceBreadcrumbs } from '../utils/breadcrumbs.js';

const VerhuurPage = () => {
  const breadcrumbs = createServiceBreadcrumbs('Verhuur', '/verhuur');
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema(breadcrumbs));

  return (
    <div className="VerhuurPage">
      <Helmet>
        <title>Licht en geluid verhuur in Brabant - Mister DJ</title>
        <meta
          name="description"
          content="Professionele DJ apparatuur nodig? Huur van een professionele DJ! Draaitafels, Geluidsset, Kabels, Microfoons, Mixers, Lichtinstallaties, Lasers en meer!"
        />
        <meta name="keywords" content="licht verhuur, geluid verhuur, DJ apparatuur huren, geluidsinstallatie verhuur, lichtinstallatie verhuur, laser verhuur, brabant" />
        <script type="application/ld+json">{breadcrumbSchema}</script>
      </Helmet>

      <Header />

      <HeroSection
        title="Licht en Geluid Verhuur Brabant"
        subtitle="Professionele DJ apparatuur voor elk feest - van 5 tot 500 personen"
        ctaPrimaryText="Vraag Beschikbaarheid"
        ctaSecondaryText="Bekijk Apparatuur"
        backgroundImage="/images/events/hero-verhuur.webp"
      />

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Professionele Apparatuur Voor Jouw Event
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Ook al kun je nog zo lekker draaien, als je boxen kraken en de microfoon iedere keer
              begint te piepen als je het publiek toespreekt, wordt het nooit wat. Onze licht en
              geluid verhuur in Brabant biedt dan uitkomst. Wij maken zelf ook gebruik van deze
              apparatuur bij onze professionele drive in shows. Tegen een kleine vergoeding (en als
              je alles heel laat) mag je onze apparatuur gebruiken voor je eigen feest of je eigen
              show. Wij verhuren zowel zakelijk als aan particulieren.
            </p>
          </div>
        </div>
      </section>

      {/* Feest en DJ Apparatuur */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Feest en DJ Apparatuur Huren in Brabant
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              Of je nu een feestje geeft in je garage, je kelder of een heel café aan het dansen
              wil krijgen, met onze professionele DJ- en feestapparatuur verandert iedere ruimte
              in een dampende feesttent. Moet je alleen zelf nog even de juiste plaatjes draaien.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎚️</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Draaitafels</h3>
                <p className="text-gray-700">
                  Professionele draaitafels voor vinyl of digitaal draaien
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎛️</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">DJ Booth</h3>
                <p className="text-gray-700">
                  Complete DJ setup inclusief booth voor professionele uitstraling
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💨</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Rookmachine</h3>
                <p className="text-gray-700">
                  Creëer sfeer met professionele rookmachines
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🕺</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Lichtgevende Dansvloer</h3>
                <p className="text-gray-700">
                  LED dansvloer voor een spectaculaire uitstraling
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Discoballen</h3>
                <p className="text-gray-700">
                  Klassieke discoballen en LED effecten
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geluidsinstallatie */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Geluidsinstallatie Verhuur
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              Wij hebben geluidsinstallaties op voorraad waarmee je feesten van 5 tot 500 man
              van kraakhelder geluid kunt voorzien.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-[#00AEEF]/10 to-white p-8 rounded-lg border border-[#00AEEF]/20">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-6 flex items-center gap-3">
                  <span className="text-3xl">🔊</span>
                  Geluid Apparatuur
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00AEEF] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Speakers en Boxen</strong>
                      <p className="text-gray-600 text-sm">Van compact tot grote line arrays</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00AEEF] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Versterkers</strong>
                      <p className="text-gray-600 text-sm">Krachtige versterkers voor elk formaat</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00AEEF] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Subwoofers</strong>
                      <p className="text-gray-600 text-sm">Diepe bassen voor echte impact</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00AEEF] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Alle Kabels</strong>
                      <p className="text-gray-600 text-sm">Complete bekabeling inclusief</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-white p-8 rounded-lg border border-[#D4AF37]/20">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎤</span>
                  Mixing & Microfoons
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Speakerstandaarden</strong>
                      <p className="text-gray-600 text-sm">Stabiele statief voor optimale plaatsing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Microfoons</strong>
                      <p className="text-gray-600 text-sm">Draadloos en bedraad beschikbaar</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] font-bold mt-1">✓</span>
                    <div>
                      <strong className="text-[#1A2C4B]">Mixers</strong>
                      <p className="text-gray-600 text-sm">Professionele DJ mixers</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lichtinstallatie */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Lichtinstallatie en Lasershow Verhuur
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              Ook onze lichtinstallaties zijn geschikt voor zowel tuinfeesten met pakweg 20 gasten
              tot grote feesten in een hoge zaal met tot wel 500 bezoekers.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🔦</div>
                <h3 className="text-lg font-bold text-[#1A2C4B] mb-2">Complete Lasershows</h3>
                <p className="text-gray-600 text-sm">
                  Spectaculaire lasereffecten voor grote events
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-lg font-bold text-[#1A2C4B] mb-2">Losse Lasers</h3>
                <p className="text-gray-600 text-sm">
                  Individuele lasers voor kleinere setups
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-lg font-bold text-[#1A2C4B] mb-2">Lichtinstallaties</h3>
                <p className="text-gray-600 text-sm">
                  Inclusief alle bevestigingsmaterialen
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-lg font-bold text-[#1A2C4B] mb-2">LED Podium Lampen</h3>
                <p className="text-gray-600 text-sm">
                  Professionele podiumverlichting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capacity Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#D4AF37] p-1 rounded-lg">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-[#1A2C4B] mb-6 text-center">
                  Voor Elk Evenement De Juiste Apparatuur
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-5xl font-bold text-[#00AEEF] mb-2">5-50</div>
                    <p className="text-[#1A2C4B] font-semibold">Personen</p>
                    <p className="text-gray-600 text-sm mt-2">Compact systeem voor huisfeesten</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-[#00AEEF] mb-2">50-200</div>
                    <p className="text-[#1A2C4B] font-semibold">Personen</p>
                    <p className="text-gray-600 text-sm mt-2">Mid-size setup voor zalenfeesten</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-[#00AEEF] mb-2">200-500</div>
                    <p className="text-[#1A2C4B] font-semibold">Personen</p>
                    <p className="text-gray-600 text-sm mt-2">Grote installatie voor grote events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
              Hoe Werkt Het?
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg flex gap-4 shadow-sm">
                <div className="text-3xl flex-shrink-0">📍</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Ophalen of Bezorgen</h3>
                  <p className="text-gray-700">
                    Wij zijn gevestigd in Veldhoven. Het is dus mogelijk de apparatuur bij ons
                    in de loods op te komen halen, maar laten bezorgen kan ook.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg flex gap-4 shadow-sm">
                <div className="text-3xl flex-shrink-0">🤝</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Zakelijk & Particulier</h3>
                  <p className="text-gray-700">
                    Of je nu een bedrijfsfeest organiseert of een privéfeest geeft, wij verhuren
                    aan zowel zakelijke als particuliere klanten.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg flex gap-4 shadow-sm">
                <div className="text-3xl flex-shrink-0">✅</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Professionele Kwaliteit</h3>
                  <p className="text-gray-700">
                    Wij maken zelf ook gebruik van deze apparatuur bij onze professionele drive in
                    shows. Je huurt dus dezelfde kwaliteit waarmee wij zelf werken.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg flex gap-4 shadow-sm">
                <div className="text-3xl flex-shrink-0">💰</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B] mb-2">Scherpe Prijzen</h3>
                  <p className="text-gray-700">
                    Tegen een kleine vergoeding (en als je alles heel laat) mag je onze apparatuur
                    gebruiken voor je eigen feest of show.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
              Neem Contact Op Met Onze Licht en Geluid Verhuur in Brabant
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Neem vrijblijvend contact op voor meer informatie of vraag direct een offerte aan.
            </p>
            <ContactForm variant="A" eventType="verhuur" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#D4AF37] text-white py-12 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Professionele Apparatuur Voor Je Event!
        </h3>
        <p className="text-xl mb-6">
          Bel direct voor beschikbaarheid en prijzen
        </p>
        <a
          href="tel:+31408422594"
          className="inline-block bg-[#1A2C4B] hover:bg-[#0F1C35] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          +31 (0) 40 8422594
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default VerhuurPage;
