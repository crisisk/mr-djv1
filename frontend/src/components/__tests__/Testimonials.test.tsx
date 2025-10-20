import { render } from '@testing-library/react';
import { Testimonials, type TestimonialEntry } from '../Testimonials';

describe('Testimonials', () => {
  it('matches the snapshot for winter events', () => {
    const testimonials: TestimonialEntry[] = [
      {
        quote: 'Een warme sfeer ondanks de kou buiten. De DJ heeft iedereen aan het dansen gekregen.',
        author: 'Elise & Bram',
        source: 'Winterfeest, Breda',
        rating: 5,
      },
      {
        quote: 'Onze klanten waren onder de indruk van de professionele uitstraling en muzikale begeleiding.',
        author: 'Mila Jansen',
        source: 'Zakelijk event, Den Haag',
        rating: 4,
      },
    ];

    const { container } = render(<Testimonials testimonials={testimonials} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
