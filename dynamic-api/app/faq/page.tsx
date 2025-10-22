'use client';

import React, { useState } from 'react';
import HeroSection from '../../components/organisms/HeroSection';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

type CategoryType = 'alle' | 'algemeen' | 'bruiloft' | 'feest' | 'zakelijk' | 'technisch' | 'prijzen';

interface FAQ {
  question: string;
  answer: string;
  category: CategoryType;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('alle');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQ[] = [
    // Algemeen
    {
      question: 'Hoe ver van tevoren moet ik boeken?',
      answer: 'Voor bruiloften adviseren wij minimaal 6-9 maanden van tevoren te boeken, vooral in het hoogseizoen (mei-september). Voor andere feesten kan dit korter, afhankelijk van beschikbaarheid. We raden altijd aan om zo snel mogelijk contact op te nemen zodra je datum vaststaat.',
      category: 'algemeen'
    },
    {
      question: 'In welke regio zijn jullie actief?',
      answer: 'We zijn gevestigd in Eindhoven en verzorgen vooral events in Brabant, Limburg en Gelderland. Voor grotere events komen we graag naar heel Nederland en zelfs België. Reiskosten worden transparant berekend en zijn vaak al inbegrepen in onze pakketten (binnen 50km van Eindhoven altijd gratis).',
      category: 'algemeen'
    },
    {
      question: 'Kunnen jullie ook buiten spelen?',
      answer: 'Ja! We hebben apparatuur die geschikt is voor zowel binnen als buiten. We houden rekening met weersomstandigheden en hebben altijd een backup plan. Voor buitenlocaties adviseren we wel altijd een overdekte plek als back-up bij slecht weer.',
      category: 'algemeen'
    },
    {
      question: 'Wat is de 100% dansgarantie?',
      answer: 'Met onze jarenlange ervaring lezen we het publiek perfect en spelen we altijd de juiste muziek op het juiste moment. Mocht de dansvloer toch leeg blijven (wat in 15 jaar nog nooit is voorgekomen), dan krijg je je geld terug. Zo zeker zijn we van onze service!',
      category: 'algemeen'
    },
    {
      question: 'Hebben jullie backup apparatuur?',
      answer: 'Ja, absoluut! We hebben altijd dubbele systemen bij ons. Van mixer tot laptop - alles is dubbel aanwezig. Mocht er iets mis gaan (wat vrijwel nooit gebeurt), kunnen we binnen enkele seconden overschakelen. Jullie feest gaat altijd door!',
      category: 'algemeen'
    },

    // Bruiloft
    {
      question: 'Kunnen jullie de hele dag verzorgen?',
      answer: 'Ja! We kunnen de volledige dag verzorgen, van ceremonie-muziek tot receptie en het avondfeest. Dit bespreken we graag in een persoonlijk gesprek zodat we alles perfect op jullie wensen afstemmen. We maken een exacte planning van het hele programma.',
      category: 'bruiloft'
    },
    {
      question: 'Wat kost een bruiloft DJ?',
      answer: 'Onze bruiloft pakketten starten vanaf €895 voor alleen het avondfeest (Basis pakket). Voor een hele dag arrangement inclusief ceremonie en receptie starten we vanaf €1595. Voor het populaire Premium pakket betaal je €1995. Bekijk onze pakketpagina voor meer details en exacte prijzen.',
      category: 'bruiloft'
    },
    {
      question: 'Kunnen we zelf muziekwensen doorgeven?',
      answer: 'Absoluut! Jullie kunnen een Spotify playlist delen met must-play nummers en een do-not-play lijst. We bespreken vooraf uitgebreid jullie muziekvoorkeuren en de sfeer die jullie willen creëren. Ook tijdens het feest nemen we natuurlijk verzoekjes aan van gasten.',
      category: 'bruiloft'
    },
    {
      question: 'Wat is de first dance begeleiding?',
      answer: 'Wij zorgen voor de perfecte opbouw naar jullie first dance, inclusief spotlights en sfeerverlichting. We kunnen het nummer faden of juist een spectaculaire start maken - precies zoals jullie dat willen! We bespreken dit vooraf tot in detail.',
      category: 'bruiloft'
    },
    {
      question: 'Werken jullie samen met andere leveranciers?',
      answer: 'Ja, we hebben jarenlange ervaring met samenwerken met fotografen, videografen, ceremoniemeesters en locaties. We stemmen alles van tevoren goed af voor een perfecte dag zonder stress. We zijn gewend om in een team te werken.',
      category: 'bruiloft'
    },
    {
      question: 'Kunnen jullie ook de ceremonie verzorgen?',
      answer: 'Ja! We kunnen ceremonie-muziek verzorgen met een discrete opstelling en draadloze microfoons voor de ambtenaar of getuigen. We bespreken vooraf welke muziek wanneer moet spelen en zorgen dat alles op rolletjes loopt.',
      category: 'bruiloft'
    },

    // Feesten
    {
      question: 'Wat is het verschil tussen een normale DJ en een drive-in show?',
      answer: 'Een drive-in show is een complete mobiele discotheek met professionele DJ booth, uitgebreide verlichting (lasers, moving heads, effecten) en premium geluidsysteem. Perfect voor grotere feesten en jubilea waar je echt wilt opvallen! Een normale DJ heeft basis licht en geluid.',
      category: 'feest'
    },
    {
      question: 'Wat voor muziek spelen jullie op feesten?',
      answer: 'We draaien alle genres en decennia - van 60s/70s classics tot de nieuwste hits. We stemmen de muziek af op jouw gasten en voorkeuren. Je mag ook een Spotify playlist delen! We kunnen switchen tussen verschillende stijlen gedurende de avond.',
      category: 'feest'
    },
    {
      question: 'Is een photobooth inbegrepen?',
      answer: 'Een photobooth is inbegrepen in het All-In pakket (onbeperkt) en optioneel 2 uur in het Premium pakket. Voor andere pakketten kun je een photobooth bijboeken vanaf €295 voor 2-4 uur onbeperkt foto\'s maken met props.',
      category: 'feest'
    },
    {
      question: 'Kunnen jullie ook interactieve spelletjes doen?',
      answer: 'Ja! Bij feesten kunnen we leuke interactieve elementen inbouwen zoals muziekbingo, dance-offs of andere party games. Dit bespreken we vooraf zodat het past bij de sfeer die je wilt.',
      category: 'feest'
    },

    // Zakelijk
    {
      question: 'Hebben jullie ervaring met grote corporate events?',
      answer: 'Ja, we hebben events verzorgd van 50 tot 1000+ gasten. We hebben de juiste apparatuur en ervaring voor zowel intieme borrels als grote personeelsfeesten. We hebben vaste klanten die al jaren met ons samenwerken.',
      category: 'zakelijk'
    },
    {
      question: 'Kunnen jullie een technische rider leveren?',
      answer: 'Ja, we kunnen een volledige technische rider leveren met alle specificaties van onze apparatuur, stroombehoefte en opbouwruimte. Handig voor overleg met de locatie. We hebben dit document standaard beschikbaar.',
      category: 'zakelijk'
    },
    {
      question: 'Werken jullie samen met event bureaus?',
      answer: 'Ja, we werken regelmatig samen met event bureaus en hebben ervaring met grotere producties. We stemmen alles goed af met andere leveranciers en zijn gewend om te werken binnen een groter team.',
      category: 'zakelijk'
    },
    {
      question: 'Kunnen jullie ook achtergrondmuziek tijdens het diner verzorgen?',
      answer: 'Zeker! We kunnen de hele dag/avond verzorgen - van achtergrondmuziek tijdens borrel en diner tot een feestelijke dansavond. Het volume en de muziekstijl passen we perfect aan op het moment.',
      category: 'zakelijk'
    },
    {
      question: 'Is jullie uitstraling professioneel genoeg voor corporate events?',
      answer: 'Absoluut! We dragen nette kleding (pak of bedrijfskleding), hebben verzorgde presentatie en professionele communicatie. We passen ons aan jouw bedrijfscultuur en dresscode. Onze apparatuur is altijd strak en netjes opgebouwd.',
      category: 'zakelijk'
    },

    // Technisch
    {
      question: 'Welke apparatuur gebruiken jullie?',
      answer: 'We werken alleen met premium merken zoals Pioneer DJ (mixers/CDJs), QSC/JBL (speakers), Martin/Showtec (verlichting). We hebben verschillende sets voor verschillende groottes events. Alles wordt regelmatig onderhouden en is altijd in topconditie.',
      category: 'technisch'
    },
    {
      question: 'Hoeveel ruimte hebben jullie nodig?',
      answer: 'Voor een basis DJ setup hebben we ongeveer 3x2 meter nodig. Voor een drive-in show met uitgebreide verlichting adviseren we 4x3 meter. We bekijken vooraf altijd de locatie (foto\'s) om te bepalen wat er nodig is.',
      category: 'technisch'
    },
    {
      question: 'Hoeveel stroomverbruik heeft jullie apparatuur?',
      answer: 'Een basis DJ set heeft 1x 230V (16A) stopcontact nodig. Voor grotere setups met veel verlichting adviseren we 2-3x 230V (16A). We kunnen dit vooraf berekenen en in de technische rider opnemen.',
      category: 'technisch'
    },
    {
      question: 'Hoe lang duurt de opbouw?',
      answer: 'Voor een basis DJ set ongeveer 1 uur. Voor een drive-in show met uitgebreide verlichting 2-3 uur. We komen altijd ruim voor aanvang zodat alles getest is en we op tijd kunnen beginnen. Afbouw duurt ongeveer hetzelfde.',
      category: 'technisch'
    },
    {
      question: 'Kunnen jullie aansluiten op locatie installaties?',
      answer: 'Ja, we kunnen in veel gevallen aansluiten op bestaande geluidsinstallaties van de locatie. Dit bespreken we vooraf met de locatie. We hebben de juiste kabels en adapters altijd bij ons.',
      category: 'technisch'
    },

    // Prijzen
    {
      question: 'Zijn de prijzen all-in of komen er extra kosten bij?',
      answer: 'Onze prijzen zijn inclusief DJ, apparatuur, opbouw, transport (binnen 50km) en BTW. Alleen voor extra opties (zoals photobooth of live saxofonist) berekenen we meerkosten, maar die worden altijd vooraf duidelijk gecommuniceerd. Geen verborgen kosten!',
      category: 'prijzen'
    },
    {
      question: 'Welk pakket past bij mij?',
      answer: 'Voor een basis feest (verjaardagen, kleine events) is het Basis pakket (€695) vaak voldoende. Voor bruiloften adviseren we minimaal Standaard (€1195). Wil je echt uitpakken? Kies dan Premium (€1595) of All-In (€2495). Twijfel je? Bel ons voor persoonlijk advies!',
      category: 'prijzen'
    },
    {
      question: 'Hoe werkt de betaling?',
      answer: 'Na akkoord op de offerte vragen we een aanbetaling van 30% om de datum te reserveren. De restbetaling volgt uiterlijk 2 weken voor het event. Betalen kan via ideal, bankoverschrijving of contant. We sturen altijd een bevestiging en factuur.',
      category: 'prijzen'
    },
    {
      question: 'Wat als ik moet annuleren?',
      answer: 'Tot 3 maanden voor het event kun je kosteloos annuleren (minus administratiekosten €50). Tussen 3 maanden en 1 maand voor het event berekenen we 50%. Bij annulering binnen 1 maand is het volledige bedrag verschuldigd. We adviseren altijd een annuleringsverzekering.',
      category: 'prijzen'
    },
    {
      question: 'Zijn er kortingen mogelijk?',
      answer: 'Voor doordeweekse data (maandag t/m donderdag) geven we vaak 10-15% korting. Ook hebben we regelmatig seizoensacties in het laagseizoen (november-maart). Vraag naar de actuele mogelijkheden bij je offerte aanvraag!',
      category: 'prijzen'
    },
    {
      question: 'Wat kosten extra uren?',
      answer: 'Extra uren kun je bijboeken voor €125 per uur. Dit kan ook tijdens het feest zelf (als we beschikbaar zijn). We adviseren wel om dit vooraf af te spreken, dan kunnen we rekening houden met onze planning.',
      category: 'prijzen'
    }
  ];

  const categories = [
    { key: 'alle' as const, label: 'Alle Vragen', icon: '📋' },
    { key: 'algemeen' as const, label: 'Algemeen', icon: '❓' },
    { key: 'bruiloft' as const, label: 'Bruiloft', icon: '💍' },
    { key: 'feest' as const, label: 'Feesten', icon: '🎉' },
    { key: 'zakelijk' as const, label: 'Zakelijk', icon: '💼' },
    { key: 'technisch' as const, label: 'Technisch', icon: '🔧' },
    { key: 'prijzen' as const, label: 'Prijzen', icon: '💰' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'alle' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        eyebrow="Veelgestelde Vragen"
        title="Alles Wat Je Wilt Weten"
        subtitle="Antwoorden op de meest gestelde vragen over onze DJ services"
        ctaPrimaryText="Scroll naar vragen"
        ctaSecondaryText="Neem Contact Op"
        ctaPrimaryHref="#faq"
        ctaSecondaryHref="/contact"
        backgroundClass="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['40+ Vragen', '6 Categorieën', 'Zoekfunctie']}
        socialProof="💡 Alles wat je moet weten op één plek"
      />

      {/* Search Bar */}
      <section className="py-spacing-2xl px-spacing-xl bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-3xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Zoek in alle vragen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-lg"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section id="faq" className="py-spacing-2xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={activeCategory === cat.key ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setActiveCategory(cat.key)}
                className="min-w-[130px]"
              >
                {cat.icon} {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {activeCategory === 'alle' ? 'Alle Vragen' : categories.find(c => c.key === activeCategory)?.label}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'vraag' : 'vragen'} gevonden
            </p>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <summary className="cursor-pointer list-none flex justify-between items-start font-semibold text-lg">
                    <span className="flex-1 pr-4">{faq.question}</span>
                    <span className="text-2xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                  <div className="mt-4 pt-4 border-t">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      {categories.find(c => c.key === faq.category)?.icon}{' '}
                      {categories.find(c => c.key === faq.category)?.label}
                    </span>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-4">
                Geen vragen gevonden voor &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('alle');
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links by Category */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vragen Per Categorie
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.filter(cat => cat.key !== 'alle').map((cat) => {
              const count = faqs.filter(faq => faq.category === cat.key).length;
              return (
                <div
                  key={cat.key}
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveCategory(cat.key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Card className="p-spacing-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-5xl mb-4">{cat.icon}</div>
                    <h3 className="font-semibold text-xl mb-2">{cat.label}</h3>
                    <p className="text-gray-600">{count} vragen</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-spacing-xl text-center">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Staat Je Vraag Er Niet Bij?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Geen probleem! Neem contact met ons op en we helpen je graag verder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                Stel je vraag
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = 'tel:0408422594'}
              >
                Bel ons direct
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Klaar Om Te Boeken?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Vraag een offerte aan of plan een vrijblijvend gesprek
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Vraag offerte aan
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
        </div>
      </section>
    </>
  );
}
