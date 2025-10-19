// components/SocialProofNotification.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  max-width: 300px;
  z-index: 1000;
  animation: slideIn 0.5s ease-out;
  
  @media (max-width: 768px) {
    bottom: 10px;
    left: 10px;
    max-width: calc(100% - 40px);
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
`;

// Mock data for demonstrations
const mockBookings = [
  { name: 'John D.', location: 'New York', time: '2 minutes ago', event: 'Wedding' },
  { name: 'Sarah M.', location: 'Los Angeles', time: '5 minutes ago', event: 'Birthday' },
  { name: 'Mike R.', location: 'Chicago', time: '10 minutes ago', event: 'Corporate' },
  // Add more mock data as needed
];

const SocialProofNotification = () => {
  const [visible, setVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    const showNotification = () => {
      const randomBooking = mockBookings[Math.floor(Math.random() * mockBookings.length)];
      setCurrentBooking(randomBooking);
      setVisible(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showNotification, 3000);

    // Show new notification every 15 seconds
    const interval = setInterval(showNotification, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible || !currentBooking) return null;

  return (
    <NotificationWrapper>
      <CloseButton onClick={() => setVisible(false)}>&times;</CloseButton>
      <div>
        <strong>{currentBooking.name}</strong> from {currentBooking.location}
        <br />
        booked a DJ for their {currentBooking.event}
        <br />
        <small>{currentBooking.time}</small>
      </div>
    </NotificationWrapper>
  );
};

export default SocialProofNotification;
