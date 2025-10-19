// CTAButton.jsx
import React from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledButton = styled.button`
  background: #FF4D4D;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 16px;
  }
`;

const UrgencyIndicator = styled.div`
  background: rgba(255, 77, 77, 0.1);
  color: #FF4D4D;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const CTAButton = ({ buttonText, availableDates }) => {
  return (
    <ButtonWrapper>
      <UrgencyIndicator>
        Nog {availableDates} datums beschikbaar deze maand
      </UrgencyIndicator>
      <StyledButton>
        {buttonText}
      </StyledButton>
    </ButtonWrapper>
  );
};

export default CTAButton;