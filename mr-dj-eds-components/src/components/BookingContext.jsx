// BookingContext.jsx
import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    date: '',
    time: '',
    // ... other fields
  });

  const updateBookingData = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  return (
    <BookingContext.Provider 
      value={{ currentStep, setCurrentStep, bookingData, updateBookingData }}
    >
      {children}
    </BookingContext.Provider>
  );
};