// components/ScarcityBanner.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  background-color: #ff3b3b;
  color: white;
  padding: 8px 16px;
  text-align: center;
  font-weight: bold;
  animation: pulse 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
`;

const Icon = styled.span`
  margin-right: 8px;
`;

const ScarcityBanner = ({ availableDate }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Hide banner if date has passed
    const today = new Date();
    const targetDate = new Date(availableDate);
    if (today > targetDate) {
      setIsVisible(false);
    }
  }, [availableDate]);

  if (!isVisible) return null;

  return (
    <Banner role="alert" aria-live="polite">
      <Icon>⚡</Icon>
      Laatste beschikbare datum in augustus: {availableDate}
    </Banner>
  );
};

export default ScarcityBanner;
