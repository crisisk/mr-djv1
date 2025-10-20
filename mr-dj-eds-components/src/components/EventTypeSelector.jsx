// EventTypeSelector.jsx
import React, { useState } from 'react';
import './EventTypeSelector.css';
import { Icon } from '../icons/index.jsx';

const eventTypes = [
  {
    id: 'wedding',
    title: 'Wedding',
    icon: 'icon-wedding',
    description: 'Perfect music for your special day'
  },
  {
    id: 'corporate',
    title: 'Corporate Event',
    icon: 'icon-corporate',
    description: 'Professional entertainment for business events'
  },
  {
    id: 'birthday',
    title: 'Birthday Party',
    icon: 'icon-private-party',
    description: 'Fun and energetic party music'
  },
  {
    id: 'festival',
    title: 'Festival',
    icon: 'icon-festival',
    description: 'High-energy festival experience'
  }
];

const EventTypeSelector = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (eventType) => {
    setSelectedType(eventType.id);
    onSelect(eventType);
  };

  return (
    <div className="event-type-container">
      <h2>Select Your Event Type</h2>
      <div className="event-type-grid">
        {eventTypes.map((eventType) => (
          <div
            key={eventType.id}
            className={`event-type-card ${selectedType === eventType.id ? 'selected' : ''}`}
            onClick={() => handleSelect(eventType)}
          >
            <div className="event-type-icon">
              <Icon name={eventType.icon} size={40} className="text-primary" />
            </div>
            <h3>{eventType.title}</h3>
            <p>{eventType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;