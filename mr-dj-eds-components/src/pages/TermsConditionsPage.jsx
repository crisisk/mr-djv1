import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';

const TermsConditionsPage = () => {
  return (
    <div className="TermsConditionsPage bg-gray-50">
      <Helmet>
        <title>Algemene Voorwaarden | Mr. DJ</title>
        <meta
          name="description"
          content="Algemene voorwaarden van Mr. DJ. Lees hier alle voorwaarden voor het boeken van een DJ voor uw bruiloft, bedrijfsfeest of feest."
        />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A2C4B] to-[#00AEEF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Algemene Voorwaarden</h1>
            <p className="text-xl text-white/90">
              Voorwaarden voor DJ Services van Mr. DJ
            </p>
            <p className="text-sm text-white/80 mt-4">
              Laatste update: Oktober 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* 1. Algemeen */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">📋</span>
                1. Algemeen
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en
                  overeenkomsten tussen Mr. DJ (hierna: "opdrachtnemer") en de opdrachtgever, tenzij
                  schriftelijk anders is overeengekomen.
                </p>

                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 mt-6">Bedrijfsgegevens</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Mr. DJ</strong></p>
                  <p className="mb-2">Kapteijnlaan 17</p>
                  <p className="mb-2">Veldhoven, Nederland</p>
                  <p className="mb-2">Telefoon: <a href="tel:+31408422594" className="text-[#00AEEF] hover:underline">040-8422594</a></p>
                  <p className="mb-2">E-mail: <a href="mailto:[email protected]" className="text-[#00AEEF] hover:underline">[email protected]</a></p>
                  <p>KVK-nummer: [KVK_NUMMER]</p>
                </div>

                <p className="mt-4 mb-4">
                  Door het accepteren van een offerte of het ondertekenen van een overeenkomst verklaart
                  de opdrachtgever bekend te zijn met deze algemene voorwaarden en deze te accepteren.
                </p>
              </div>
            </div>

            {/* 2. Offertes en totstandkoming overeenkomst */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">📝</span>
                2. Offertes en Totstandkoming Overeenkomst
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">2.1</span>
                    <span>Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders vermeld.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">2.2</span>
                    <span>Een overeenkomst komt tot stand op het moment dat de opdrachtgever de offerte
                    schriftelijk (per e-mail of ondertekend) heeft geaccepteerd en het aanbetaling is voldaan.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">2.3</span>
                    <span>Mondeling gedane toezeggingen zijn pas geldig na schriftelijke bevestiging door opdrachtnemer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">2.4</span>
                    <span>Opdrachtnemer behoudt zich het recht voor om zonder opgaaf van redenen een
                    opdracht te weigeren.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Prijzen en betaling */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">💶</span>
                3. Prijzen en Betaling
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.1</span>
                    <span>Alle prijzen zijn in euro's en inclusief BTW, tenzij anders vermeld.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.2</span>
                    <span>De prijzen zijn gebaseerd op de in de offerte vermelde datum, locatie, duur en diensten.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.3</span>
                    <span><strong>Aanbetaling:</strong> Bij bevestiging van de boeking dient 30% van het totaalbedrag
                    als aanbetaling te worden voldaan binnen 14 dagen.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.4</span>
                    <span><strong>Restbetaling:</strong> Het resterende bedrag (70%) dient uiterlijk 14 dagen
                    voor de evenementdatum te zijn voldaan.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.5</span>
                    <span>Bij niet-tijdige betaling behoudt opdrachtnemer zich het recht voor om de opdracht
                    te annuleren zonder restitutie van de aanbetaling.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.6</span>
                    <span>Betaling kan geschieden via bankoverschrijving of iDEAL. Contante betaling op de
                    dag zelf is niet mogelijk.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">3.7</span>
                    <span>Bij overschrijding van de overeengekomen eindtijd kunnen extra kosten in rekening
                    worden gebracht van €75,- per aangevangen uur, tenzij vooraf anders is afgesproken.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Annulering en wijzigingen */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🔄</span>
                4. Annulering en Wijzigingen
              </h2>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">4.1 Annulering door opdrachtgever</h3>
                <p className="mb-3">
                  Bij annulering door de opdrachtgever gelden de volgende voorwaarden:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Meer dan 6 maanden voor de datum:</strong> 25% van het totaalbedrag</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>3-6 maanden voor de datum:</strong> 50% van het totaalbedrag</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>1-3 maanden voor de datum:</strong> 75% van het totaalbedrag</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Minder dan 1 maand voor de datum:</strong> 100% van het totaalbedrag</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 mt-6">4.2 Wijziging van datum</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3">•</span>
                    <span>Eenmalige wijziging van de datum is kosteloos indien minimaal 3 maanden van
                    tevoren aangevraagd en onder voorbehoud van beschikbaarheid.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3">•</span>
                    <span>Bij een tweede wijziging of wijziging binnen 3 maanden worden administratiekosten
                    van €50,- in rekening gebracht.</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3 mt-6">4.3 Annulering door opdrachtnemer</h3>
                <p className="mb-3">
                  Opdrachtnemer kan de overeenkomst annuleren bij overmacht (zie artikel 7). In dit geval
                  vindt volledige restitutie van reeds betaalde bedragen plaats. Verdere aansprakelijkheid
                  is uitgesloten.
                </p>
              </div>
            </div>

            {/* 5. Uitvoering van de opdracht */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🎵</span>
                5. Uitvoering van de Opdracht
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.1</span>
                    <span>Opdrachtnemer voert de werkzaamheden uit conform de overeengekomen diensten
                    zoals vermeld in de offerte of overeenkomst.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.2</span>
                    <span>Opdrachtnemer is gerechtigd om voor de uitvoering van bepaalde werkzaamheden
                    derden in te schakelen.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.3</span>
                    <span>De DJ arriveert minimaal 1-2 uur voor aanvang van het programma voor opbouw
                    van de apparatuur (tenzij anders afgesproken).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.4</span>
                    <span>Opdrachtgever verstrekt tijdig alle benodigde informatie voor een goede uitvoering,
                    waaronder contactgegevens locatie, opbouwtijden, specifieke wensen en eventuele beperkingen.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.5</span>
                    <span>Muziekwensen kunnen vooraf worden doorgegeven. Opdrachtnemer streeft ernaar
                    deze te honoreren maar kan niet garanderen dat alle verzoeken worden uitgevoerd.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">5.6</span>
                    <span>Opdrachtnemer behoudt zich het recht voor om nummers te weigeren die niet
                    passen bij het evenement of die aanstootgevend zijn.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 6. Verplichtingen opdrachtgever */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">✅</span>
                6. Verplichtingen Opdrachtgever
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">De opdrachtgever zorgt voor:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.1</span>
                    <span><strong>Stroomvoorziening:</strong> Minimaal 1x geaard 16A stopcontact binnen
                    10 meter van de DJ-opstelling. Bij ontbreken hiervan kan de DJ de werkzaamheden weigeren.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.2</span>
                    <span><strong>Ruimte:</strong> Voldoende ruimte voor opstelling van DJ-apparatuur
                    (minimaal 3x2 meter) en vrije toegang tot deze ruimte.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.3</span>
                    <span><strong>Toegang:</strong> Tijdige toegang tot de locatie voor opbouw (conform afspraak)
                    en parkeergelegenheid dichtbij de locatie.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.4</span>
                    <span><strong>Informatie:</strong> Correcte informatie over locatie, adres, contactpersoon,
                    tijdschema en eventuele beperkingen qua geluidsniveau.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.5</span>
                    <span><strong>Veiligheid:</strong> Een veilige werkomgeving voor de DJ en bescherming
                    van de apparatuur tegen beschadiging of diefstal.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.6</span>
                    <span><strong>Catering:</strong> Bij evenementen langer dan 4 uur: eten en drinken
                    voor de DJ tijdens het evenement.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">6.7</span>
                    <span>Opdrachtgever is verantwoordelijk voor het verkrijgen van eventuele benodigde
                    vergunningen voor het evenement.</span>
                  </li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>Let op:</strong> Indien bovenstaande voorwaarden niet worden vervuld en de DJ
                    hierdoor niet of niet volledig kan optreden, blijft de betalingsverplichting van
                    opdrachtgever volledig van kracht.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Overmacht */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⚠️</span>
                7. Overmacht
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">7.1</span>
                    <span>Onder overmacht wordt verstaan: elke van de wil van opdrachtnemer onafhankelijke
                    omstandigheid die nakoming van de overeenkomst blijvend of tijdelijk verhindert.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">7.2</span>
                    <span>Overmacht omvat onder meer: ziekte van de DJ, verkeersongevallen, extreme
                    weersomstandigheden, stroomstoringen, brand, overheidsmaatregelen en pandemieën.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">7.3</span>
                    <span>Bij overmacht heeft opdrachtnemer het recht de overeenkomst te ontbinden zonder
                    schadevergoeding. Reeds betaalde bedragen worden volledig geretourneerd.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">7.4</span>
                    <span>Opdrachtnemer zal bij overmacht haar uiterste best doen om vervanging te regelen,
                    maar kan dit niet garanderen.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 8. Aansprakelijkheid */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⚖️</span>
                8. Aansprakelijkheid
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.1</span>
                    <span>Opdrachtnemer is niet aansprakelijk voor schade als gevolg van het niet of niet
                    volledig naleven van instructies door opdrachtgever of bezoekers.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.2</span>
                    <span>Opdrachtnemer is niet aansprakelijk voor schade aan apparatuur of letsel als
                    gevolg van omstandigheden waarop opdrachtnemer geen invloed heeft.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.3</span>
                    <span>Opdrachtgever is aansprakelijk voor schade aan apparatuur van opdrachtnemer
                    veroorzaakt door opdrachtgever, diens gasten of derden tijdens het evenement.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.4</span>
                    <span>De aansprakelijkheid van opdrachtnemer is beperkt tot het bedrag dat in het
                    desbetreffende geval wordt uitbetaald door de beroepsaansprakelijkheidsverzekering,
                    vermeerderd met het bedrag van het eigen risico.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.5</span>
                    <span>Opdrachtnemer is niet aansprakelijk voor indirecte schade, gevolgschade of
                    gederfde winst.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">8.6</span>
                    <span>Opdrachtnemer aanvaardt geen aansprakelijkheid voor gehoorschade bij bezoekers.
                    Het is de verantwoordelijkheid van opdrachtgever om gasten te wijzen op mogelijk gehoorrisico.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 9. Eigendomsrechten */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">©</span>
                9. Intellectueel Eigendom
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">9.1</span>
                    <span>Alle intellectuele eigendomsrechten met betrekking tot de diensten van opdrachtnemer
                    berusten bij opdrachtnemer of diens licentiegevers.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">9.2</span>
                    <span>Opdrachtgever verkrijgt uitsluitend de gebruiksrechten die voortvloeien uit de
                    overeenkomst of die schriftelijk worden toegekend.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">9.3</span>
                    <span>Foto's en video-opnames gemaakt tijdens het evenement mogen door opdrachtnemer
                    gebruikt worden voor promotiedoeleinden, tenzij opdrachtgever hier schriftelijk bezwaar tegen maakt.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">9.4</span>
                    <span>Opdrachtnemer is aangesloten bij Sena en Buma/Stemra voor het gebruik van
                    auteursrechtelijk beschermde muziek.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 10. Privacy en gegevensbescherming */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🔒</span>
                10. Privacy en Gegevensbescherming
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">10.1</span>
                    <span>Opdrachtnemer verwerkt persoonsgegevens conform de Algemene Verordening
                    Gegevensbescherming (AVG).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">10.2</span>
                    <span>Voor meer informatie over de verwerking van persoonsgegevens, zie onze
                    <a href="/privacy-policy" className="text-[#00AEEF] hover:underline ml-1">Privacyverklaring</a>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">10.3</span>
                    <span>Persoonsgegevens worden uitsluitend gebruikt voor de uitvoering van de overeenkomst
                    en niet gedeeld met derden zonder toestemming, behalve waar wettelijk verplicht.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 11. Klachten */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">📢</span>
                11. Klachten
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">11.1</span>
                    <span>Klachten over de uitvoering van de overeenkomst dienen binnen 7 dagen na het
                    evenement schriftelijk te worden gemeld aan opdrachtnemer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">11.2</span>
                    <span>Opdrachtnemer zal binnen 14 dagen na ontvangst van de klacht reageren en in
                    overleg met opdrachtgever naar een oplossing zoeken.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">11.3</span>
                    <span>Het indienen van een klacht ontslaat opdrachtgever niet van de betalingsverplichting.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 12. Toepasselijk recht en geschillen */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⚖️</span>
                12. Toepasselijk Recht en Geschillen
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">12.1</span>
                    <span>Op alle overeenkomsten tussen opdrachtnemer en opdrachtgever is Nederlands recht
                    van toepassing.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">12.2</span>
                    <span>Geschillen die voortvloeien uit of verband houden met de overeenkomst zullen
                    worden voorgelegd aan de bevoegde rechter in het arrondissement waar opdrachtnemer
                    is gevestigd, tenzij wettelijke bepalingen anders voorschrijven.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">12.3</span>
                    <span>Partijen zullen eerst in onderling overleg proberen tot een oplossing te komen
                    alvorens een geschil aan de rechter voor te leggen.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 13. Slotbepalingen */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">📌</span>
                13. Slotbepalingen
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">13.1</span>
                    <span>Deze algemene voorwaarden zijn gedeponeerd bij de Kamer van Koophandel en zijn
                    te raadplegen op de website van opdrachtnemer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">13.2</span>
                    <span>Opdrachtnemer behoudt zich het recht voor deze algemene voorwaarden te wijzigen.
                    Wijzigingen gelden na publicatie op de website.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">13.3</span>
                    <span>Op reeds gesloten overeenkomsten blijven de voorwaarden van toepassing die golden
                    ten tijde van het sluiten van de overeenkomst.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-3 font-bold">13.4</span>
                    <span>Indien één of meerdere bepalingen van deze algemene voorwaarden nietig zijn of
                    vernietigd worden, blijven de overige bepalingen van kracht.</span>
                  </li>
                </ul>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Versie:</strong> Oktober 2024
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Laatste wijziging:</strong> Oktober 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#0096D6] text-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <span className="mr-3">📧</span>
                Vragen over deze voorwaarden?
              </h2>
              <p className="mb-6">
                Heeft u vragen over deze algemene voorwaarden? Neem gerust contact met ons op.
                We helpen u graag verder!
              </p>
              <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <p className="flex items-center gap-3">
                  <span className="text-2xl">🏢</span>
                  <span><strong>Mr. DJ</strong></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span>Kapteijnlaan 17, Veldhoven</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <a href="tel:+31408422594" className="hover:underline">040-8422594</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <a href="mailto:[email protected]" className="hover:underline">[email protected]</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditionsPage;
