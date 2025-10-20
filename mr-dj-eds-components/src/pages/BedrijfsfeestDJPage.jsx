import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import ContactForm from '../components/Organisms/ContactForm.jsx';
import PricingTables from '../components/Organisms/PricingTables.jsx';
import { pricingPackages } from '../data/pricingPackages.js';
import { generateOfferCatalogSchema, generateServiceSchema } from '../utils/schemaOrg.js';

const BedrijfsfeestDJPage = ({ variant = 'A' }) => {
  // Variant-specific CTA text
  const ctaPrimaryText = variant === 'B' ? 'Boek Nu' : 'Bekijk Video';
  const ctaSecondaryText = variant === 'B' ? 'Check Beschikbaarheid' : 'Vraag Prijs Aan';

  const offerCatalogSchema = generateOfferCatalogSchema({
    packages: pricingPackages,
    pagePath: '/bedrijfsfeest-dj',
  });

  const serviceSchema = {
    ...generateServiceSchema({
      serviceName: 'Zakelijke DJ Service - Bedrijfsfeesten & Evenementen',
      description:
        'Dé professionele Brabantse gangmaker op jouw zakelijke feest of evenement. Complete drive in show! ✓Bedrijfsfeesten ✓Personeelsfeesten ✓Events > 2500 geslaagde feesten verzorgd',
      serviceType: 'Corporate Event DJ',
    }),
    '@id': 'https://mr-dj.sevensa.nl/bedrijfsfeest-dj#service',
    areaServed: 'Nederland',
    offers: {
      '@id': offerCatalogSchema['@id'],
    },
  };

  return (
    <div className="BedrijfsfeestDJPage">
      <Helmet>
        <title>Mister DJ zakelijk – Professioneel tot in de puntjes | DJ voor Bedrijfsfeest</title>
        <meta
          name="description"
          content="Dé professionele Brabantse gangmaker op jouw zakelijke feest of evenement. Complete drive in show! ✓Bedrijfsfeesten ✓Personeelsfeesten ✓Events > 2500 geslaagde feesten verzorgd"
        />
        <meta name="keywords" content="zakelijk dj, bedrijfsfeest dj, zakelijke dj, corporate events, personeelsfeest, zakelijk entertainment, zakelijk evenement, drive in show, professioneel" />

        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(offerCatalogSchema)}</script>
      </Helmet>

      <Header />

      <HeroSection
        title="Mister DJ zakelijk – Professioneel tot in de puntjes"
        subtitle="Ben je voor je bedrijf op zoek naar een DJ die op een professionele manier jullie feest of evenement van een feestelijke muzikale aankleding voorziet? Dan ben je bij Mister DJ aan het juiste adres. Wij zijn namelijk al meer dan 15 jaar dé feestspecialist van het Zuiden. In die tijd hebben wij meer dan 2500 succesvolle feesten en evenementen verzorgd met onze complete drive in show."
        ctaPrimaryText={ctaPrimaryText}
        ctaSecondaryText={ctaSecondaryText}
        backgroundImage="/images/events/hero-zakelijk-evenement.webp"
        variant={variant}
      />

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              Mister DJ is er voor alle zakelijke feesten
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Voor ons ervaren DJ team is niets te gek. Wij kunnen zakelijke feesten en evenementen van 50 tot wel 500 personen van een passende en sfeervolle muzikale aankleding voorzien. Denk bijvoorbeeld aan:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Personeelsfeesten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Kerstborrels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Afdelingsuitjes</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Zakelijke evenementen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Recepties en jubilea</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">✓</span>
                  <span className="text-gray-700">Product lanceringen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored Approach Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              Van onvergetelijk personeelsfeest tot zakelijke borrel
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Bij het organiseren van een bedrijfsfeest is het heel belangrijk het doel van het feest voor ogen te houden. Wil je het personeel trakteren op een onvergetelijk knalfeest vanwege de goede cijfers? Zijn er veel nieuwe gezichten en gaan we lekker teambuilden? Of mag het allemaal wel wat strakker omdat je een groep Arabische investeerders wilt overtuigen van jullie keurige bedrijfscultuur?
            </p>
            <p className="text-lg text-gray-700">
              Mister DJ staat overal voor open en adviseert je desgewenst van passend advies. Zo wordt het bedrijfsfeest voor iedereen leuk en onderdeel van jullie succesverhaal!
            </p>
          </div>
        </div>
      </section>

      {/* Professional Service Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              Bedrijfsfeest DJ huren - Professioneel tot in de puntjes
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Een groot feest organiseren voor je bedrijf is leuk, maar kan ook voor de nodige stress zorgen. Heb ik wel aan alles gedacht? Zal iedereen het wel naar zijn zin hebben? Ook zijn er de ogenschijnlijk simpele praktische zaken. Hoe hard moet de muziek eigenlijk staan? En welke discolampen hang je in de zaal?
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Mister DJ was zoals gezegd van de partij op inmiddels meer dan 2500 feesten. Als geen ander weten we hoe je de slingers moet ophangen om precies die sfeer en setting te creeren die bij jullie bedrijf en de mensen past. Wij garanderen op ieder bedrijfsfeest:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-[#00AEEF] text-2xl mr-4">✓</span>
                <div>
                  <h3 className="font-bold text-[#1A2C4B] mb-2">Een persoonlijke bedrijfsfeest DJ</h3>
                  <p className="text-gray-700">Je eigen vaste DJ die jullie feest van begin tot eind verzorgt</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-[#00AEEF] text-2xl mr-4">✓</span>
                <div>
                  <h3 className="font-bold text-[#1A2C4B] mb-2">Muziek, licht en geluid op maat</h3>
                  <p className="text-gray-700">Afgestemd op de gasten en de locatie voor de perfecte sfeer</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-[#00AEEF] text-2xl mr-4">✓</span>
                <div>
                  <h3 className="font-bold text-[#1A2C4B] mb-2">Altijd een reserve DJ</h3>
                  <p className="text-gray-700">Voor het geval dat - jullie feest gaat hoe dan ook door</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-[#00AEEF] text-2xl mr-4">✓</span>
                <div>
                  <h3 className="font-bold text-[#1A2C4B] mb-2">Gezellig en professioneel</h3>
                  <p className="text-gray-700">Brabantse gezelligheid gecombineerd met zakelijke professionaliteit</p>
                </div>
              </div>
              <div className="flex items-start md:col-span-2">
                <span className="text-[#00AEEF] text-2xl mr-4">✓</span>
                <div>
                  <h3 className="font-bold text-[#1A2C4B] mb-2">Oneindig veel extra mogelijkheden!</h3>
                  <p className="text-gray-700">Van saxofonisten tot lasershow - maak er een echt spektakel van</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8">
              Contact met je persoonlijke Mister DJ
            </h2>
            <p className="text-lg text-gray-700">
              Ruim voordat het feest of evenement plaatsvindt gaat je persoonlijke Mister DJ met jou (of jullie) om tafel om alle wensen door te nemen. Hierin kun je precies aangeven hoe de avond eruit komt te zien en wat er van de DJ verwacht wordt. Ook zal de DJ je van advies op maat voorzien.
            </p>
          </div>
        </div>
      </section>

      {/* Extra Possibilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              Niets is te gek met Mr DJ op je bedrijfsfeest
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Nagenoeg alles kan verder met Mister DJ op een bedrijfsfeest. Willen jullie bijvoorbeeld eerst dineren met rustige muziek? Een speech van de CEO tussen de gangen door? Of liever wat Perzische poezie speciaal voor de Arabische gasten? Je kunt het zo gek niet verzinnen, wij staan overal voor open. Je kunt onze bedrijfsfeest drive in show ook helemaal upgraden met onder andere:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Topsaxofonist Leslie Moore</h3>
                <p className="text-gray-600 text-sm">Live muziek die je feest naar een hoger niveau tilt</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Spectaculaire lasershow</h3>
                <p className="text-gray-600 text-sm">Adembenemende lichteffecten voor een onvergetelijke ervaring</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Zangers en zangeressen</h3>
                <p className="text-gray-600 text-sm">Professionele artiesten voor live entertainment</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Ervaren partyfotograaf</h3>
                <p className="text-gray-600 text-sm">Leg alle mooie momenten vast voor later</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Grote tv-schermen</h3>
                <p className="text-gray-600 text-sm">Perfect voor speciale foto's en bedrijfspresentaties</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-2">Lichtgevende dansvloer</h3>
                <p className="text-gray-600 text-sm">Maak je feest extra speciaal met een LED dansvloer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personeelsfeest Specific Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              DJ personeelsfeest inhuren
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Mag jij dit jaar het personeelsfeest organiseren? En willen jullie niet weer de workshop kantklossen voor gevorderden doen, maar is het buiten te koud om te gaan midgetgolven? Huur dan een professionele DJ in voor het personeelsfeest, want dat vindt iedereen leuk!
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Met Mister DJ op een bedrijfsfeest haal je een flinke dosis Brabantse gezelligheid in huis. En dat niet alleen: met meer dan 2500 geslaagde feesten in meer dan 15 jaar tijd beschikken wij over alle kennis en ervaring om ook jullie feest professioneel tot in de puntjes te verzorgen.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                Een complete drive in show aangepast aan de locatie
              </h3>
              <p className="text-gray-700 mb-4">
                Met een Mister DJ op jullie feest heb je nergens meer omkijken naar. Zo kun je heel de avond samen met je collega's genieten van dampende beats! Wij weten als geen ander hoe je de slingers moet ophangen, letterlijk en figuurlijk. Zo toveren we iedere locatie om tot een volwaardige feestlocatie en creeren we een feest dat bij jullie past.
              </p>
              <p className="text-gray-700 font-semibold">
                Inclusief 100% Dansgarantie!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zakelijk Evenement Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-8 text-center">
              DJ zakelijk evenement inhuren
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Organiseer je een zakelijk event en ben je op zoek naar een professionele DJ voor de muzikale omlijsting? Huur dan Mister DJ voor je zakelijke evenement. Wij verzorgen de complete drive in show, zodat jij je volledig kunt focussen op het evenement en je gasten.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Bij het organiseren van een evenement voor je bedrijf is een ding heel belangrijk. Het moet professioneel zijn, maar ook niet saai of stijfjes. Je wilt immers een goede indruk maken op je gasten. Daarom kan de organisatie van zo'n event nog wel eens de nodige stress opleveren. Mister DJ neemt je al deze zorgen uit handen.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">Feestelijke opening</h3>
                <p className="text-gray-600">Maak indruk met professionele muzikale omlijsting bij je opening</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">Product lancering</h3>
                <p className="text-gray-600">Lanceer je nieuwe product of dienst met de juiste sfeer</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">Recepties en congressen</h3>
                <p className="text-gray-600">Achtergrondmuziek en entertainment voor zakelijke bijeenkomsten</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-[#1A2C4B] mb-3">Jubilea</h3>
                <p className="text-gray-600">Vier bijzondere mijlpalen met passende muzikale begeleiding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
            Mister DJ bedrijfsfeest drive in show - Prijzen op maat
          </h2>
          <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto text-lg">
            Wij zijn bekend met vrijwel elke feestlocatie in Brabant en ver daarbuiten. Al deze locaties toveren we op een unieke manier om tot een feestlocatie op maat voor je bedrijf. Daarbij horen ook prijzen op maat. Om je alvast een idee te geven van hoe een DJ drive in show van Mister DJ eruit ziet, hebben we hieronder enkele voorbeeldshows op een rijtje gezet. Deze kunnen als basis dienen voor jullie unieke bedrijfsfeest.
          </p>
          <PricingTables />
          <div className="text-center mt-8">
            <p className="text-gray-700 text-lg">
              Meer weten over de Mister DJ bedrijfsfeest drive in show en wat er mogelijk is? Neem dan vrijblijvend contact op of vraag direct een offerte aan.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
            Wat Onze Zakelijke Klanten Zeggen
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic mb-4">
                "Professioneel, flexibel en perfecte muziekkeuze voor ons personeelsfeest.
                Alle leeftijden genoten van de muziek!"
              </p>
              <p className="font-bold text-[#1A2C4B]">- Philips Innovation Services</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic mb-4">
                "De DJ begreep precies de sfeer die wij wilden. Van netwerk borrel tot dansfeest,
                alles klopte."
              </p>
              <p className="font-bold text-[#1A2C4B]">- ASML Veldhoven</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#D4AF37] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-700 italic mb-4">
                "Zakelijke aanpak, duidelijke communicatie en geweldig entertainment.
                Zeker een aanrader voor corporate events!"
              </p>
              <p className="font-bold text-[#1A2C4B]">- VDL Groep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
              Vraag Een Offerte Aan
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Ontvang binnen 24 uur een offerte op maat voor uw bedrijfsfeest, personeelsfeest of zakelijk evenement.
            </p>
            <ContactForm variant={variant} eventType="bedrijfsfeest" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#1A2C4B] text-white py-12 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Maak Van Uw Bedrijfsfeest Een Succes
        </h3>
        <p className="text-xl mb-6">
          Bel voor een vrijblijvend gesprek over de mogelijkheden
        </p>
        <a
          href="tel:+31408422594"
          className="inline-block bg-[#00AEEF] hover:bg-[#0096D6] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          +31 (0) 40 8422594
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default BedrijfsfeestDJPage;
