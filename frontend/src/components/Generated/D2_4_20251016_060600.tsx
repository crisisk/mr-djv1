import React, { useState } from 'react';
import { Pannellum } from "pannellum-react";
import styled from 'styled-components';

const TourContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const SetupSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SetupButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#FF4081' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF4081;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  color: white;
`;

const setups = [
  {
    id: 'basic',
    name: 'Basic Setup',
    image: '/images/360/basic-setup.jpg'
  },
  {
    id: 'premium',
    name: 'Premium Setup',
    image: '/images/360/premium-setup.jpg'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Setup',
    image: '/images/360/ultimate-setup.jpg'
  }
];

const VanSetupTour = () => {
  const [activeSetup, setActiveSetup] = useState(setups[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSetupChange = (setup) => {
    setIsLoading(true);
    setActiveSetup(setup);
  };

  return (
    <div>
      <h2>Explore Our DJ Van Setups</h2>
      <SetupSelector>
        {setups.map(setup => (
          <SetupButton
            key={setup.id}
            active={activeSetup.id === setup.id}
            onClick={() => handleSetupChange(setup)}
          >
            {setup.name}
          </SetupButton>
        ))}
      </SetupSelector>
      
      <TourContainer>
        {error ? (
          <div className="error-message">
            {error}
          </div>
        ) : (
          <Pannellum
            width="100%"
            height="100%"
            image={activeSetup.image}
            pitch={10}
            yaw={180}
            hfov={110}
            autoLoad
            onLoad={() => setIsLoading(false)}
            onError={() => setError('Failed to load 360° view')}
          />
        )}
        
        {isLoading && (
          <LoadingOverlay>
            Loading 360° View...
          </LoadingOverlay>
        )}
      </TourContainer>
    </div>
  );
};

export default VanSetupTour;
