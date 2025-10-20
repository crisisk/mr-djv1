export const BILLING_MODES = {
  EVENT: 'event',
  MONTHLY: 'monthly',
};

export const pricingPackages = [
  {
    id: 'brons',
    name: 'Brons',
    slug: 'brons',
    subtitle: 'Entry-level pakket',
    buttonText: 'Meer Info',
    isFeatured: false,
    serviceName: 'Brons DJ Pakket',
    ctaPath: '/contact?package=brons',
    features: [
      '4 uur DJ-set',
      'Basis licht- en geluidsset',
      'Persoonlijk intakegesprek',
      'Muziekvoorkeuren formulier',
    ],
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: 495,
        displayAmount: '€495',
        suffix: '/ event',
        description: 'Eenmalige betaling per event.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: 99,
        displayAmount: '€99',
        suffix: '/ maand',
        description: 'Flexibel maandelijks plan voor terugkerende events.',
      },
    },
    availability: 'https://schema.org/InStock',
  },
  {
    id: 'zilver',
    name: 'Zilver',
    slug: 'zilver',
    subtitle: 'Meest gekozen',
    buttonText: 'Boek Nu',
    isFeatured: true,
    serviceName: 'Zilver DJ Pakket',
    ctaPath: '/contact?package=zilver',
    features: [
      '6 uur DJ-set',
      'Uitgebreide lichtshow',
      'DJ + Saxofonist optie',
      '100% dansgarantie',
      'Onbeperkt aantal gasten',
    ],
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: 795,
        displayAmount: '€795',
        suffix: '/ event',
        description: 'Populairste keuze voor bruiloften en bedrijfsevents.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: 149,
        displayAmount: '€149',
        suffix: '/ maand',
        description: 'Vaste maandprijs inclusief 2 events per kwartaal.',
      },
    },
    availability: 'https://schema.org/LimitedAvailability',
  },
  {
    id: 'goud',
    name: 'Goud',
    slug: 'goud',
    subtitle: 'Premium All-Inclusive',
    buttonText: 'Vraag Offerte Aan',
    isFeatured: false,
    serviceName: 'Goud DJ Pakket',
    ctaPath: '/contact?package=goud',
    features: [
      '8 uur DJ-set',
      'Luxe licht- en geluidsset',
      'DJ + Saxofonist (inbegrepen)',
      'Ceremonie & receptie muziek',
      'Professionele apparatuur',
    ],
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: 1295,
        displayAmount: '€1.295',
        suffix: '/ event',
        description: 'All-in pakket voor luxe en grootschalige events.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: 199,
        displayAmount: '€199',
        suffix: '/ maand',
        description: 'Premium abonnement met planning- & aftermovie-services.',
      },
    },
    availability: 'https://schema.org/PreOrder',
  },
];

export default pricingPackages;
