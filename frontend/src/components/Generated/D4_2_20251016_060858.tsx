// src/components/AwardsBadges.jsx
import React from 'react';
import styled from 'styled-components';

const AwardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Badge = styled.div`
  background: ${props => props.isLoveAward ? '#ff4d6d' : '#f8f9fa'};
  color: ${props => props.isLoveAward ? 'white' : '#333'};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 60px;
    height: 60px;
    margin-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
  
  p {
    font-size: 0.9rem;
    margin: 0;
  }
`;

const AwardsBadges = ({ awards }) => {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <AwardsContainer>
      {awards.map((award) => (
        <Badge 
          key={award.id}
          isLoveAward={award.type === 'love-award'}
        >
          <img 
            src={award.icon} 
            alt={`${award.name} badge`}
            loading="lazy"
          />
          <h3>{award.name}</h3>
          <p>{award.year}</p>
        </Badge>
      ))}
    </AwardsContainer>
  );
};

export default AwardsBadges;
