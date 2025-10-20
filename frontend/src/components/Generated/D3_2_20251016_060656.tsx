// components/WhatsAppChat.jsx
import React from 'react';
import styled from 'styled-components';
import { WhatsAppIcon } from '../../icons';

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background-color: #128C7E;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }
`;

const WhatsAppChat = () => {
  // Replace with actual business phone number
  const phoneNumber = '1234567890';
  const message = 'Hi! I would like to book a DJ.';
  
  const handleClick = () => {
    try {
      // Track analytics event
      if (window.gtag) {
        window.gtag('event', 'whatsapp_click', {
          'event_category': 'engagement',
          'event_label': 'whatsapp_chat'
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  return (
    <WhatsAppButton 
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onClick={handleClick}
    >
      <WhatsAppIcon aria-hidden="true" />
    </WhatsAppButton>
  );
};

export default WhatsAppChat;
