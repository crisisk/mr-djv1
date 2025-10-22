'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StatHighlights from '../molecules/StatHighlights';

interface Persona {
  name: string;
  eventType: string;
  matchScore: string;
  summary: string;
  topTracks: string[];
  reasons: string[];
}

interface Stat {
  label: string;
  value: string | number;
  description?: string;
}

interface PersonaMatchShowcaseProps {
  title?: string;
  subtitle?: string;
  personas?: Persona[];
  stats?: Stat[];
  className?: string;
}

const defaultPersonas: Persona[] = [
  {
    name: 'De Romantische Bruiloft',
    eventType: 'Bruiloft',
    matchScore: '97%',
    summary: 'Zoekt een stijlvolle en emotionele avond waarbij elke highlight muzikaal wordt begeleid.',
    topTracks: ['Ed Sheeran - Perfect', 'John Legend - All of Me', 'Earth, Wind & Fire - September'],
    reasons: [
      'Ceremonie-, receptie- en dansvloer-sets worden vooraf samengesteld op basis van intake.',
      'Live sax intermezzo\'s zorgen voor goosebumps momenten tijdens de openingsdans.',
      'Lichtplan en decor sluiten aan op romantische thema\'s in pastel of goud accent.'
    ]
  },
  {
    name: 'Corporate Crowd Energizer',
    eventType: 'Bedrijfsfeest',
    matchScore: '95%',
    summary: 'Wil een energieke avond met duidelijke merkactivatie en dynamische podiumopbouw.',
    topTracks: ['Calvin Harris - Feel So Close', 'Purple Disco Machine - Hypnotized', 'Avicii - Levels'],
    reasons: [
      'Kick-off countdown, merkintroducties en awardblokken worden synchroon geprogrammeerd.',
      'DJ booth branding en LED visuals in huisstijl kleuren voor maximale herkenning.',
      'MC-support zorgt voor soepele transities tussen speeches, activaties en dansblokken.'
    ]
  }
];

const defaultStats: Stat[] = [
  { label: 'Gemiddelde match score', value: '95%', description: 'Gemeten over 400+ events waar intakeprofielen werden gebruikt.' },
  { label: 'Herboekingen bij zakelijke klanten', value: '82%', description: 'Door consistente merkuitvoering en event analytics.' },
  { label: 'Intakes met persona-profielen', value: '100%', description: 'Elke aanvraag koppelt we aan een persona voor gerichte voorbereiding.' }
];

const PersonaCard: React.FC<{ persona: Persona; index: number }> = ({ persona, index }) => (
  <motion.article
    className="bg-white border border-gray-200 rounded-2xl p-spacing-xl shadow-xl flex flex-col gap-spacing-md"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <div className="flex items-start justify-between gap-spacing-md">
      <div>
        <span className="inline-flex text-xs font-semibold uppercase tracking-wide text-gray-500">{persona.eventType}</span>
        <h3 className="text-font-size-h3 font-bold text-neutral-dark mt-spacing-xs">{persona.name}</h3>
      </div>
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary text-xl font-extrabold">{persona.matchScore}</div>
    </div>
    <p className="text-font-size-body text-gray-600 leading-relaxed">{persona.summary}</p>
    <div className="space-y-spacing-sm">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-dark mb-spacing-xs">Top favorieten</h4>
        <ul className="list-disc list-inside text-sm text-neutral-dark space-y-1">
          {persona.topTracks.map((track, i) => (
            <li key={i}>{track}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-dark mb-spacing-xs">Waarom Mister DJ past</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {persona.reasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  </motion.article>
);

/**
 * PersonaMatchShowcase Component
 * Displays customer personas with match scores and relevant information
 */
const PersonaMatchShowcase: React.FC<PersonaMatchShowcaseProps> = ({
  title = 'Persona Match Dashboard',
  subtitle = 'Visualiseer hoe Mister DJ naadloos aansluit op de belangrijkste klantprofielen voor maximale relevantie en conversie.',
  personas = defaultPersonas,
  stats = defaultStats,
  className = ''
}) => {
  return (
    <section className={`py-spacing-3xl bg-gray-50 ${className}`}>
      <div className="container-pro">
        <div className="grid gap-spacing-2xl lg:grid-cols-[2fr_3fr] items-start">
          <div className="space-y-spacing-xl">
            <div className="space-y-spacing-sm">
              <h2 className="text-font-size-h2 font-extrabold text-neutral-dark">{title}</h2>
              <p className="text-font-size-body text-gray-600 leading-relaxed max-w-xl">{subtitle}</p>
            </div>
            <StatHighlights
              title="Performance metrics"
              subtitle="Combineer data van intake, CRM en reviewplatformen om matches continu te optimaliseren."
              stats={stats}
              orientation="vertical"
            />
          </div>
          <div className="grid gap-spacing-xl md:grid-cols-2">
            {personas.map((persona, index) => (
              <PersonaCard key={persona.name} persona={persona} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonaMatchShowcase;
