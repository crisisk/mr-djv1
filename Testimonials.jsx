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
