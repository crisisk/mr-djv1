// components/TrustBadges.jsx
import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1.5rem 0;
  }
`;

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 80px;
    height: 80px;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }
  
  p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }
`;

const TrustBadges = () => {
  const badges = [
    {
      icon: '/images/badges/insurance.svg',
      text: 'Fully Insured'
    },
    {
      icon: '/images/badges/certified.svg',
      text: 'Professional Certified'
    },
    {
      icon: '/images/badges/award.svg',
      text: 'Award Winning Service'
    },
    {
      icon: '/images/badges/guarantee.svg',
      text: '100% Satisfaction Guaranteed'
    }
  ];

  return (
    <BadgeContainer>
      {badges.map((badge, index) => (
        <Badge key={index}>
          <img 
            src={badge.icon} 
            alt={badge.text}
            loading="lazy"
          />
          <p>{badge.text}</p>
        </Badge>
      ))}
    </BadgeContainer>
  );
};

export default TrustBadges;
