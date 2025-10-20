import React, { useEffect, useMemo, useRef, useState } from 'react';
import { testimonials as defaultTestimonials } from '../../data/testimonials.js';

const StarRating = ({ rating }) => {
  const stars = useMemo(
    () =>
      Array(5)
        .fill(0)
        .map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-secondary' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )),
    [rating]
  );

  return <div className="flex" aria-hidden="true">{stars}</div>;
};

const TestimonialCard = ({ testimonial, isActive, slideId, index, total }) => {
  return (
    <article
      id={slideId}
      className={`bg-white p-8 rounded-lg shadow-xl flex flex-col h-full transition-transform duration-500 ease-out ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-40 md:opacity-60 translate-y-2'
      }`}
      role="group"
      aria-roledescription="slide"
      aria-label={`Testimonial ${index + 1} van ${total}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <StarRating rating={testimonial.rating} />
      <blockquote
        className="text-2xl text-[#1A2C4B] italic my-spacing-lg flex-grow"
        aria-live={isActive ? 'polite' : undefined}
      >
        “{testimonial.reviewBody}”
      </blockquote>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-base font-bold text-primary">{testimonial.author}</p>
        <p className="text-sm text-gray-500">{testimonial.event}</p>
      </div>
    </article>
  );
};

const Testimonials = ({ testimonials = defaultTestimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);
  const testimonialsCount = testimonials.length;

  const goToIndex = (index) => {
    setActiveIndex((index + testimonialsCount) % testimonialsCount);
  };

  const goToNext = () => {
    goToIndex(activeIndex + 1);
  };

  const goToPrev = () => {
    goToIndex(activeIndex - 1);
  };

  useEffect(() => {
    if (isPaused) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      return undefined;
    }

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsCount);
    }, 6000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPaused, testimonialsCount]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleFocus = () => handlePause();
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      handleResume();
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Home':
        event.preventDefault();
        goToIndex(0);
        break;
      case 'End':
        event.preventDefault();
        goToIndex(testimonialsCount - 1);
        break;
      default:
        break;
    }
  };

  return (
    <section
      className="py-16 bg-gray-100"
      aria-labelledby="testimonials-heading"
      role="region"
    >
      <div className="container mx-auto px-4">
        <h2
          id="testimonials-heading"
          className="text-4xl text-center text-[#1A2C4B] mb-12 font-extrabold"
        >
          Wat Klanten Zeggen
        </h2>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-live="polite"
          aria-label="Testimonials carrousel"
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-2 md:px-6" role="presentation">
                  <TestimonialCard
                    testimonial={testimonial}
                    isActive={index === activeIndex}
                    slideId={`testimonial-slide-${index}`}
                    index={index}
                    total={testimonialsCount}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-6 pointer-events-none">
            <button
              type="button"
              onClick={goToPrev}
              className="pointer-events-auto bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition"
              aria-label="Toon vorige testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="pointer-events-auto bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition"
              aria-label="Toon volgende testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Testimonials selecties">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === activeIndex ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ga naar testimonial ${index + 1}`}
                aria-controls={`testimonial-slide-${index}`}
                role="tab"
                aria-selected={index === activeIndex}
                tabIndex={index === activeIndex ? 0 : -1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
export { defaultTestimonials };
