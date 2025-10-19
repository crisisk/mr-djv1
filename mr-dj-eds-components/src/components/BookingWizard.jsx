// BookingWizard.jsx
import React, { useState, useContext } from 'react';
import { BookingContext } from './BookingContext';
import './BookingWizard.css';

const BookingWizard = () => {
  const { currentStep, setCurrentStep, bookingData, updateBookingData } = useContext(BookingContext);
  
  const steps = [
    { id: 1, title: 'Service Selection' },
    { id: 2, title: 'Date & Time' },
    { id: 3, title: 'Event Details' },
    { id: 4, title: 'Contact Info' },
    { id: 5, title: 'Confirmation' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <ServiceSelection onChange={handleInputChange} data={bookingData} />;
      case 2:
        return <DateTimeSelection onChange={handleInputChange} data={bookingData} />;
      // ... other steps
      default:
        return <Confirmation data={bookingData} />;
    }
  };

  return (
    <div className="booking-wizard">
      <div className="progress-indicator">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`step ${currentStep >= step.id ? 'active' : ''}`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
      
      <div className="step-content">
        {renderStep()}
      </div>
      
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button onClick={prevStep} className="btn-prev">
            Previous
          </button>
        )}
        {currentStep < steps.length ? (
          <button onClick={nextStep} className="btn-next">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-submit">
            Confirm Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;