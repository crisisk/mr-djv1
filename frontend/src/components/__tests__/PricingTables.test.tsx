import { render } from '@testing-library/react';
import { PricingTables, type PricingFeatureSet } from '../PricingTables';

describe('PricingTables', () => {
  it('matches the snapshot for custom packages', () => {
    const packages: PricingFeatureSet[] = [
      {
        name: 'Essentials',
        subtitle: 'Voor verjaardagen en jubilea',
        price: '€550',
        features: ['4 uur DJ-set', 'Compacte lichtshow', 'Intakegesprek'],
        buttonText: 'Plan intake',
      },
      {
        name: 'Celebration',
        subtitle: 'Meest gekozen voor bruiloften',
        price: '€890',
        features: ['6 uur DJ-set', 'Live saxofonist', 'Premium geluid', 'Dansvloer verlichting'],
        isFeatured: true,
        buttonText: 'Boek nu',
      },
      {
        name: 'Grand Gala',
        subtitle: 'Voor grote events en bedrijfsfeesten',
        price: '€1.450',
        features: ['8 uur DJ-set', 'Licht- en ledshow', 'MC service', 'Aftermovie'],
        buttonText: 'Vraag offerte aan',
      },
    ];

    const { container } = render(<PricingTables packages={packages} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
