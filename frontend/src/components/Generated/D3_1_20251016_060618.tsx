// components/StickyBookingCTA.jsx
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { recordBookingCta } from '../../lib/ctaTracking';

const StickyCTAWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transform: translateY(${props => props.isVisible ? '0' : '100px'});
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const BookButton = styled.button`
  background: #FF4136;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #E03026;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StickyBookingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 300px
      const shouldShow = window.scrollY > 300;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBooking = useCallback(() => {
    void recordBookingCta({
      cta: 'sticky-booking-cta',
      metadata: {
        surface: 'sticky_booking_cta',
        trigger: 'scroll_depth',
      },
      navigateTo: '/#contact',
    }).catch((error) => {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[StickyBookingCTA] Failed to record CTA', error);
      }
    });
  }, []);

  return (
    <StickyCTAWrapper isVisible={isVisible}>
      <BookButton onClick={handleBooking}>
        Book a DJ Now
      </BookButton>
    </StickyCTAWrapper>
  );
};

export default StickyBookingCTA;
