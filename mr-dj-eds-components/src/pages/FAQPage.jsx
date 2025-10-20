import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';
import HeroSection from '../components/Organisms/HeroSection.jsx';
import { generateBreadcrumbSchema } from '../utils/schemaOrg.js';
import { createSimpleBreadcrumbs } from '../utils/breadcrumbs.js';

const FAQPage = () => {
  const breadcrumbs = createSimpleBreadcrumbs('FAQ', '/faq');
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema(breadcrumbs));

  const faqs = [
    {
      category: 'Boeken & Reserveren',
      questions: [
        {
          q: 'Hoe ver van tevoren moet ik boeken?',
          a: 'Voor bruiloften adviseren we 6-12 maanden van tevoren te boeken. Voor andere feesten is 2-3 maanden vaak voldoende, maar in het hoogseizoen (mei-december) raden we aan eerder te boeken.'
        },
        {
          q: 'Hoe werkt de boeking?',
          a: 'Na je aanvraag nemen we binnen 24 uur contact op voor een vrijblijvend gesprek. Als we tot overeenstemming komen, sturen we een contract en factuur. Na betaling van de aanbetaling (30%) is de datum definitief gereserveerd.'
        },
        {
          q: 'Wat zijn de betaalvoorwaarden?',
          a: '30% aanbetaling bij reservering, 70% twee weken voor het evenement. We accepteren iDEAL, bankoverschrijving en zakelijk incasso.'
        },
        {
          q: 'Kan ik annuleren of de datum wijzigen?',
          a: 'Tot 3 maanden voor het evenement kun je kosteloos annuleren. Daarna vervalt de aanbetaling. Datum wijzigen is kosteloos mogelijk (onder voorbehoud van beschikbaarheid).'
        }
      ]
    },
    {
      category: 'Muziek & Programma',
      questions: [
        {
          q: 'Kunnen we zelf muziekwensen doorgeven?',
          a: 'Absoluut! We hebben een uitgebreide voorbereiding waarin je al je wensen kunt doorgeven. Van favoriete artiesten tot specifieke nummers die absoluut (niet) gedraaid moeten worden.'
        },
        {
          q: 'Welke muziekstijlen kun je draaien?',
          a: 'We draaien alle stijlen: van classics uit de jaren \'60-\'80 tot actuele hits, van nederlandstalig tot internationale muziek, van house tot rock. We passen ons volledig aan jouw wensen aan.'
        },
        {
          q: 'Kunnen gasten verzoekjes doen tijdens het feest?',
          a: 'Jazeker! We vinden het leuk wanneer gasten verzoekjes doen. Uiteraard houden we rekening met de algemene sfeer en jouw do-not-play lijst.'
        },
        {
          q: 'Hoeveel speeches kunnen er gehouden worden?',
          a: 'Zoveel als gewenst! We hebben draadloze microfoons en zorgen voor een goede technische ondersteuning tijdens speeches, bedankjes of andere presentaties.'
        }
      ]
    },
    {
      category: 'Techniek & Locatie',
      questions: [
        {
          q: 'Welke ruimte en stroom heb je nodig?',
          a: 'We hebben ongeveer 2x3 meter ruimte nodig voor de DJ-booth. Qua stroom: minimaal 1x 16A stopcontact binnen 10 meter van de opstelling. Bij grotere events stemmen we de benodigdheden vooraf af.'
        },
        {
          q: 'Kan je ook buiten optreden?',
          a: 'Ja, onze apparatuur is geschikt voor buitenoptredens. We zorgen voor weatherproof covers en eventuele extra generatoren als er geen stroom beschikbaar is.'
        },
        {
          q: 'Hoe luid is de muziek?',
          a: 'We passen het volume aan op de ruimte en het moment. Tijdens het diner zachter, tijdens het feest harder. We houden altijd rekening met de locatie-eisen en geluidsoverlast regels.'
        },
        {
          q: 'Komen jullie van tevoren de locatie bekijken?',
          a: 'Dat is mogelijk maar niet altijd noodzakelijk. We bespreken vooraf de locatie en ontvangen graag foto\'s. Bij grote of complexe events komen we graag langs voor een technische inspectie.'
        }
      ]
    },
    {
      category: 'Pakketten & Prijzen',
      questions: [
        {
          q: 'Zijn de pakketten aan te passen?',
          a: 'Ja, alle pakketten zijn volledig aanpasbaar. Je kunt extra uren toevoegen, andere verlichting kiezen of bijvoorbeeld de saxofonist langer laten spelen.'
        },
        {
          q: 'Zijn reiskosten inbegrepen?',
          a: 'Ja, voor locaties binnen 50km van Eindhoven zijn reiskosten inbegrepen. Voor verdere afstanden berekenen we €0,45 per kilometer (retour) extra.'
        },
        {
          q: 'Wat zit er niet bij de prijs inbegrepen?',
          a: 'De prijzen zijn all-in voor de gekozen uren, apparatuur en reiskosten (binnen 50km). Extra kosten kunnen zijn: langere afstanden, overnachting bij multi-day events, of speciale wensen zoals extra apparatuur.'
        },
        {
          q: 'Is BTW inbegrepen?',
          a: 'Ja, alle genoemde prijzen zijn inclusief 21% BTW.'
        }
      ]
    },
    {
      category: 'Dag Van Het Feest',
      questions: [
        {
          q: 'Hoe vroeg komen jullie ter plaatse?',
          a: 'We komen 1-2 uur voor aanvang ter plaatse voor opbouw en soundcheck. Bij grotere events kan dit langer zijn. De exacte tijd stemmen we vooraf af.'
        },
        {
          q: 'Wat gebeurt er bij ziekte of noodgeval?',
          a: 'We hebben een netwerk van betrouwbare backup DJ\'s. Mocht er onverhoopt iets gebeuren, dan zorgen we altijd voor vervanging van gelijk niveau. Dit is nog nooit voorgekomen in 15 jaar!'
        },
        {
          q: 'Kunnen we tijdens het feest nog dingen aanpassen?',
          a: 'Natuurlijk! We spelen in op de sfeer en je kunt altijd bij ons terecht voor aanpassingen in volume, muziekstijl of planning.'
        },
        {
          q: 'Hoe lang duurt de afbouw?',
          a: 'Afbouw duurt ongeveer 45-60 minuten. We zorgen ervoor dat we netjes achterlaten en nemen al ons materiaal mee.'
        }
      ]
    },
    {
      category: 'Speciale Opties',
      questions: [
        {
          q: 'Hoe werkt de DJ + Saxofoon combinatie?',
          a: 'Saxofonist Leslie Moore speelt live mee met de DJ sets. Meestal tijdens het hoogtepunt van het feest (1 uur). Het geeft een unieke, energieke sfeer die gasten nog lang bijblijft!'
        },
        {
          q: 'Wat is het verschil tussen de lichtshow pakketten?',
          a: 'Brons: basis verlichting (LED bars). Zilver: moving heads en lasers. Goud: full light show met moving heads, lasers, LED floor en speciale effecten zoals CO2 jets.'
        },
        {
          q: 'Kunnen jullie ook ceremonie-muziek verzorgen?',
          a: 'Ja! Voor bruiloften verzorgen we graag de muziek tijdens de ceremonie, borrel, diner én feest. Zo heb je één aanspreekpunt en perfecte technische kwaliteit gedurende de hele dag.'
        },
        {
          q: 'Is photobooth bij het pakket inbegrepen?',
          a: 'Nee, de photobooth is een optionele toevoeging van €400 voor 3 uur inclusief props, direct print en digitale gallery. Een echte aanrader voor extra entertainment!'
        }
      ]
    }
  ];

  const metaTitle = 'Veelgestelde Vragen | FAQ | Mr. DJ';
  const metaDescription =
    'Veelgestelde vragen over DJ huren, prijzen, pakketten en praktische zaken. Vind snel antwoord op je vraag!';
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'FAQ', url: '/faq' }
  ];
  const faqSchemaData = generateFAQSchema(
    faqs.flatMap(category =>
      category.questions.map(faq => ({
        question: faq.q,
        answer: faq.a
      }))
    )
  );
  const breadcrumbSchemaData = generateBreadcrumbSchema(breadcrumbs);
  const webPageSchemaData = generateWebPageSchema({
    title: metaTitle,
    description: metaDescription,
    url: '/faq',
    breadcrumbs
  });
  const structuredData = [webPageSchemaData, breadcrumbSchemaData, faqSchemaData];

  return (
    <div className="FAQPage">
      <Helmet>
        <title>Veelgestelde Vragen | FAQ | Mr. DJ</title>
        <meta
          name="description"
          content="Veelgestelde vragen over DJ huren, prijzen, pakketten en praktische zaken. Vind snel antwoord op je vraag!"
        />
        <script type="application/ld+json">{breadcrumbSchema}</script>
      </Helmet>

      <Header />

      <HeroSection
        title="Veelgestelde Vragen"
        subtitle="Vind snel antwoord op je vraag over onze DJ service"
        ctaPrimaryText="Neem Contact Op"
        backgroundClass="bg-[#00AEEF]"
      />

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700">
              Staat je vraag er niet tussen? Neem gerust <a href="/contact" className="text-[#00AEEF] underline">contact</a> met
              ons op. We beantwoorden je vraag binnen 24 uur!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      {faqs.map((category, idx) => (
        <section key={idx} className={`py-12 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-8">
                {category.category}
              </h2>

              <div className="space-y-6">
                {category.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-gray-700">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 bg-[#1A2C4B] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Nog Vragen?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We helpen je graag verder! Bel ons direct of stuur een bericht via het contactformulier.
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

export default FAQPage;
