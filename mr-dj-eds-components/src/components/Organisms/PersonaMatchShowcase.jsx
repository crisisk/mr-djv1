import React from 'react';
import PropTypes from 'prop-types';
import StatHighlights from '../Molecules/StatHighlights.jsx';

const defaultPersonas = [
    {
        name: 'De Romantische Bruiloft',
        eventType: 'Bruiloft',
        matchScore: '97%',
        summary: 'Zoekt een stijlvolle en emotionele avond waarbij elke highlight muzikaal wordt begeleid.',
        topTracks: ['Ed Sheeran - Perfect', 'John Legend - All of Me', 'Earth, Wind & Fire - September'],
        reasons: [
            'Ceremonie-, receptie- en dansvloer-sets worden vooraf samengesteld op basis van intake.',
            'Live sax intermezzo’s zorgen voor goosebumps momenten tijdens de openingsdans.',
            'Lichtplan en decor sluiten aan op romantische thema’s in pastel of goud accent.'
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
    },
    {
        name: 'Festival Friends',
        eventType: 'Private Event',
        matchScore: '93%',
        summary: 'Zoekt een clubachtige ervaring met stevige drops, rook en lichtshows voor vriendengroepen.',
        topTracks: ['FISHER - Losing It', 'James Hype - Ferrari', 'MEDUZA - Piece Of Your Heart'],
        reasons: [
            'Voorbereide mashups & remixes afgestemd op favoriete stages en festival memories.',
            'CO₂ shooters, sparkulars en confetti geïntegreerd in het draaiboek.',
            'Aftermovie-pakket en fotohoek inbegrepen voor social-ready content.'
        ]
    },
    {
        name: 'Boutique Lounge',
        eventType: 'Hospitality',
        matchScore: '92%',
        summary: 'Op zoek naar elegante achtergrondmuziek die zich opbouwt richting dansbare classics.',
        topTracks: ['Nora En Pure - Come With Me', 'Disclosure - Latch (Acoustic)', 'Robin S - Show Me Love'],
        reasons: [
            'Modulaire set-ups die passen bij small venues en wijnbars.',
            'Soundscaping per dagdeel: brunch, borrel en late-night lounge sets.',
            'Muziek curatie op basis van Spotify- en POS-data van de locatie.'
        ]
    }
];

const personaHighlightStats = [
    {
        label: 'Gemiddelde match score',
        value: '95%',
        description: 'Gemeten over 400+ events waar intakeprofielen werden gebruikt.'
    },
    {
        label: 'Herboekingen bij zakelijke klanten',
        value: '82%',
        description: 'Door consistente merkuitvoering en event analytics.'
    },
    {
        label: 'Intakes met persona-profielen',
        value: '100%',
        description: 'Elke aanvraag koppelt we aan een persona voor gerichte voorbereiding.'
    }
];

const PersonaCard = ({ persona }) => (
    <article className="bg-neutral-light border border-neutral-gray-100 rounded-2xl p-spacing-xl shadow-xl flex flex-col gap-spacing-md">
        <div className="flex items-start justify-between gap-spacing-md">
            <div>
                <span className="inline-flex text-xs font-semibold uppercase tracking-wide text-neutral-gray-500">
                    {persona.eventType}
                </span>
                <h3 className="text-font-size-h3 font-bold text-neutral-dark mt-spacing-xs">
                    {persona.name}
                </h3>
            </div>
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary text-font-size-h3 font-extrabold">
                {persona.matchScore}
            </div>
        </div>
        <p className="text-font-size-body text-neutral-gray-500 leading-relaxed">
            {persona.summary}
        </p>
        <div className="space-y-spacing-sm">
            <div>
                <h4 className="text-font-size-small font-semibold uppercase tracking-wide text-neutral-dark mb-spacing-xs">
                    Top favorieten
                </h4>
                <ul className="list-disc list-inside text-font-size-body text-neutral-dark/90 space-y-spacing-xs">
                    {persona.topTracks.map((track, index) => (
                        <li key={`${persona.name}-track-${index}`}>{track}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-font-size-small font-semibold uppercase tracking-wide text-neutral-dark mb-spacing-xs">
                    Waarom Mister DJ past
                </h4>
                <ul className="list-disc list-inside text-font-size-body text-neutral-gray-500 space-y-spacing-xs">
                    {persona.reasons.map((reason, index) => (
                        <li key={`${persona.name}-reason-${index}`}>{reason}</li>
                    ))}
                </ul>
            </div>
        </div>
    </article>
);

PersonaCard.propTypes = {
    persona: PropTypes.shape({
        name: PropTypes.string.isRequired,
        eventType: PropTypes.string.isRequired,
        matchScore: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        topTracks: PropTypes.arrayOf(PropTypes.string).isRequired,
        reasons: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
};

const PersonaMatchShowcase = ({
    title = 'Persona Match Dashboard',
    subtitle = 'Visualiseer hoe Mister DJ naadloos aansluit op de belangrijkste klantprofielen voor maximale relevantie en conversie.',
    personas = defaultPersonas,
    stats = personaHighlightStats
}) => {
    return (
        <section className="py-spacing-3xl bg-neutral-gray-100">
            <div className="container mx-auto px-spacing-md">
                <div className="grid gap-spacing-2xl lg:grid-cols-[2fr_3fr] items-start">
                    <div className="space-y-spacing-xl">
                        <div className="space-y-spacing-sm">
                            <h2 className="text-font-size-h2 font-extrabold text-neutral-dark">
                                {title}
                            </h2>
                            <p className="text-font-size-body text-neutral-gray-500 leading-relaxed max-w-xl">
                                {subtitle}
                            </p>
                        </div>
                        <StatHighlights
                            title="Performance metrics"
                            subtitle="Combineer data van intake, CRM en reviewplatformen om matches continu te optimaliseren."
                            stats={stats}
                            orientation="vertical"
                        />
                    </div>
                    <div className="grid gap-spacing-xl md:grid-cols-2">
                        {personas.map((persona) => (
                            <PersonaCard key={persona.name} persona={persona} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

PersonaMatchShowcase.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    personas: PropTypes.arrayOf(PersonaCard.propTypes.persona),
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            description: PropTypes.string
        })
    )
};

export default PersonaMatchShowcase;
