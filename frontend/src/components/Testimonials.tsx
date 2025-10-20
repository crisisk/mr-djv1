import { StarIcon } from '../icons';

export interface TestimonialEntry {
  quote: string;
  author: string;
  source: string;
  rating: number;
}

export interface TestimonialsProps {
  testimonials?: TestimonialEntry[];
}

const defaultTestimonials: TestimonialEntry[] = [
  {
    quote: 'De combinatie van DJ en Saxofonist was het hoogtepunt van onze bruiloft. De sfeer was onvergetelijk!',
    author: 'Jan & Marieke',
    source: 'Bruiloft, Amsterdam',
    rating: 5,
  },
  {
    quote: 'Professioneel, energiek en ze wisten precies de juiste snaar te raken. Een absolute aanrader voor elk bedrijfsfeest.',
    author: 'Suzanne van Dijk',
    source: 'Bedrijfsfeest, Utrecht',
    rating: 5,
  },
  {
    quote: 'De muziek was perfect afgestemd op onze gasten. De saxofonist maakte het helemaal af!',
    author: 'Mark de Vries',
    source: 'Verjaardagsfeest, Eindhoven',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={index < rating ? undefined : 'text-neutral-gray-500'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialEntry }) {
  return (
    <article className="bg-neutral-light p-spacing-xl rounded-lg shadow-xl flex flex-col h-full" aria-label={`Testimonial van ${testimonial.author}`}>
      <StarRating rating={testimonial.rating} />
      <p className="lead text-neutral-dark text-emphasis my-spacing-lg flex-grow">“{testimonial.quote}”</p>
      <footer className="border-t border-neutral-gray-100 pt-spacing-md">
        <p className="body-md text-strong text-primary">{testimonial.author}</p>
        <p className="body-sm text-neutral-gray-500">{testimonial.source}</p>
      </footer>
    </article>
  );
}

export function Testimonials({ testimonials = defaultTestimonials }: TestimonialsProps) {
  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="heading-2 text-center text-neutral-dark mb-spacing-2xl">Wat Klanten Zeggen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`${testimonial.author}-${testimonial.source}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
export { defaultTestimonials };
