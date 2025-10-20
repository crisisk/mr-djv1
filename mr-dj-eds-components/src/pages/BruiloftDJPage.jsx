import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import ContactForm from '../components/Organisms/ContactForm.jsx';
import PricingTables from '../components/Organisms/PricingTables.jsx';
import Button from '../components/Atoms/Buttons.jsx';
import { Icon } from '../icons/index.jsx';

const BruiloftDJPage = ({ variant = 'A' }) => {
  // Variant-specific CTA text
  const ctaPrimaryText = variant === 'B' ? 'Boek Nu' : 'Bekijk Video';
  const ctaSecondaryText = variant === 'B' ? 'Check Beschikbaarheid' : 'Vraag Prijs Aan';

  const breadcrumbs = createServiceBreadcrumbs('Bruiloft DJ', '/bruiloft-dj');
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema(breadcrumbs));

  return (
    <div className="BruiloftDJPage">
      <Helmet>
        <title>Mister DJ op jullie bruiloft – 100% dansgarantie</title>
        <meta
          name="description"
          content="Op zoek naar een bruiloft DJ? Zeg ook ja tegen Mister DJ en je bent gegarandeerd van een perfect geregeld knallend trouwfeest. Niets is te gek!"
        />
        <meta name="keywords" content="bruiloft dj, wedding dj, dj met saxofoon, bruiloft entertainment, live muziek bruiloft, trouwfeest dj" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Bruiloft DJ Service",
              "provider": {
                "@type": "Organization",
                "name": "Mr. DJ",
                "url": "https://mr-dj.sevensa.nl"
              },
              "serviceType": "DJ Services",
              "areaServed": "Nederland",
              "offers": {
                "@type": "Offer",
                "priceRange": "€495-€1295"
              }
            }
          `}
        </script>
        <script type="application/ld+json">{breadcrumbSchema}</script>
      </Helmet>

      <Header />

      <HeroSection
        title="Mister DJ bruiloft drive in show huren"
        subtitle="De mooiste dag van je leven wordt nog mooier als je ook ja zegt tegen een bruiloft DJ van Mr. DJ. Wij garanderen al meer dan vijftien jaar professioneel verzorgde trouwfeesten op maat."
        ctaPrimaryText={ctaPrimaryText}
        ctaSecondaryText={ctaSecondaryText}
        backgroundImage="/images/events/hero-bruiloft-dj.webp"
        variant={variant}
      />

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 text-center">
              Met onze unieke Mister DJ bruiloft drive in show toveren we iedere locatie om tot volwaardige feestlocatie – Inclusief licht, geluid en een flinke dosis Brabantse nuchterheid gezelligheid.
            </p>

            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Jullie trouwfeest tot in de puntjes verzorgd met Mister DJ
            </h2>

            <p className="text-lg text-gray-700 mb-8 text-center">
              Je kijkt er lang naar uit en zult er nog zo veel langer aan terugdenken: jullie trouwdag. Daarom wil je die dag absoluut geen gedoe. Alles moet perfect professioneel geregeld zijn, ook het bruiloftsfeest. Mister DJ verzorgt de knallende afsluiter van jullie trouwdag tot in de puntjes met:
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4 text-primary">
                  <Icon name="icon-music" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">Jullie persoonlijke bruiloft DJ</h3>
                <p className="text-gray-700">
                  Alle muziekwensen en nog zoveel meer bespreek je ruim van te voren met je persoonlijke Mister DJ. In een ontspannen setting kunnen jullie dan precies aangeven hoe de avond eruit zal gaan zien en wat jullie van de trouwfeest DJ verwachten.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4 text-primary">
                  <Icon name="icon-music" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">Bruiloft muziek, licht en geluid</h3>
                <p className="text-gray-700">
                  Afgestemd op jullie wensen en de locatie. Een goede afstemming van het licht en het geluid op het aantal gasten en de grootte van de locatie is erg belangrijk. Ook op dit gebied denkt Mister DJ graag met je mee.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4 text-primary">
                  <Icon name="icon-refresh" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">Altijd een reserve DJ</h3>
                <p className="text-gray-700">
                  Ook een Mister DJ kan wel eens een griepje krijgen. Dan zal hij niet met een doos tissues op de draaitafel tussen je gasten gaan staan, maar krijgen jullie gewoon een verse stand-in Mr. DJ die ook op de hoogte is van al jullie wensen en voorkeuren.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-4xl mb-4 text-primary">
                  <Icon name="icon-badge" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">100% Dansgarantie</h3>
                <p className="text-gray-700">
                  Als rasechte Brabanders weten we als geen ander hoe je een feestje bouwt. We stemmen de muziek af op waar de gasten van houden. Niets is te gek, het kan allemaal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Dansgarantie Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Mister DJ geeft 100% dansgarantie
            </h2>

            <p className="text-lg text-gray-700 mb-6">
              Als rasechte Brabanders weten we als geen ander hoe je een feestje bouwt. Ons geheim geven we niet zomaar prijs, maar om alvast een tip van de sluier op te lichten: het draait om meer dan alleen professioneel licht en geluid. Net zo belangrijk is een goede aansluiting met ons publiek: jullie familie, vrienden en dierbaren.
            </p>

            <p className="text-lg text-gray-700">
              Daarom stemmen we de muziek af op waar de gasten van houden. Als oma bijvoorbeeld gek is op de moonwalk, draaien we af en toe een plaatje van Michael Jackson. Heb je fanatieke robotdansers in de familie? Geen probleem, doen we Kraftwerk of Daft Punk! Niets is te gek, het kan allemaal, zelfs als jullie met z'n allen als vogeltjes willen dansen…
            </p>
          </div>
        </div>
      </section>

      {/* Personal DJ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Jullie persoonlijke bruiloft DJ huren
            </h2>

            <p className="text-lg text-gray-700 mb-6">
              Alle muziekwensen en nog zoveel meer bespreek je ruim van te voren (en voordat je boekt) met je persoonlijke Mister DJ. In een ontspannen setting kunnen jullie dan precies aangeven hoe de avond eruit zal gaan zien en wat jullie van de trouwfeest DJ verwachten. Ook mag je de DJ alles vragen en zal hij jullie uitgebreid adviseren over hoe we jullie feest perfect kunnen organiseren.
            </p>

            <p className="text-lg text-gray-700">
              Voor dit gesprek vormt een uitgebreide vragenlijst de basis. Tijdens het gesprek zullen we deze doornemen.
            </p>
          </div>
        </div>
      </section>

      {/* Possibilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Met Mr. DJ op je bruiloft kan alles!
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Niets is te gek met Mister DJ op je trouwfeest. Willen jullie bijvoorbeeld eerst dineren met rustige muziek? Een romantische openingsdans inplannen en daarna met z'n allen los gaan op een lichtgevende dansvloer onder een wolk van confetti? Je kunt het zo gek niet verzinnen, wij staan overal voor open. Daarnaast kun je onze bruiloft drive in show helemaal upgraden met onder andere:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                <div className="text-3xl text-secondary">
                  <Icon name="icon-sax" size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B]">Topsaxofonist Leslie Moore</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                <div className="text-3xl text-secondary">
                  <Icon name="icon-sparkles" size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B]">Een spectaculaire lasershow</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                <div className="text-3xl text-secondary">
                  <Icon name="icon-microphone" size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B]">Verschillende zangers en zangeressen</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                <div className="text-3xl text-secondary">
                  <Icon name="icon-camera" size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B]">Ervaren partyfotograaf</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                <div className="text-3xl text-secondary">
                  <Icon name="icon-tv" size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2C4B]">Grote tv-schermen (leuk voor speciale foto's)</h3>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-700 mt-8 text-center">
              Meer weten over de Mister DJ bruiloft drive in show en wat er mogelijk is? Neem dan vrijblijvend contact op of vraag direct een offerte aan.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
            De Mister DJ trouwfeest show prijzen
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Een goede afstemming van het licht en het geluid op het aantal gasten en de grootte van de locatie is erg belangrijk. Ook op dit gebied denkt Mister DJ graag met je mee. Wij zijn namelijk bekend met vrijwel elke trouwlocatie in Brabant en ver daarbuiten.
          </p>
          <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
            Iedere bruiloft show van Mister DJ is maatwerk. Daarom maken we voor ieder bruidspaar graag een offerte op maat. Wil je direct een indicatie van de kosten ontvangen? Vraag dan nu gratis en vrijblijvend een offerte aan.
          </p>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Om je een idee te geven van wat er zoal mogelijk is hebben we hieronder enkele voorbeeldshows op een rijtje gezet. Deze kunnen als basis dienen voor jullie unieke feest.
          </p>
          <PricingTables highlightPackage="Zilver" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-12 text-center">
              Veelgestelde Vragen
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Wat betekent de 100% dansgarantie?
                </h3>
                <p className="text-gray-700">
                  Als rasechte Brabanders weten we als geen ander hoe je een feestje bouwt. We garanderen een volle dansvloer door de muziek perfect af te stemmen op jullie gasten. Van Michael Jackson voor oma tot Kraftwerk voor de robotdansers – niets is te gek!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Kunnen we onze eigen muziekwensen doorgeven?
                </h3>
                <p className="text-gray-700">
                  Absoluut! Alle muziekwensen bespreek je ruim van te voren (en voordat je boekt) met je persoonlijke Mister DJ. Voor dit gesprek vormt een uitgebreide vragenlijst de basis waarin we alles doornemen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Wat gebeurt er als de DJ ziek wordt?
                </h3>
                <p className="text-gray-700">
                  Ook een Mister DJ kan wel eens een griepje krijgen. Dan krijgen jullie gewoon een verse stand-in Mr. DJ die ook op de hoogte is van al jullie wensen en voorkeuren. Geen doos tissues op de draaitafel, maar gewoon professionele vervanging!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Is de saxofonist Leslie Moore beschikbaar?
                </h3>
                <p className="text-gray-700">
                  Topsaxofonist Leslie Moore kan als upgrade toegevoegd worden aan jullie bruiloft drive in show. Ook verschillende zangers en zangeressen, een spectaculaire lasershow en zelfs grote tv-schermen zijn mogelijk!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Kennen jullie onze trouwlocatie?
                </h3>
                <p className="text-gray-700">
                  Wij zijn bekend met vrijwel elke trouwlocatie in Brabant en ver daarbuiten. Daardoor weten we als geen ander hoe we deze locaties moeten omtoveren tot een flitsend decor voor de knallende afsluiter van jullie allermooiste dag.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                  Wat is maatwerk en hoe werkt de offerte?
                </h3>
                <p className="text-gray-700">
                  Iedere bruiloft show van Mister DJ is maatwerk. We stemmen licht en geluid af op het aantal gasten en de grootte van de locatie. Daarom maken we voor ieder bruidspaar graag een offerte op maat. Vraag nu gratis en vrijblijvend een offerte aan!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
              Vraag vrijblijvend een offerte aan
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Meer weten over de Mister DJ bruiloft drive in show en wat er mogelijk is? Neem vrijblijvend contact op of vraag direct een offerte aan. Vul het formulier in en ontvang binnen 24 uur een offerte op maat voor jullie bruiloft.
            </p>
            <ContactForm variant={variant} eventType="bruiloft" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#1A2C4B] to-[#00AEEF] text-white py-12 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Zeg ook ja tegen Mister DJ!
        </h3>
        <p className="text-xl mb-6">
          Gegarandeerd van een perfect geregeld knallend trouwfeest - Bel direct voor een vrijblijvend gesprek
        </p>
        <a
          href="tel:+31408422594"
          className="inline-block bg-[#D4AF37] hover:bg-[#C4A137] text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          +31 (0) 40 8422594
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default BruiloftDJPage;
