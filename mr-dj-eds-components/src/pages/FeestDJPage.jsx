import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import ContactForm from '../components/Organisms/ContactForm.jsx';
import PricingTables from '../components/Organisms/PricingTables.jsx';
import { Icon } from '../icons/index.jsx';

const FeestDJPage = ({ variant = 'A' }) => {
  // Variant-specific CTA text
  const ctaPrimaryText = variant === 'B' ? 'Boek Nu' : 'Bekijk Video';
  const ctaSecondaryText = variant === 'B' ? 'Check Beschikbaarheid' : 'Vraag Prijs Aan';

  const breadcrumbs = createServiceBreadcrumbs('Feest DJ', '/feest-dj');
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema(breadcrumbs));

  return (
    <div className="FeestDJPage">
      <Helmet>
        <title>Mister DJ op je verjaardag - 100% Dansgarantie | Feest DJ Huren</title>
        <meta
          name="description"
          content="DJ inhuren voor je verjaardag? Boek dan de complete drive in show van Mr. DJ en ga heel de avond los met je vrienden op de meest dampende beats. Complete DJ show met licht, geluid en professionele DJ voor verjaardagen, carnaval, schoolfeesten en meer!"
        />
        <meta name="keywords" content="feest dj, verjaardag dj, jubileum dj, party dj, dj huren, carnaval dj, schoolfeest dj, drive in show" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Feest DJ Service",
              "provider": {
                "@type": "Organization",
                "name": "Mr. DJ",
                "url": "https://mr-dj.sevensa.nl"
              },
              "serviceType": "Party DJ Services",
              "areaServed": "Nederland",
              "offers": {
                "@type": "Offer",
                "priceRange": "€395-€1095"
              }
            }
          `}
        </script>
        <script type="application/ld+json">{breadcrumbSchema}</script>
      </Helmet>

      <Header />

      <HeroSection
        title="De Perfecte DJ Voor Elk Feest"
        subtitle="Van intieme verjaardagen tot grote jubilea - wij zorgen voor de ultieme feestsfeer"
        ctaPrimaryText={ctaPrimaryText}
        ctaSecondaryText={ctaSecondaryText}
        backgroundImage="/images/events/hero-feest-dj.webp"
        variant={variant}
      />

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
              Mister DJ Drive In Show - 100% Dansgarantie
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Heb je iets te vieren en wil je het groots aanpakken? Ga dan voor Brabantse gezelligheid met de Mister DJ drive in show. Mister DJ verzorgde in meer dan 15 jaar tijd al meer dan 2500 geslaagde complete DJ shows. Al onze drive in shows zijn uniek, maar een ding is altijd zeker: de voetjes gaan van de vloer en het dak gaat eraf!
            </p>
            <p className="text-lg text-gray-700">
              Door de aderen van onze DJ's stroomt Brabants bloed. Daardoor weten ze als geen ander hoe ze iedere locatie moeten omtoveren tot een dampende feestzaal waar iedereen losgaat. Soms betekent dit dat er lekker wordt doorgedraaid met opzwepende techno, soms draaien we veel Michael Jackson omdat je oma zo graag moonwalkt en weer een andere keer zijn het vooral Nederlandstalige klassiekers die jullie met z'n allen meezingen. Onze DJ's draaien allround en passen zich aan de avond en jullie wensen aan.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-5xl mb-3">🎂</div>
              <h3 className="font-bold text-[#1A2C4B]">Verjaardagen</h3>
              <p className="text-sm text-gray-600 mt-2">Van Sweet 16 tot 50+</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎭</div>
              <h3 className="font-bold text-[#1A2C4B]">Carnaval</h3>
              <p className="text-sm text-gray-600 mt-2">Brabantse gezelligheid</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-bold text-[#1A2C4B]">Schoolfeesten</h3>
              <p className="text-sm text-gray-600 mt-2">Geslaagde feesten</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🚗</div>
              <h3 className="font-bold text-[#1A2C4B]">Drive-in Shows</h3>
              <p className="text-sm text-gray-600 mt-2">Complete DJ show</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Drive In Show */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6 text-center">
              Onze Complete Drive In Show
            </h2>
            <p className="text-xl text-gray-700 mb-12 text-center">
              Mister DJ levert nooit half werk. Dat wil zeggen dat wij iedere show op ieder feest of evenement tot helemaal verzorgen met:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 flex items-center gap-3">
                  <Icon name="icon-headphones" size={28} className="text-[#00AEEF]" />
                  Persoonlijke Mister DJ
                </h3>
                <p className="text-gray-700">
                  Niets is zo persoonlijk als een goed feestje. Dit alles en meer bespreek je ruim van te voren, nog voordat je definitief boekt, met je persoonlijke Mister DJ. Aan de hand van een uitgebreide vragenlijst neemt hij je mee de avond door, zodat alles tot in de puntjes is voorbereid.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 flex items-center gap-3">
                  <Icon name="icon-volume" size={28} className="text-[#00AEEF]" />
                  Muziek, Licht en Geluid
                </h3>
                <p className="text-gray-700">
                  Professionele apparatuur afgestemd op het aantal gasten en de locatie. Moving heads, LED bars en lasers zorgen voor een professionele uitstraling met dampende sfeer.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 flex items-center gap-3">
                  <Icon name="icon-refresh" size={28} className="text-[#00AEEF]" />
                  Altijd Een Reserve DJ
                </h3>
                <p className="text-gray-700">
                  Mocht je persoonlijke DJ onverhoopt verhinderd zijn, dan hebben we altijd een stand-in DJ klaarstaan. Deze is volledig op de hoogte van jullie voorkeuren en alle gemaakte afspraken.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 flex items-center gap-3">
                  <span className="text-2xl">💯</span>
                  100% Dansgarantie
                </h3>
                <p className="text-gray-700">
                  Door de aderen van onze DJ's stroomt Brabants bloed. Ze weten als geen ander hoe ze iedere locatie moeten omtoveren tot een dampende feestzaal waar iedereen losgaat!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
            Feest DJ Pakketten
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Kies het pakket dat past bij jouw feest. Alle pakketten zijn volledig aanpasbaar!
          </p>
          <PricingTables highlightPackage="Brons" />

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-[#00AEEF] bg-opacity-10 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4 text-center">
                Populaire Extra Opties
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Icon name="icon-sax" size={28} className="text-[#D4AF37]" />
                  <div>
                    <h4 className="font-bold text-[#1A2C4B]">DJ + Saxofonist (1 uur)</h4>
                    <p className="text-gray-700 text-sm">+€250 - Live saxofoon tijdens hoogtepunt</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="icon-camera" size={28} className="text-[#00AEEF]" />
                  <div>
                    <h4 className="font-bold text-[#1A2C4B]">Photobooth (3 uur)</h4>
                    <p className="text-gray-700 text-sm">+€400 - Met props en direct print</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="icon-sparkles" size={28} className="text-[#D4AF37]" />
                  <div>
                    <h4 className="font-bold text-[#1A2C4B]">CO2 Jets</h4>
                    <p className="text-gray-700 text-sm">+€150 - Spectaculaire effecten</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="icon-dancer" size={28} className="text-[#1A2C4B]" />
                  <div>
                    <h4 className="font-bold text-[#1A2C4B]">LED Dansvloer (4x4m)</h4>
                    <p className="text-gray-700 text-sm">+€350 - Verlichte dansvloer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Birthday Parties Section */}
      <section className="py-16 bg-white" id="verjaardag">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎂</div>
              <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
                DJ Verjaardag Huren
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Ben je bijna jarig en wil je van je verjaardag dit jaar een onvergetelijk topfeest maken? Doe dan eens gek en huur Mister DJ in voor je verjaardagsfeest. Met onze complete drive in show toveren we iedere ruimte om tot een dampende feestlocatie waar jij en je vrienden, familie, buren en kennissen de hele avond los zullen gaan. Daarbij kan alles, zelfs een lege dansvloer (heel even dan, voor jouw eigen ingestudeerde openingsdans bijvoorbeeld).
              </p>
              <p className="text-lg text-gray-700">
                Ben je klaar voor het verjaardagsfeest van je leven? Neem dan vrijblijvend contact op voor een offerte of plan een afspraak met jouw persoonlijke Mr. DJ.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Mister DJ op je verjaardag - 100% Dansgarantie
                </h3>
                <p className="text-gray-700 mb-4">
                  Als rasechte Brabanders weten de DJ's van Mister DJ als geen ander hoe je een feestje bouwt. Dat begint bij oerdegelijke, professionele apparatuur, maar gaat veel verder dan dat. Dankzij de meer dan 15 jaar lange ervaring op meer dan 2500 geslaagde feestjes voelen onze DJ's de sfeer feilloos aan.
                </p>
                <p className="text-gray-700">
                  Een Mister DJ begint rustig met relaxte muziek, zodat je gasten jou kunnen feliciteren en gezellig kunnen bijpraten. Wanneer de stemming er lekker in zit, gaan we los op de muziek waar jullie van houden. Je muziekkeuze en nog veel meer geef je ruim van te voren door aan je persoonlijke Mister DJ in een persoonlijke gesprek.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Professionele drive in show op een verjaardag
                </h3>
                <p className="text-gray-700 mb-4">
                  Mister DJ levert geen half werk. Dat wil zeggen dat wij jouw knalfeest tot in de puntjes verzorgen met een complete drive in show: Persoonlijke verjaardags-DJ, muziek, licht en geluid afgestemd op het aantal gasten en de locatie, altijd een reserve DJ, 100% Dansgarantie en oneindig veel extra mogelijkheden!
                </p>
                <p className="text-gray-700">
                  Deze show kunnen we bij jouw thuis installeren, maar ook op locatie. Wij zijn bekend met vrijwel elke feestlocatie in Brabant en ver daarbuiten.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                Speciale Jubileum Feesten
              </h3>
              <p className="text-gray-700 mb-4">
                Wij hebben het al vaak meegemaakt. Ook al worden ze nog zo oud en houden de mensen die komen 'eigenlijk helemaal niet van dansen', de voetjes gaan altijd van de vloer!
              </p>
              <p className="text-gray-700">
                Wij stemmen onze show namelijk helemaal af op de leeftijd van jou en je gasten. Zo kunnen we bijvoorbeeld speciale Sweet-sixteen-feestjes bouwen en hebben we iets bijzonders voor 18e, 20e, 25e 30e, 40e, en 50e verjaardagen. Ook als je nog ouder wordt, is dat geen probleem, desnoods komen we draaien bij de bejaardensoos! Of wat dacht je van een feest omdat je samen 50 wordt? Alles kan!
              </p>
            </div>

            <div className="bg-[#00AEEF] bg-opacity-10 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                Alles kan met Mr. DJ op je verjaardag
              </h3>
              <p className="text-gray-700 mb-4">
                Je kunt het zo gek niet bedenken, of het kan met Mr. DJ op je verjaardagsfeest. Denk aan:
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Een spectaculaire lasershow
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Verschillende zangers en zangeressen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Ervaren partyfotograaf
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Confettikanon
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Lichtgevende dansvloer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Grote spiegelbollen
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Carnaval Section */}
      <section className="py-16 bg-gray-50" id="carnaval">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
                Carnaval DJ Huren - Alaaf!
              </h2>
              <p className="text-xl text-gray-700">
                Is het bijna carnaval of heb je gewoon zin om met z'n allen verkleed te hossen en de polonaise te dansen? Boek dan onze carnaval DJ show! Als rasechte Brabanders weten we als geen ander hoe je de hele tent van links naar rechts krijgt: met een flinke dosis naadloos aan elkaar gedraaide carnavalsmuziek. Zo veranderen we iedere locatie in een dampende feesttent waar jij met je vrienden de hele avond los kunt gaan. Tot 's nachts na tweeën!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Complete Carnaval Drive In Show
                </h3>
                <p className="text-gray-700 mb-4">
                  Mister DJ levert geen half werk, want dat zit niet in onze aard. Nee, wij zijn anders geaard en voorzien in een complete drive in show. Het enige wat je nodig hebt is een ruimte en een stopcontact! Wij bouwen ons feest helemaal naar jouw wensen op met altijd:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">✓</span>
                    Persoonlijke en professionele carnavals DJ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">✓</span>
                    Muziek, licht en geluid afgestemd het aantal personen en de locatie
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">✓</span>
                    Altijd een reserve DJ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">✓</span>
                    100% Hosgarantie
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">✓</span>
                    Oneindig veel extra mogelijkheden!
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Het Hele Jaar Door Carnaval
                </h3>
                <p className="text-gray-700 mb-4">
                  Natuurlijk beginnen de echte carnavalsfeesten op de elfde van de elfde en stoppen we officieel op Aswoensdag, maar waarom zou het niet het hele jaar door carnaval kunnen zijn? Voor ons is een datum maar een getal en we vinden dat je gewoon het hele jaar door los moet kunnen gaan. Je gaat toch geen jaar achter je sanseveria zitten wachten tot het weer echt carnaval is?
                </p>
                <p className="text-gray-700">
                  Mister DJ viert het hele jaar door carnaval, ook bij themafeesten. Bovendien verzorgen we dit uitbundige volksfeest ook buiten Brabant en Limburg. De Brabantse gezelligheid nemen we gewoon mee de bus in!
                </p>
              </div>
            </div>

            <div className="bg-[#D4AF37] bg-opacity-10 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                Alles kan met Mister DJ op een carnavalsfeest
              </h3>
              <p className="text-gray-700 mb-4">
                Bij carnaval vieren we de zotheid en dat is bij een Mister DJ carnavals drive in show niet anders. Je kunt het namelijk zo gek maken als je wilt. Onze standaardshows, inclusief professionele DJ en apparatuur, zijn volledig te upgraden met alles wat je kunt bedenken. Wat dacht je bijvoorbeeld van een lichtgevende dansvloer? Of een groot confettikanon, inclusief kilo's confetti? Daarnaast zijn bij al onze shows de volgende elementen bij te boeken:
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  Een spectaculaire lasershow
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  Verschillende carnavals zanger(es)s(en) of een topsaxofonist
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  Ervaren partyfotograaf
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  Grote tv-schermen (leuk voor live foto's)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  Grote spiegelbollen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✓</span>
                  DJ in een speciaal kostuum
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* School Parties Section */}
      <section className="py-16 bg-white" id="schoolfeest">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
                DJ Schoolfeest Inhuren - Voor Een Geslaagd Feest
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Het hele jaar kijken jullie er al naar uit: het schoolfeest met DJ! Het is het moment waarop alle vriendjes en vriendinnetjes hun meest kekke moves aan elkaar laten zien en waarop de leraren ineens ook soepele heupen blijken te hebben.
              </p>
              <p className="text-lg text-gray-700">
                De DJ's van Mister DJ worden daarom maar al te graag geboekt voor schoolfeesten en examenfeesten. Met hun complete drive in show, inclusief professionele draaitafel, licht en geluid, draaien ze de hele onvergetelijke avond aan elkaar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Een Schoolfeest Waarbij Het Dak Eraf Gaat
                </h3>
                <p className="text-gray-700 mb-4">
                  Bij Mister DJ staat een ding voorop: dat het beregezellig is! Wij stonden in meer dan 15 jaar al op meer dan 2500 geslaagde feestjes en weten als geen ander hoe we alle leerlingen en docenten op de dansvloer moeten krijgen: met opzwepende tunes die perfect aansluiten bij de muzieksmaak van nu en af en toe ook wel een beetje bij die van vroeger.
                </p>
                <p className="text-gray-700">
                  Al onze DJ's draaien allround muziek en zijn goed op de hoogte van de hits onder de jeugd. Ze draaien hoe dan ook het dak eraf!
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Professioneel & Verantwoord
                </h3>
                <p className="text-gray-700 mb-4">
                  Een goede voorbereiding is het halve werk. Daarom spreekt jouw persoonlijke Mister DJ ruim voorafgaand aan het schoolfeest graag met je af om alles door te nemen. Aan de hand van een uitgebreide vragenlijst wil hij alles van de school en haar leerlingen te weten komen.
                </p>
                <p className="text-gray-700">
                  Zijn er bijvoorbeeld geloofsovertuigingen en kunnen we sommige nummers beter niet draaien? Of hebben jullie een schoollied dat zeker ook gedraaid moet worden? Door dit alles goed op een rijtje te zetten wordt het een leuk, maar ook een verantwoord feest.
                </p>
              </div>
            </div>

            <div className="bg-[#00AEEF] bg-opacity-10 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                Alles kan met Mister DJ op een schoolfeest of examenfeest
              </h3>
              <p className="text-gray-700 mb-4">
                Onze DJ show kan overal worden opgebouwd. Dit kan dus in de schoolkantine zijn, maar een andere locatie is ook mogelijk. Wij zijn goed bekend met vrijwel elke feestlocatie in de buurt van Eindhoven, Tilburg, Breda, Den Bosch, Weert en ver daarbuiten. Verder is ook alles mogelijk en kunnen wij onze show helemaal aanpassen aan jullie wensen. Wil de directeur bijvoorbeeld een speech geven om alle geslaagden te feliciteren? Of wil je een kort optreden van een paar leerlingen tussendoor? Je kunt het zo gek niet bedenken, of wij kunnen het regelen!
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Professionele zanger(es) of saxofonist
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Partyfotograaf voor onvergetelijke momenten
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Lichtgevende dansvloer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Speeches en optredens van leerlingen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  Schoollied en speciale wensen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00AEEF]">✓</span>
                  100% Dansgarantie
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Drive-in Show Section */}
      <section className="py-16 bg-gray-50" id="drive-in-show">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
                Drive In Show Huren
              </h2>
              <p className="text-xl text-gray-700">
                Heb je iets te vieren en wil je het groots aanpakken? Ga dan voor Brabantse gezelligheid met de Mister DJ drive in show. Bij Mister DJ boek je een complete show, inclusief de beste kwaliteit DJ-apparatuur, geluidsinstallatie en lichtshow. Deze kan op iedere locatie in Brabant en ver daarbuiten worden geinstalleerd.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4 text-center">
                DJ Show Met Apparatuur Voor Ieder Feest
              </h3>
              <p className="text-gray-700 mb-6 text-center">
                Bij Mister DJ boek je een complete show, inclusief de beste kwaliteit DJ-apparatuur, geluidsinstallatie en lichtshow. Zo kun je overal waar je maar wilt een onvergetelijk topfeest vieren met dampende beats. Denk bijvoorbeeld aan:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">💍</div>
                  <p className="font-bold text-[#1A2C4B]">Bruiloften</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎂</div>
                  <p className="font-bold text-[#1A2C4B]">Verjaardagen</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎓</div>
                  <p className="font-bold text-[#1A2C4B]">Schoolfeesten</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎭</div>
                  <p className="font-bold text-[#1A2C4B]">Carnaval</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-bold text-[#1A2C4B]">Jubilea</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">💼</div>
                  <p className="font-bold text-[#1A2C4B]">Zakelijke Evenementen</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Professionele en Persoonlijke DJ
                </h3>
                <p className="text-gray-700 mb-4">
                  Niets is zo persoonlijk als een goed feestje. De ene muziek zal bij sommige feestbeesten de oren doen klapperen, terwijl anderen juist in slaap vallen bij te weinig beats per minuut. En niet alleen de muziek is belangrijk. Wat dacht je bijvoorbeeld van passende lichteffecten? Bij hoge ruimtes komen lasers bijvoorbeeld beter tot hun recht. Ook een goede verdeling van de zitplaatsen is belangrijk.
                </p>
                <p className="text-gray-700">
                  Dit alles en meer bespreek je ruim van te voren, nog voordat je definitief boekt, met je persoonlijke Mister DJ. Aan de hand van een uitgebreide vragenlijst neemt hij je mee de avond door, zodat alles tot in de puntjes is voorbereid. Zo hoef je op de avond zelf alleen nog te genieten van je feest!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-4">
                  Drive In Show Met Veel Extra's
                </h3>
                <p className="text-gray-700 mb-4">
                  Bij onze drive shows is niets te gek. Alles is mogelijk. Wat dacht je bijvoorbeeld van een lichtgevende dansvloer met confettikanon (ook leuk bij carnaval) dat afgaat wanneer het grote moment is aangebroken? Of boek een partyfotograaf die alle leuke momenten vastlegt. Denk verder aan speciale en unieke toevoegingen zoals:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-[#00AEEF]">✓</span>
                    Topsaxofonist Leslie Moore
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00AEEF]">✓</span>
                    Een spectaculaire lasershow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00AEEF]">✓</span>
                    Verschillende zangers en zangeressen
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00AEEF]">✓</span>
                    Grote tv-schermen (leuk voor speciale foto's)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1A2C4B] mb-4 text-center">
              Vraag Direct Een Offerte Aan
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Vul het formulier in en ontvang binnen 24 uur een offerte op maat voor jouw feest.
            </p>
            <ContactForm variant={variant} eventType="feest" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#D4AF37] text-white py-12 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Maak Van Je Feest Een Onvergetelijke Avond!
        </h3>
        <p className="text-xl mb-6">
          Bel direct voor een vrijblijvend gesprek
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

export default FeestDJPage;
