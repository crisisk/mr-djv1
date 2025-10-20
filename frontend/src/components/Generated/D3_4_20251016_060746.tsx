// EventTypeSelector.jsx
import { useState } from 'react';
import './EventTypeSelector.css';

const eventTypes = [
  {
    id: 'wedding',
    title: 'Wedding',
    icon: '💒',
    description: 'Perfect music for your special day'
  },
  {
    id: 'corporate',
    title: 'Corporate Event',
    icon: '🏢',
    description: 'Professional entertainment for business events'
  },
  {
    id: 'birthday',
    title: 'Birthday Party',
    icon: '🎉',
    description: 'Fun and energetic party music'
  },
  {
    id: 'festival',
    title: 'Festival',
    icon: '🎪',
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
          <button
            key={eventType.id}
            type="button"
            className={`event-type-card ${selectedType === eventType.id ? 'selected' : ''}`}
            onClick={() => handleSelect(eventType)}
            aria-pressed={selectedType === eventType.id}
            aria-label={`Select ${eventType.title}`}
          >
            <div className="event-type-icon">{eventType.icon}</div>
            <h3>{eventType.title}</h3>
            <p>{eventType.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;
