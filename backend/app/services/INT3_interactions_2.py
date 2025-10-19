// EventDetailsStep.tsx
import React from 'react';
import { StepProps } from './types';

export const EventDetailsStep: React.FC<StepProps> = ({
  data,
  onUpdate,
  errors
}) => {
  return (
    <div className="step-form">
      <h2>Event Details</h2>
      
      <div className="form-group">
        <label htmlFor="eventDate">Event Date</label>
        <input
          type="date"
          id="eventDate"
          value={data.eventDate}
          onChange={(e) => onUpdate('eventDate', e.target.value)}
          className={errors.eventDate ? 'error' : ''}
        />
        {errors.eventDate && (
          <span className="error-message">{errors.eventDate}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="eventType">Event Type</label>
        <select
          id="eventType"
          value={data.eventType}
          onChange={(e) => onUpdate('eventType', e.target.value)}
        >
          <option value="wedding">Wedding</option>
          <option value="birthday">Birthday</option>
          <option value="corporate">Corporate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="eventLocation">Event Location</label>
        <input
          type="text"
          id="eventLocation"
          value={data.eventLocation}
          onChange={(e) => onUpdate('eventLocation', e.target.value)}
          className={errors.eventLocation ? 'error' : ''}
        />
        {errors.eventLocation && (
          <span className="error-message">{errors.eventLocation}</span>
        )}
      </div>
    </div>
  );
};
