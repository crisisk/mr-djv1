// src/components/BookingNotification.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(${props => props.show ? '0' : '100px'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 1000;
  
  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
`;

const mockBookings = [
  { name: 'Jan', location: 'Eindhoven', timeAgo: '3 min' },
  { name: 'Lisa', location: 'Amsterdam', timeAgo: '7 min' },
  { name: 'Peter', location: 'Rotterdam', timeAgo: '12 min' },
];

const BookingNotification = () => {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          setCurrentNotification((prev) => 
            (prev + 1) % mockBookings.length
          );
        }, 300);
      }, 4000);
    };

    const interval = setInterval(() => {
      showNotification();
    }, 8000);

    // Show first notification after component mount
    showNotification();

    return () => clearInterval(interval);
  }, []);

  const booking = mockBookings[currentNotification];

  return (
    <NotificationWrapper show={show}>
      <span>
        {booking.name} uit {booking.location} boekte {booking.timeAgo} geleden
      </span>
    </NotificationWrapper>
  );
};

export default BookingNotification;