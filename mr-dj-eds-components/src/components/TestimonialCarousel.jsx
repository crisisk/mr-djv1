// TestimonialCarousel.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const CarouselSlide = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  position: ${props => (props.active ? 'relative' : 'absolute')};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TestimonialImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const TestimonialContent = styled.div`
  flex: 1;
`;

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/images/testimonial-1.jpg",
    text: "Mr. DJ made our wedding absolutely unforgettable! The music selection was perfect and kept everyone dancing all night long.",
    role: "Wedding Client"
  },
  // Add more testimonials...
];

const TestimonialCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <CarouselContainer>
      {testimonials.map((testimonial, index) => (
        <CarouselSlide key={testimonial.id} active={index === currentSlide}>
          <TestimonialImage 
            src={testimonial.image} 
            alt={testimonial.name}
            onError={(e) => {
              e.target.src = '/images/default-avatar.jpg';
            }}
          />
          <TestimonialContent>
            <blockquote>"{testimonial.text}"</blockquote>
            <h4>{testimonial.name}</h4>
            <p>{testimonial.role}</p>
          </TestimonialContent>
        </CarouselSlide>
      ))}
      
      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </CarouselContainer>
  );
};

export default TestimonialCarousel;