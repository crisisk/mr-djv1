import React from 'react'
import { useTranslation } from 'react-i18next'

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
    ))
  return <div className="flex">{stars}</div>
}

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-neutral-light p-spacing-xl rounded-lg shadow-xl flex flex-col h-full">
      <StarRating rating={testimonial.rating} />
      <p className="text-font-size-h3 text-neutral-dark italic my-spacing-lg flex-grow">"{testimonial.quote}"</p>
      <div className="border-t border-neutral-gray-100 pt-spacing-md">
        <p className="text-font-size-body font-bold text-primary">{testimonial.author}</p>
        <p className="text-font-size-small text-neutral-gray-500">{testimonial.source}</p>
      </div>
    </div>
  )
}

const InitialsAvatar = ({ initials, className = '' }) => (
    <div
        className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center ${className}`}
        aria-hidden="true"
    >
        {initials}
    </div>
);

const TestimonialCard = ({ testimonial }) => {
    return (
        <article className="bg-white border-2 border-neutral-gray-100 rounded-xl p-spacing-xl shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg" aria-label={`Testimonial van ${testimonial.name}`}>
            <header className="flex items-start justify-between gap-spacing-md mb-spacing-lg">
                <div className="flex items-center gap-spacing-md">
                    <InitialsAvatar initials={testimonial.initials} className="w-11 h-11 text-font-size-h5" />
                    <div>
                        <p className="text-font-size-body font-extrabold text-neutral-dark leading-tight">{testimonial.name}</p>
                        <p className="text-font-size-small text-neutral-gray-500">{testimonial.event}</p>
                    </div>
                </div>
                <StarRating rating={testimonial.rating} label={`${testimonial.rating} van 5 sterren`} />
            </header>
            <p className="text-font-size-body text-neutral-gray-700 italic mb-spacing-lg">“{testimonial.quote}”</p>
            <footer className="flex items-center justify-between border-t border-neutral-gray-100 pt-spacing-md text-font-size-small text-neutral-gray-500">
                <time dateTime={testimonial.dateISO}>{testimonial.date}</time>
                <span className="flex items-center gap-1 font-semibold text-primary">
                    <span aria-hidden="true">{testimonial.platform.icon}</span>
                    {testimonial.platform.label}
                </span>
            </footer>
        </article>
    );
};

const StatsSection = () => (
    <section className="bg-neutral-light border-2 border-primary rounded-xl p-spacing-xl grid grid-cols-2 md:grid-cols-4 gap-spacing-lg" aria-label="Service statistieken">
        {statsData.map((stat) => (
            <div key={stat.id} className="relative text-center">
                <VisuallyHidden>{stat.srLabel}</VisuallyHidden>
                {stat.highlight ? (
                    <p className="text-font-size-h4 text-secondary mb-spacing-xs" aria-hidden="true">
                        {stat.highlight}
                    </p>
                ) : null}
                <p className="text-font-size-h2 font-black text-neutral-dark">{stat.value}</p>
                <p className="text-font-size-small font-semibold text-neutral-gray-600 uppercase tracking-wide">
                    {stat.label}
                </p>
            </div>
        ))}
    </section>
);

const FeaturedTestimonial = () => (
    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-neutral-dark text-white p-spacing-2xl" aria-label={`Uitgelichte testimonial van ${featuredTestimonial.author}`}>
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-b from-secondary/30 to-transparent opacity-50 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-spacing-xl md:flex-row md:items-start md:justify-between">
            <div className="md:max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-spacing-md py-spacing-xs text-font-size-small font-bold text-secondary">
                    {featuredTestimonial.badge}
                </p>
                <p className="mt-spacing-lg text-font-size-h4 font-semibold leading-relaxed italic">
                    “{featuredTestimonial.quote}”
                </p>
                <div className="mt-spacing-xl flex items-center gap-spacing-md">
                    <InitialsAvatar initials={featuredTestimonial.initials} className="w-12 h-12 text-font-size-h4" />
                    <div>
                        <p className="text-font-size-body font-extrabold">{featuredTestimonial.author}</p>
                        <p className="text-font-size-small text-neutral-gray-100">{featuredTestimonial.event}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-spacing-md text-center md:text-right">
                <StarRating rating={featuredTestimonial.rating} label={`${featuredTestimonial.rating} van 5 sterren`} />
                <p className="text-font-size-body font-semibold text-secondary">{featuredTestimonial.ratingText}</p>
                <p className="flex items-center gap-2 rounded-lg bg-white/10 px-spacing-md py-spacing-xs text-font-size-small font-semibold">
                    <span aria-hidden="true">{featuredTestimonial.platform.icon}</span>
                    {featuredTestimonial.platform.label}
                </p>
            </div>
        </div>
    </article>
);

const Testimonials = () => {
  const { t } = useTranslation()
  const testimonialsTranslation = t('testimonials.items', { returnObjects: true })
  const testimonialsData = Array.isArray(testimonialsTranslation) ? testimonialsTranslation : []

  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
          {t('testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
