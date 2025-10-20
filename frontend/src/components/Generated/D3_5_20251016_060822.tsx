// components/MoodBoardGenerator.jsx
import { useState } from 'react';
import styles from './MoodBoardGenerator.module.css';

const eventTypes = {
  wedding: {
    presets: [
      ['#FFFFFF', '#F8C3CD', '#E2B6B3', '#8E354A'],
      ['#F0F0F0', '#B28FCE', '#6A4C9C', '#8E354A'],
      ['#FFFFFF', '#D7C4BB', '#B4A582', '#6C4C49'],
    ],
    name: 'Wedding'
  },
  corporate: {
    presets: [
      ['#0F2027', '#203A43', '#2C5364', '#FFFFFF'],
      ['#232526', '#414345', '#707070', '#FFFFFF'],
      ['#000046', '#1CB5E0', '#000C40', '#FFFFFF'],
    ],
    name: 'Corporate'
  },
  party: {
    presets: [
      ['#FF416C', '#FF4B2B', '#F6DA63', '#FFFFFF'],
      ['#8E2DE2', '#4A00E0', '#FF1493', '#FFFFFF'],
      ['#11998e', '#38ef7d', '#FFD200', '#FFFFFF'],
    ],
    name: 'Party'
  }
};

const MoodBoardGenerator = () => {
  const [selectedEvent, setSelectedEvent] = useState('wedding');
  const [selectedScheme, setSelectedScheme] = useState(0);

  const handleSchemeSelect = (index) => {
    setSelectedScheme(index);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
    setSelectedScheme(0);
  };

  const copyToClipboard = (colors) => {
    navigator.clipboard.writeText(colors.join(', '))
      .then(() => alert('Color scheme copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className={styles.container}>
      <h2>Event Color Scheme Generator</h2>
      
      <select 
        value={selectedEvent}
        onChange={handleEventChange}
        className={styles.eventSelect}
      >
        {Object.entries(eventTypes).map(([key, value]) => (
          <option key={key} value={key}>{value.name}</option>
        ))}
      </select>

      <div className={styles.schemesContainer}>
        {eventTypes[selectedEvent].presets.map((scheme, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.scheme} ${selectedScheme === index ? styles.selected : ''}`}
            onClick={() => handleSchemeSelect(index)}
            aria-pressed={selectedScheme === index}
            aria-label={`Select color scheme ${index + 1} for ${eventTypes[selectedEvent].name}`}
          >
            {scheme.map((color, i) => (
              <div
                key={i}
                className={styles.colorBox}
                style={{ backgroundColor: color }}
              />
            ))}
          </button>
        ))}
      </div>

      <div className={styles.selectedColors}>
        <h3>Selected Colors:</h3>
        <div className={styles.colorList}>
          {eventTypes[selectedEvent].presets[selectedScheme].map((color, index) => (
            <div key={index} className={styles.colorItem}>
              <div 
                className={styles.colorPreview} 
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => copyToClipboard(eventTypes[selectedEvent].presets[selectedScheme])}
          className={styles.copyButton}
        >
          Copy Colors
        </button>
      </div>
    </div>
  );
};

export default MoodBoardGenerator;
