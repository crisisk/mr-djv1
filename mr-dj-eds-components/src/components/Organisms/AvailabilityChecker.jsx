import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Button from '../Atoms/Buttons.jsx';
import { trackAvailabilityCheck, getUserVariant } from '../../utils/trackConversion';

// HubSpot Form Submission Logic (Placeholder)
const submitToHubSpot = async (formData) => {
  const portalId = 'YOUR_HUBSPOT_PORTAL_ID'; // VERVANGEN
  const formGuid = 'YOUR_HUBSPOT_FORM_GUID'; // VERVANGEN
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  const fields = Object.keys(formData).map(key => ({
    name: key,
    value: formData[key]
  }));

  const data = {
    fields: fields,
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true, message: 'Aanvraag succesvol verzonden!' };
    } else {
      const errorData = await response.json();
      return { success: false, message: `Fout bij verzenden: ${errorData.message || 'Onbekende fout'}` };
    }
  } catch (error) {
    return { success: false, message: `Netwerkfout: ${error.message}` };
  }
};

const AvailabilityChecker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !email) {
      setStatus({ type: 'error', message: 'Vul alstublieft een datum en e-mailadres in.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Bezig met controleren...' });

    const formData = {
      event_date: selectedDate.toLocaleDateString('nl-NL'),
      email: email,
      // Voeg hier meer velden toe indien nodig
    };

    // Simuleer beschikbaarheidscheck en HubSpot-verzending
    const result = await submitToHubSpot(formData);

    if (result.success) {
      // Track conversion
      const variant = getUserVariant();
      trackAvailabilityCheck(variant, formData.event_date);

      setStatus({ type: 'success', message: 'Beschikbaarheid gecontroleerd! We nemen contact op via e-mail.' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const statusClasses = status ? (status.type === 'success' ? 'bg-semantic-success' : 'bg-semantic-error') : 'hidden';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-lg shadow-xl rounded-lg p-12">
        <h2 className="text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold">
          Controleer Beschikbaarheid
        </h2>
        <p className="text-center text-[#1A2C4B] mb-8">
          Kies uw gewenste datum en wij controleren direct of Mr. DJ beschikbaar is.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Picker */}
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiersClassNames={{
                selected: 'bg-primary text-white rounded-full',
                today: 'border border-primary rounded-full',
              }}
              styles={{
                caption: { color: 'var(--color-primary-blue)' },
                head: { color: 'var(--color-neutral-dark)' },
              }}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Uw E-mailadres
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder="uw.naam@voorbeeld.nl"
              required
            />
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-md text-white text-center ${statusClasses}`}>
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={status && status.type === 'loading'}
          >
            {status && status.type === 'loading' ? 'Bezig...' : 'Controleer & Vraag Aan'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AvailabilityChecker;
