import React, { useEffect, useMemo } from 'react';
import { trackEvent } from '../../lib/analytics.js';

const testimonialsData = [
  {
    id: 'bruiloft-eindhoven-2025',
    quote: 'Van ceremonie tot laatste dans perfect begeleid. Onze gasten stonden tot het einde op de dansvloer.',
    author: 'Sarah & Tom',
    source: 'Bruiloft • Eindhoven • juni 2025',
    rating: 5,
    category: 'bruiloft',
    media: 'Bruiloft Eindhoven',
  },
  {
    id: 'bruiloft-tilburg-2024',
    quote: 'De saxofonist maakte onze openingsdans magisch. Alles liep strak volgens draaiboek.',
    author: 'Lotte & Wouter',
    source: 'Bruiloft • Tilburg • april 2024',
    rating: 5,
    category: 'bruiloft',
    media: 'Bruiloft Tilburg',
  },
  {
    id: 'bruiloft-maastricht-2025',
    quote: 'Ceremonie audio, vocalist en DJ: alles liep vlekkeloos in Château Neercanne.',
    author: 'Amber & Jelle',
    source: 'Bruiloft • Maastricht • september 2025',
    rating: 5,
    category: 'bruiloft',
    media: 'Bruiloft Maastricht',
  },
  {
    id: 'bruiloft-rotterdam-2024',
    quote: 'Marokkaanse percussion gecombineerd met club classics: perfecte mix voor onze gasten.',
    author: 'Noor & Ilias',
    source: 'Bruiloft • Rotterdam • juli 2024',
    rating: 5,
    category: 'bruiloft',
    media: 'Bruiloft Rotterdam',
  },
  {
    id: 'corporate-eindhoven-2024',
    quote: 'Branding visuals, strakke cues en een energieke host. Onze awardshow voelde premium.',
    author: 'Philips Health',
    source: 'Bedrijfsfeest • Eindhoven • november 2024',
    rating: 5,
    category: 'bedrijfsfeest',
    media: 'Corporate Eindhoven',
  },
  {
    id: 'corporate-denbosch-2025',
    quote: 'Interactieve DJ + MC, perfecte mix voor 500 medewerkers. Survey score: 97% tevredenheid.',
    author: 'Heineken Nederland',
    source: 'Bedrijfsfeest • Den Bosch • februari 2025',
    rating: 5,
    category: 'bedrijfsfeest',
    media: 'Corporate Den Bosch',
  },
  {
    id: 'corporate-tilburg-2023',
    quote: 'Van borrel tot afterparty perfect getimed. De CO₂-jets waren de kers op de taart.',
    author: 'CZ Zorgverzekeringen',
    source: 'Bedrijfsfeest • Tilburg • december 2023',
    rating: 5,
    category: 'bedrijfsfeest',
    media: 'Corporate Tilburg',
  },
  {
    id: 'corporate-amsterdam-2025',
    quote: 'Hybride event met internationale gasten. Streaming audio en tweetalige MC werkten naadloos.',
    author: 'Booking.com',
    source: 'Bedrijfsfeest • Amsterdam • mei 2025',
    rating: 5,
    category: 'bedrijfsfeest',
    media: 'Corporate Amsterdam',
  },
  {
    id: 'private-veldhoven-2024',
    quote: 'Van seventies classics tot hedendaagse hits, iedereen danste – zelfs oma van 82!',
    author: 'Familie Vermeer',
    source: 'Jubileum • Veldhoven • augustus 2024',
    rating: 5,
    category: 'private',
    media: 'Jubileum Veldhoven',
  },
  {
    id: 'private-breda-2023',
    quote: 'Silent disco + live visuals in de tuin. Binnen 90 minuten opgebouwd – legendarische avond.',
    author: "Lisa's 30th",
    source: 'Verjaardag • Breda • september 2023',
    rating: 5,
    category: 'private',
    media: 'Verjaardag Breda',
  },
];

const StarRating = ({ rating }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-secondary' : 'text-neutral-gray-500'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  return <div className="flex">{stars}</div>;
};

const categories = [
  {
    key: 'bruiloft',
    title: 'Bruiloften 2023–2025',
    description: 'Recente bruiloften waar 100% dansgarantie is waargemaakt en upsells zoals sax of sparkulars zijn ingezet.',
  },
  {
    key: 'bedrijfsfeest',
    title: 'Bedrijfsfeesten met impact',
    description: 'Corporate events met branding, MC en meetbare tevredenheidsscores boven 95%.',
  },
];

const useCategorisedTestimonials = (segment) =>
  useMemo(() => {
    if (!segment) {
      return categories.map((category) => ({
        ...category,
        testimonials: testimonialsData.filter((item) => item.category === category.key).slice(0, 3),
      }));
    }

    const testimonialIndex = testimonialsData.reduce((acc, testimonial) => {
      acc[testimonial.id] = testimonial;
      return acc;
    }, {});

    const highlightIds = Array.isArray(segment.testimonialIds) ? segment.testimonialIds : [];
    const highlightTestimonials = highlightIds
      .map((id) => testimonialIndex[id])
      .filter(Boolean);

    const highlightCategory = segment.highlightCategory || highlightTestimonials[0]?.category || 'bruiloft';
    const baseCategory = categories.find((category) => category.key === highlightCategory);

    const primaryGroup = {
      key: 'personalization-highlight',
      title: segment.headline || baseCategory?.title || 'Uitgelichte cases',
      description: segment.subheadline || baseCategory?.description || '',
      testimonials:
        highlightTestimonials.length > 0
          ? highlightTestimonials
          : testimonialsData.filter((item) => item.category === highlightCategory).slice(0, 3),
    };

    const remainingGroups = categories
      .filter((category) => category.key !== highlightCategory)
      .map((category) => ({
        ...category,
        testimonials: testimonialsData.filter((item) => item.category === category.key).slice(0, 3),
      }));

    return [primaryGroup, ...remainingGroups];
  }, [segment]);

const TestimonialCard = ({ testimonial, segmentId }) => (
  <article className="flex flex-col gap-spacing-sm rounded-3xl border border-neutral-gray-100 bg-neutral-light p-spacing-xl shadow-lg">
    <StarRating rating={testimonial.rating} />
    <p className="text-font-size-h3 text-neutral-dark italic flex-grow">“{testimonial.quote}”</p>
    <div className="border-t border-neutral-gray-100 pt-spacing-sm">
      <p className="text-font-size-body font-bold text-primary">{testimonial.author}</p>
      <p className="text-font-size-small text-neutral-gray-500">{testimonial.source}</p>
    </div>
    <button
      type="button"
      className="self-start text-sm font-semibold text-primary underline"
      onClick={() =>
        trackEvent('testimonial_cta_click', {
          testimonial_id: testimonial.id,
          category: testimonial.category,
          personalization_variant: segmentId || 'default',
        })
      }
    >
      Bekijk media
    </button>
  </article>
);

const MediaTile = ({ label }) => (
  <div className="rounded-3xl border border-neutral-gray-100 bg-gradient-to-br from-primary/15 to-secondary/20 p-spacing-xl text-center text-sm font-semibold text-neutral-dark shadow-md">
    {label}
  </div>
);

const Testimonials = ({ segment }) => {
  const groupedTestimonials = useCategorisedTestimonials(segment);
  const mediaTiles = Array.isArray(segment?.mediaTiles) && segment.mediaTiles.length
    ? segment.mediaTiles
    : testimonialsData.slice(0, 6).map((testimonial) => testimonial.media);

  useEffect(() => {
    groupedTestimonials.forEach((group) => {
      group.testimonials.forEach((testimonial) => {
        trackEvent('testimonial_impression', {
          testimonial_id: testimonial.id,
          category: testimonial.category,
          placement: 'design_system',
          personalization_variant: segment?.id || 'default',
        });
      });
    });
  }, [groupedTestimonials, segment?.id]);

  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-xl font-extrabold">
          {segment?.headline || 'Social Proof & Media'}
        </h2>
        <p className="text-center text-neutral-gray-600 max-w-2xl mx-auto mb-spacing-2xl">
          {segment?.subheadline ||
            'Toon direct bewijs met categorie-specifieke testimonials en koppel ze aan je mediagallery. DataLayer events volgen impressies en kliks voor CRO-analyse.'}
        </p>
        <div className="grid gap-spacing-xl md:grid-cols-2">
          {groupedTestimonials.map((group) => (
            <div key={group.key} className="space-y-spacing-md">
              <header>
                <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{group.title}</h3>
                <p className="text-font-size-small text-neutral-gray-600">{group.description}</p>
              </header>
              <div className="space-y-spacing-md">
                {group.testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} segmentId={segment?.id} />
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-spacing-md">
            <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Media gallery koppeling</h3>
            <p className="text-font-size-small text-neutral-gray-600">
              Selecteer bij elke testimonial het corresponderende beeldmateriaal zodat bezoekers de sfeer direct zien.
            </p>
            <div className="grid grid-cols-2 gap-spacing-md">
              {mediaTiles.map((label) => (
                <MediaTile key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
