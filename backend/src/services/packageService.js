const packages = [
  {
    id: 'bronze',
    name: 'Brons Pakket',
    price: 795,
    duration: '4 uur',
    features: [
      'Professionele DJ',
      'Geluidssysteem',
      'Basisverlichting',
      'Muziekvoorkeuren formulier',
      '100% Dansgarantie'
    ]
  },
  {
    id: 'silver',
    name: 'Zilver Pakket',
    price: 995,
    duration: '5 uur',
    features: [
      'Professionele DJ',
      'Premium geluidssysteem',
      'LED verlichting',
      'Rookmachine',
      'Muziekvoorkeuren formulier',
      'Persoonlijk intakegesprek',
      '100% Dansgarantie'
    ],
    popular: true
  },
  {
    id: 'gold',
    name: 'Goud Pakket',
    price: 1295,
    duration: '6 uur',
    features: [
      'Professionele DJ',
      'Premium geluidssysteem',
      'Moving head verlichting',
      'Rookmachine',
      'DJ booth met logo',
      'Muziekvoorkeuren formulier',
      'Persoonlijk intakegesprek',
      'Saxofonist (optioneel)',
      '100% Dansgarantie'
    ]
  }
];

function getPackages() {
  return packages;
}

module.exports = {
  getPackages
};
