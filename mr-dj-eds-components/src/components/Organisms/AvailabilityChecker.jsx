import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Button from '../Atoms/Buttons.jsx';
import { submitBooking } from '../../services/api.js';
import { trackAvailabilityCheck, trackFormSubmission, getUserVariant } from '../../utils/trackConversion';

const EVENT_TYPES = [
  { value: 'bruiloft', label: 'Bruiloft' },
  { value: 'bedrijfsfeest', label: 'Bedrijfsfeest' },
  { value: 'verjaardag', label: 'Verjaardag' },
  { value: 'jubileum', label: 'Jubileum' },
  { value: 'feest', label: 'Algemeen feest' },
  { value: 'anders', label: 'Anders' }
];

const PACKAGES = [
  { value: '', label: 'Geen voorkeur' },
  { value: 'bronze', label: 'Brons pakket' },
  { value: 'silver', label: 'Zilver pakket (meest gekozen)' },
  { value: 'gold', label: 'Goud pakket' }
];

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  packageId: '',
  message: ''
};

const AvailabilityChecker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'loading', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setStatus({ type: 'error', message: 'Vul alstublieft uw naam, e-mailadres en telefoonnummer in.' });
      return;
    }

    if (!formData.eventType) {
      setStatus({ type: 'error', message: 'Selecteer een type evenement.' });
      return;
    }

    if (!selectedDate) {
      setStatus({ type: 'error', message: 'Kies een gewenste datum voor uw event.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'loading', message: 'Bezig met controleren...' });

    const variant = getUserVariant();
    const eventDateIso = selectedDate.toISOString().split('T')[0];

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        eventType: formData.eventType,
        eventDate: eventDateIso,
        message: formData.message.trim() || undefined,
        packageId: formData.packageId || undefined
      };

      const response = await submitBooking(payload);

      trackAvailabilityCheck(variant, eventDateIso);
      trackFormSubmission(variant, formData.eventType, 'availability');

      setStatus({
        type: 'success',
        message: response?.message || 'Beschikbaarheid gecontroleerd! We nemen binnen 24 uur contact op.'
      });
      setFormData(initialFormState);
      setSelectedDate(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Er ging iets mis bij het verzenden. Probeer het later opnieuw of bel direct met Mister DJ.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClasses = status
    ? status.type === 'success'
      ? 'bg-semantic-success'
      : status.type === 'error'
        ? 'bg-semantic-error'
        : 'bg-neutral-gray-200'
    : 'hidden';
  const statusTextClass = status && status.type === 'loading' ? 'text-neutral-dark' : 'text-white';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-lg shadow-xl rounded-lg p-12">
        <h2 className="text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold">
          Controleer Beschikbaarheid
        </h2>
        <p className="text-center text-[#1A2C4B] mb-8">
          Kies uw gewenste datum en wij controleren direct of Mr. DJ beschikbaar is.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Naam */}
          <div>
            <label htmlFor="name" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Naam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Uw naam"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Uw e-mailadres <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder="uw.naam@voorbeeld.nl"
              required
            />
          </div>

          {/* Telefoonnummer */}
          <div>
            <label htmlFor="phone" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Telefoonnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder="+31 6 12345678"
              required
            />
          </div>

          {/* Event Type */}
          <div>
            <label htmlFor="eventType" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Type evenement <span className="text-red-500">*</span>
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Selecteer type evenement</option>
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pakket keuze */}
          <div>
            <label htmlFor="packageId" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Gewenst pakket
            </label>
            <select
              id="packageId"
              name="packageId"
              value={formData.packageId}
              onChange={handleChange}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
            >
              {PACKAGES.map((pkg) => (
                <option key={pkg.value || 'none'} value={pkg.value}>
                  {pkg.label}
                </option>
              ))}
            </select>
          </div>

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

          {/* Aanvullende informatie */}
          <div>
            <label htmlFor="message" className="block text-base font-medium text-[#1A2C4B] mb-2">
              Aanvullende wensen
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary resize-none"
              placeholder="Bijvoorbeeld locatie, aantal gasten of speciale verzoeken"
            />
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`p-4 rounded-md text-center ${statusClasses} ${statusTextClass}`}
              role={status.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {status.message || 'Bezig met controleren...'}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Bezig...' : 'Controleer & Vraag Aan'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AvailabilityChecker;
