import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';

const PrivacyPolicyPage = () => {
  return (
    <div className="PrivacyPolicyPage">
      <Helmet>
        <title>Privacyverklaring | Mr. DJ</title>
        <meta name="description" content="Privacyverklaring van Mr. DJ. Wij respecteren uw privacy en behandelen uw persoonsgegevens zorgvuldig conform de AVG." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Header />

      <div className="bg-gradient-to-r from-[#1A2C4B] to-[#00AEEF] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Privacyverklaring
          </h1>
          <p className="text-xl text-white/90">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">1. Algemeen</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ, gevestigd aan Kapteijnlaan 17 te Veldhoven, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Contactgegevens:</h3>
              <p className="text-gray-700 mb-2"><strong>Naam:</strong> Mr. DJ</p>
              <p className="text-gray-700 mb-2"><strong>Adres:</strong> Kapteijnlaan 17, Veldhoven</p>
              <p className="text-gray-700 mb-2"><strong>Telefoonnummer:</strong> <a href="tel:0408422594" className="text-[#00AEEF] hover:underline">040-8422594</a></p>
              <p className="text-gray-700 mb-2"><strong>E-mail:</strong> <a href="mailto:[email protected]" className="text-[#00AEEF] hover:underline">[email protected]</a></p>
              <p className="text-gray-700"><strong>Website:</strong> <a href="https://mr-dj.sevensa.nl" className="text-[#00AEEF] hover:underline">mr-dj.sevensa.nl</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">2. Persoonsgegevens die wij verwerken</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ verwerkt uw persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt via ons contactformulier, per telefoon of e-mail.
            </p>
            <p className="text-gray-700 mb-3">Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Voor- en achternaam</li>
              <li>Telefoonnummer</li>
              <li>E-mailadres</li>
              <li>Adresgegevens (indien relevant voor levering/uitvoering)</li>
              <li>Gegevens over uw activiteiten op onze website</li>
              <li>Internetbrowser en apparaat type</li>
              <li>Bankrekeningnummer (alleen bij betalingen)</li>
              <li>Evenementdetails (datum, locatie, type feest)</li>
              <li>Muziekvoorkeuren en specifieke wensen</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">3. Met welk doel en op basis van welke grondslag wij persoonsgegevens verwerken</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ verwerkt uw persoonsgegevens voor de volgende doelen:
            </p>
            <div className="space-y-4">
              <div className="bg-white border-l-4 border-[#00AEEF] p-4">
                <h4 className="font-bold text-[#1A2C4B] mb-2">✓ Uitvoering van de overeenkomst</h4>
                <p className="text-gray-700">Het afhandelen van uw boeking, offerte-aanvraag en uitvoering van DJ-diensten</p>
              </div>
              <div className="bg-white border-l-4 border-[#00AEEF] p-4">
                <h4 className="font-bold text-[#1A2C4B] mb-2">✓ Communicatie</h4>
                <p className="text-gray-700">U te kunnen bellen of e-mailen indien dit nodig is voor de uitvoering van onze dienstverlening</p>
              </div>
              <div className="bg-white border-l-4 border-[#00AEEF] p-4">
                <h4 className="font-bold text-[#1A2C4B] mb-2">✓ Marketing</h4>
                <p className="text-gray-700">U te informeren over onze diensten en aanbiedingen (alleen met uw toestemming)</p>
              </div>
              <div className="bg-white border-l-4 border-[#00AEEF] p-4">
                <h4 className="font-bold text-[#1A2C4B] mb-2">✓ Website-analyse</h4>
                <p className="text-gray-700">Het analyseren van uw gedrag op de website om daarmee onze website te verbeteren</p>
              </div>
              <div className="bg-white border-l-4 border-[#00AEEF] p-4">
                <h4 className="font-bold text-[#1A2C4B] mb-2">✓ Betalingen</h4>
                <p className="text-gray-700">Het afhandelen van betalingen voor onze diensten</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">4. Geautomatiseerde besluitvorming</h2>
            <p className="text-gray-700">
              Mr. DJ neemt <strong>niet</strong> op basis van geautomatiseerde verwerkingen beslissingen over zaken die (aanzienlijke) gevolgen kunnen hebben voor personen. Het gaat hier om beslissingen die worden genomen door computerprogramma's of -systemen, zonder dat daar een mens tussen zit.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">5. Hoe lang we persoonsgegevens bewaren</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">📅</span>
                  <span><strong>Klantgegevens en boekingen:</strong> 7 jaar (conform fiscale wetgeving)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">📅</span>
                  <span><strong>Offertes (niet doorgegaan):</strong> 2 jaar</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">📅</span>
                  <span><strong>Nieuwsbrief/Marketing:</strong> Totdat u zich afmeldt of 3 jaar na laatste interactie</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00AEEF] mr-3">📅</span>
                  <span><strong>Websitebezoek gegevens (cookies):</strong> Maximaal 2 jaar</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">6. Delen van persoonsgegevens met derden</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ verkoopt uw gegevens <strong>NIET</strong> aan derden en verstrekt deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Met bedrijven die uw gegevens verwerken in onze opdracht, sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwelijkheid van uw gegevens.
            </p>
            <p className="text-gray-700 mb-3">Wij kunnen gegevens delen met:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Betalingsproviders</strong> - Voor het verwerken van betalingen</li>
              <li><strong>Websitehosting provider</strong> - Voor technische ondersteuning</li>
              <li><strong>Google Analytics</strong> - Voor websitestatistieken (geanonimiseerd)</li>
              <li><strong>E-mailproviders</strong> - Voor communicatie</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">7. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen in de browser van uw computer, tablet of smartphone.
            </p>
            <p className="text-gray-700 mb-4">
              Voor meer informatie over welke cookies wij gebruiken en waarom, zie onze <a href="/cookie-policy" className="text-[#00AEEF] hover:underline font-bold">Cookieverklaring</a>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">8. Gegevens inzien, aanpassen of verwijderen</h2>
            <p className="text-gray-700 mb-4">
              U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door Mr. DJ en heeft u het recht op gegevensoverdraagbaarheid.
            </p>
            <div className="bg-[#00AEEF]/10 border-2 border-[#00AEEF] p-6 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Uw Rechten onder de AVG:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>Recht op inzage</strong> - U kunt vragen welke gegevens wij van u hebben</li>
                <li>✓ <strong>Recht op rectificatie</strong> - U kunt vragen om correctie van onjuiste gegevens</li>
                <li>✓ <strong>Recht op verwijdering</strong> - U kunt vragen uw gegevens te verwijderen</li>
                <li>✓ <strong>Recht op beperking</strong> - U kunt vragen de verwerking te beperken</li>
                <li>✓ <strong>Recht op bezwaar</strong> - U kunt bezwaar maken tegen verwerking</li>
                <li>✓ <strong>Recht op overdraagbaarheid</strong> - U kunt uw gegevens opvragen in een gestructureerd formaat</li>
              </ul>
            </div>
            <p className="text-gray-700 mb-4">
              Om deze rechten uit te oefenen, kunt u contact met ons opnemen via <a href="mailto:[email protected]" className="text-[#00AEEF] hover:underline font-bold">[email protected]</a> of <a href="tel:0408422594" className="text-[#00AEEF] hover:underline font-bold">040-8422594</a>.
            </p>
            <p className="text-gray-700">
              Om er zeker van te zijn dat het verzoek tot inzage door u is gedaan, vragen wij u een kopie van uw identiteitsbewijs met het verzoek mee te sturen. Maak in deze kopie uw pasfoto, MRZ (machine readable zone, de strook met nummers onderaan het paspoort), paspoortnummer en Burgerservicenummer (BSN) zwart. Dit ter bescherming van uw privacy.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">9. Hoe wij persoonsgegevens beveiligen</h2>
            <p className="text-gray-700 mb-4">
              Mr. DJ neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-[#1A2C4B] mb-2">🔒 SSL-certificaat</h4>
                <p className="text-sm text-gray-700">Versleutelde verbinding (HTTPS)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-[#1A2C4B] mb-2">🔐 Beveiligde opslag</h4>
                <p className="text-sm text-gray-700">Gegevens worden veilig opgeslagen</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-[#1A2C4B] mb-2">👥 Beperkte toegang</h4>
                <p className="text-sm text-gray-700">Alleen geautoriseerd personeel</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-[#1A2C4B] mb-2">🛡️ Firewall bescherming</h4>
                <p className="text-sm text-gray-700">Technische beveiligingsmaatregelen</p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">10. Klachten</h2>
            <p className="text-gray-700 mb-4">
              Mocht u een klacht hebben over de verwerking van uw persoonsgegevens dan vragen wij u hierover direct contact met ons op te nemen. Komen wij er samen met u niet uit, dan vinden wij dit natuurlijk vervelend. U heeft altijd het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens, dit is de toezichthoudende autoriteit op het gebied van privacybescherming.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-[#1A2C4B] mb-3">Autoriteit Persoonsgegevens</h3>
              <p className="text-gray-700 mb-2">Postbus 93374</p>
              <p className="text-gray-700 mb-2">2509 AJ Den Haag</p>
              <p className="text-gray-700 mb-2">Telefoon: <a href="tel:0900-2002010" className="text-[#00AEEF] hover:underline">(070) 88 88 500</a></p>
              <p className="text-gray-700">Website: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">autoriteitpersoonsgegevens.nl</a></p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4">11. Wijzigingen privacyverklaring</h2>
            <p className="text-gray-700">
              Mr. DJ kan deze privacyverklaring aanpassen. Nieuwe versies worden altijd op onze website gepubliceerd. Wij raden u daarom aan om deze verklaring regelmatig te raadplegen, zodat u op de hoogte blijft van wijzigingen.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-[#1A2C4B] to-[#00AEEF] p-8 rounded-lg text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Vragen over deze privacyverklaring?</h3>
            <p className="mb-6">Neem gerust contact met ons op. Wij helpen u graag verder!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:0408422594" className="bg-[#D4AF37] hover:bg-[#C4A137] text-white px-8 py-3 rounded-lg font-bold transition">
                Bel: 040-8422594
              </a>
              <a href="mailto:[email protected]" className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold transition">
                E-mail Ons
              </a>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
