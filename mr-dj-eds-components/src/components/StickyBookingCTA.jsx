// components/StickyBookingCTA.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { STICKY_BOOKING_CTA_CONSTANTS } from '../lib/themeConstants.js';
import { getWindow } from '../lib/environment.js';

const StickyCTAWrapper = styled.div`
  position: fixed;
  bottom: ${STICKY_BOOKING_CTA_CONSTANTS.desktopInset};
  right: ${STICKY_BOOKING_CTA_CONSTANTS.desktopInset};
  z-index: ${STICKY_BOOKING_CTA_CONSTANTS.zIndex};
  transform: translateY(${props => props.isVisible ? '0' : STICKY_BOOKING_CTA_CONSTANTS.hiddenTranslateY});
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    left: 0;
    padding: ${STICKY_BOOKING_CTA_CONSTANTS.mobilePadding};
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const BookButton = styled.button`
  background: #FF4136;
  color: white;
  padding: ${STICKY_BOOKING_CTA_CONSTANTS.buttonPaddingY} ${STICKY_BOOKING_CTA_CONSTANTS.buttonPaddingX};
  border-radius: ${STICKY_BOOKING_CTA_CONSTANTS.buttonRadius};
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
    const browserWindow = getWindow();
    if (!browserWindow) {
      return undefined;
    }

    const handleScroll = () => {
      const currentScroll = browserWindow.scrollY ?? browserWindow.pageYOffset ?? 0;
      const shouldShow = currentScroll > STICKY_BOOKING_CTA_CONSTANTS.scrollRevealThreshold;
      setIsVisible(shouldShow);
    };

    handleScroll();
    browserWindow.addEventListener('scroll', handleScroll, { passive: true });
    return () => browserWindow.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBooking = () => {
    // Add booking logic here
    console.warn('Booking initiated');
  };

  return (
    <StickyCTAWrapper isVisible={isVisible}>
      <BookButton onClick={handleBooking}>
        Book a DJ Now
      </BookButton>
    </StickyCTAWrapper>
  );
};

export default StickyBookingCTA;
