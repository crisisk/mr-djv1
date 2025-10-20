export const BILLING_MODES = {
  EVENT: 'event',
  MONTHLY: 'monthly',
};

export const pricingPackages = [
  {
    id: 'bronze',
    name: 'Brons',
    subtitle: 'Perfect voor kleinere feesten en intieme bijeenkomsten',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€495',
        suffix: '/ event',
        description: 'Eenmalige betaling per event.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€99',
        suffix: '/ maand',
        description: 'Flexibel maandelijks plan voor terugkerende events.',
      },
    },
    features: [
      '4 uur DJ-service',
      'Professionele geluidsapparatuur',
      'Basis lichtshow',
      'Muziekwensen vooraf',
      'Tot 100 gasten',
      'Standaard setup',
    ],
    isFeatured: false,
    buttonText: 'Vraag Offerte Aan',
  },
  {
    id: 'silver',
    name: 'Zilver',
    subtitle: 'De complete ervaring voor onvergetelijke feesten',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€795',
        suffix: '/ event',
        description: 'Populairste keuze voor bruiloften en bedrijfsevents.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€149',
        suffix: '/ maand',
        description: 'Vaste maandprijs inclusief 2 events per kwartaal.',
      },
    },
    features: [
      '6 uur DJ-service',
      'Premium geluidsapparatuur',
      'Uitgebreide lichtshow',
      'Persoonlijk intakegesprek',
      'DJ + Saxofonist optie',
      'Tot 200 gasten',
      'Draadloze microfoon',
      '100% dansgarantie',
    ],
    isFeatured: true,
    buttonText: 'Boek Nu',
  },
  {
    id: 'gold',
    name: 'Goud',
    subtitle: 'De ultieme all-inclusive entertainment ervaring',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€1.295',
        suffix: '/ event',
        description: 'All-in pakket voor luxe en grootschalige events.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€199',
        suffix: '/ maand',
        description: 'Premium abonnement met planning- & aftermovie-services.',
      },
    },
    features: [
      '8 uur DJ-service',
      'Premium+ geluidsapparatuur',
      'Spectaculaire lichtshow',
      'DJ + Live Saxofonist',
      'Ceremonie & receptie muziek',
      'Onbeperkt aantal gasten',
      'Meerdere microfoons',
      'Persoonlijke playlist curatie',
      'VIP behandeling',
    ],
    isFeatured: false,
    buttonText: 'Vraag Offerte Aan',
  },
];

export default pricingPackages;
