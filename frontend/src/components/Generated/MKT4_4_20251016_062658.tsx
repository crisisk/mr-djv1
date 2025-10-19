// PricingPage.jsx

import React, { useState } from 'react';
import VideoTestimonial from './components/VideoTestimonial';

const testimonials = [
  {
    id: 1,
    videoUrl: '/videos/testimonial-wedding-john.mp4',
    thumbnail: '/images/testimonial-thumb-1.jpg',
    name: 'John & Sarah',
    event: 'Wedding Reception',
    quote: "Best DJ we could have hoped for!"
  },
  {
    id: 2,
    videoUrl: '/videos/testimonial-corporate-lisa.mp4',
    thumbnail: '/images/testimonial-thumb-2.jpg',
    name: 'Lisa Martinez',
    event: 'Corporate Event',
    quote: "Incredibly professional service"
  },
  // Add more testimonials as needed
];

const TestimonialsSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="testimonials-section">
      <h2 className="text-3xl font-bold text-center mb-8">
        What Our Clients Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <VideoTestimonial
            key={testimonial.id}
            testimonial={testimonial}
            isActive={activeVideo === testimonial.id}
            onPlay={() => setActiveVideo(testimonial.id)}
          />
        ))}
      </div>
    </section>
  );
};

// VideoTestimonial.jsx component
const VideoTestimonial = ({ testimonial, isActive, onPlay }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    console.error(`Failed to load video: ${testimonial.videoUrl}`);
  };

  return (
    <div className="video-testimonial rounded-lg shadow-lg overflow-hidden">
      {!error ? (
        <div className="relative aspect-video">
          <video
            poster={testimonial.thumbnail}
            controls
            preload="none"
            className="w-full h-full object-cover"
            onError={handleError}
            onClick={onPlay}
          >
            <source src={testimonial.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="bg-gray-200 aspect-video flex items-center justify-center">
          <p>Video unavailable</p>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-xl">{testimonial.name}</h3>
        <p className="text-gray-600">{testimonial.event}</p>
        <p className="mt-2 italic">"{testimonial.quote}"</p>
      </div>
    </div>
  );
};

export default TestimonialsSection;
