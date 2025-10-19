// src/templates/CityLandingTemplate.jsx
import React from 'react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ServicesList from '../components/ServicesList';
import LocalVenues from '../components/LocalVenues';
import ContactForm from '../components/ContactForm';

const CityLandingTemplate = ({ cityData }) => {
  const { 
    cityName, 
    heroImage, 
    description, 
    venues, 
    localTestimonials 
  } = cityData;

  return (
    <>
      <SEO 
        title={`DJ Services in ${cityName} | Mr. DJ`}
        description={`Professional DJ services for events in ${cityName}. Book your party DJ today!`}
      />
      
      <Hero 
        title={`DJ Services in ${cityName}`}
        image={heroImage}
        subtitle={`Your Premium Event DJ in ${cityName}`}
      />

      <section className="city-content">
        <div className="container mx-auto px-4 py-12">
          <h2>DJ Services in {cityName}</h2>
          <p>{description}</p>
          
          <ServicesList />
          
          <LocalVenues venues={venues} cityName={cityName} />
          
          <div className="testimonials">
            {localTestimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
          
          <ContactForm cityName={cityName} />
        </div>
      </section>
    </>
  );
};

export default CityLandingTemplate;
