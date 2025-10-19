// EventTypeSelector.js
import React from 'react';
import { useEventType } from './EventTypeContext';
import './EventTypeSelector.css';

const EventTypeSelector = () => {
  const { eventType, setEventType } = useEventType();

  return (
    <div className="event-type-selector">
      <h3>What type of event are you planning?</h3>
      <div className="event-options">
        <button
          className={`event-option ${eventType === 'wedding' ? 'active' : ''}`}
          onClick={() => setEventType('wedding')}
        >
          <span>🎉</span>
          Wedding
        </button>
        <button
          className={`event-option ${eventType === 'corporate' ? 'active' : ''}`}
          onClick={() => setEventType('corporate')}
        >
          <span>💼</span>
          Corporate Event
        </button>
      </div>
    </div>
  );
};

export default EventTypeSelector;