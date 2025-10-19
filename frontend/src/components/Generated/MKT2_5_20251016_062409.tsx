// src/components/CaseStudies.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const CaseStudiesWrapper = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CaseStudyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CaseStudyCard = styled.article`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const EventDetails = styled.div`
  padding: 1.5rem;
`;

const caseStudies = [
  {
    id: 1,
    title: "Summer Beach Festival 2023",
    type: "Festival",
    location: "Miami Beach",
    attendance: "5000+",
    image: "/images/beach-festival.jpg",
    testimonial: "The energy was incredible! Best beach party ever!",
    client: "Beach Events Co."
  },
  // Add more case studies...
];

const CaseStudies = () => {
  const [filter, setFilter] = useState('all');

  return (
    <CaseStudiesWrapper>
      <h2>Success Stories</h2>
      <p>Discover how we've helped create unforgettable events</p>
      
      <div className="filters">
        <button onClick={() => setFilter('all')}>All Events</button>
        <button onClick={() => setFilter('festival')}>Festivals</button>
        <button onClick={() => setFilter('wedding')}>Weddings</button>
        <button onClick={() => setFilter('corporate')}>Corporate</button>
      </div>

      <CaseStudyGrid>
        {caseStudies
          .filter(study => filter === 'all' || study.type.toLowerCase() === filter)
          .map(study => (
            <CaseStudyCard key={study.id}>
              <EventImage src={study.image} alt={study.title} />
              <EventDetails>
                <h3>{study.title}</h3>
                <p>{study.type} • {study.location}</p>
                <p>{study.attendance} Attendees</p>
                <blockquote>"{study.testimonial}"</blockquote>
                <p>- {study.client}</p>
              </EventDetails>
            </CaseStudyCard>
          ))}
      </CaseStudyGrid>
    </CaseStudiesWrapper>
  );
};

export default CaseStudies;
