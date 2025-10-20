// PricingCalculator.jsx
import { useState, useEffect } from 'react';
import './PricingCalculator.css';

const PricingCalculator = () => {
  // State management
  const [hours, setHours] = useState(4);
  const [guests, setGuests] = useState(50);
  const [extras, setExtras] = useState([]);
  const [total, setTotal] = useState(0);
  const hoursInputId = 'pricing-calculator-hours';
  const guestsInputId = 'pricing-calculator-guests';

  // Base pricing constants
  const BASE_RATE_PER_HOUR = 125;
  const GUEST_SURCHARGE = 0.5; // €0.50 per guest

  // Available extras
  const AVAILABLE_EXTRAS = [
    { id: 1, name: 'Lighting Package', price: 150 },
    { id: 2, name: 'Smoke Machine', price: 75 },
    { id: 3, name: 'Extra Speaker Set', price: 200 },
    { id: 4, name: 'Karaoke Setup', price: 100 }
  ];

  // Calculate total price
  useEffect(() => {
    const calculateTotal = () => {
      const basePrice = hours * BASE_RATE_PER_HOUR;
      const guestPrice = guests * GUEST_SURCHARGE;
      const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
      
      return basePrice + guestPrice + extrasTotal;
    };

    setTotal(calculateTotal());
  }, [hours, guests, extras]);

  // Handle extras toggle
  const handleExtraToggle = (extra) => {
    if (extras.find(e => e.id === extra.id)) {
      setExtras(extras.filter(e => e.id !== extra.id));
    } else {
      setExtras([...extras, extra]);
    }
  };

  return (
    <div className="pricing-calculator">
      <h2>Calculate Your Event Price</h2>
      
      <div className="calculator-section">
        <div className="input-group">
          <label htmlFor={hoursInputId}>Hours</label>
          <input
            type="range"
            min="2"
            max="8"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            id={hoursInputId}
            aria-valuenow={hours}
            aria-valuemin={2}
            aria-valuemax={8}
          />
          <span>{hours} hours</span>
        </div>

        <div className="input-group">
          <label htmlFor={guestsInputId}>Number of Guests</label>
          <input
            type="range"
            min="20"
            max="300"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            id={guestsInputId}
            aria-valuenow={guests}
            aria-valuemin={20}
            aria-valuemax={300}
          />
          <span>{guests} guests</span>
        </div>

        <div className="extras-section">
          <h3>Additional Services</h3>
          <div className="extras-grid">
            {AVAILABLE_EXTRAS.map(extra => (
              <button
                key={extra.id}
                type="button"
                className={`extra-item ${extras.find(e => e.id === extra.id) ? 'selected' : ''}`}
                onClick={() => handleExtraToggle(extra)}
                aria-pressed={extras.some(e => e.id === extra.id)}
                aria-label={`${extras.some(e => e.id === extra.id) ? 'Remove' : 'Add'} ${extra.name}`}
              >
                <span>{extra.name}</span>
                <span>€{extra.price}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="total-section">
          <h3>Total Price</h3>
          <div className="total-amount">€{total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
