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
        <svg
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-secondary' : 'text-neutral-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
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
