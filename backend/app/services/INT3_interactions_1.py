// BookingWizard.tsx
import React, { useState } from 'react';
import { BookingFormData } from './types';

const initialFormData: BookingFormData = {
  eventDate: '',
  eventType: 'wedding',
  eventLocation: '',
  musicGenres: [],
  specialSongs: [],
  needsEquipment: false,
  equipmentItems: [],
  fullName: '',
  email: '',
  phone: '',
  termsAccepted: false,
  notes: ''
};

export const BookingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle field updates
  const handleUpdate = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for updated field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
        if (!formData.eventLocation) newErrors.eventLocation = 'Location is required';
        break;
      case 2:
        if (formData.musicGenres.length === 0) newErrors.musicGenres = 'Select at least one genre';
        break;
      case 4:
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        break;
      case 5:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final submission
  const handleSubmit = async () => {
    if (validateStep(5)) {
      try {
        // API call to submit booking
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Booking submission failed');

        // Handle success
        alert('Booking submitted successfully!');
      } catch (error) {
        console.error('Booking submission error:', error);
        setErrors({ submit: 'Failed to submit booking. Please try again.' });
      }
    }
  };

  return (
    <div className="booking-wizard">
      {/* Progress indicator */}
      <div className="progress-bar">
        {[1, 2, 3, 4, 5].map(step => (
          <div
            key={step}
            className={`step ${step <= currentStep ? 'active' : ''}`}
          >
            Step {step}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="step-content">
        {currentStep === 1 && (
          <EventDetailsStep
            data={formData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            errors={errors}
          />
        )}
        {/* Add similar conditions for other steps */}
      </div>

      {/* Navigation buttons */}
      <div className="wizard-navigation">
        {currentStep > 1 && (
          <button onClick={handlePrevious}>Previous</button>
        )}
        {currentStep < 5 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit Booking</button>
        )}
      </div>
    </div>
  );
};
