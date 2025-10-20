import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Button from '../Atoms/Buttons.jsx';
import { submitBooking } from '../../services/api';
import {
  getUserVariant,
  trackAvailabilityCheck,
  trackFormSubmission,
} from '../../utils/trackConversion';

const EVENT_TYPES = [
  { value: '', label: 'Kies een type evenement' },
  { value: 'bruiloft', label: 'Bruiloft' },
  { value: 'bedrijfsfeest', label: 'Bedrijfsfeest' },
  { value: 'verjaardag', label: 'Verjaardag' },
  { value: 'jubileum', label: 'Jubileum' },
  { value: 'anders', label: 'Anders' },
];

const PACKAGE_OPTIONS = [
  { value: '', label: 'Geen voorkeur / maatwerk' },
  { value: 'brons', label: 'Brons – DJ Basic' },
  { value: 'zilver', label: 'Zilver – Meest gekozen' },
  { value: 'goud', label: 'Goud – Premium All-In' },
];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  packageId: '',
  message: '',
};

const AvailabilityChecker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) {
      return '';
    }
    return format(selectedDate, 'yyyy-MM-dd');
  }, [selectedDate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Naam is verplicht';
    } else if (formData.name.trim().length < 2) {
      validationErrors.name = 'Naam moet minimaal 2 tekens bevatten';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      validationErrors.email = 'E-mailadres is verplicht';
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = 'Vul een geldig e-mailadres in';
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'Telefoonnummer is verplicht';
    } else if (!/[\d\s\-\+()]{6,}/.test(formData.phone)) {
      validationErrors.phone = 'Telefoonnummer lijkt ongeldig';
    }

    if (!formData.eventType) {
      validationErrors.eventType = 'Selecteer een type evenement';
    }

    if (!selectedDate) {
      validationErrors.eventDate = 'Kies een datum voor het evenement';
    }

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: null, message: '' });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      eventType: formData.eventType,
      eventDate: selectedDateLabel,
    };

    if (formData.packageId) {
      payload.packageId = formData.packageId;
    }

    if (formData.message.trim()) {
      payload.message = formData.message.trim();
    }

    try {
      const response = await submitBooking(payload);

      const variant = getUserVariant();
      trackAvailabilityCheck(variant, payload.eventDate);
      trackFormSubmission(variant, payload.eventType, 'availability');

      setStatus({
        type: 'success',
        message:
          response?.message ||
          'Bedankt! We controleren de beschikbaarheid en nemen binnen 24 uur contact op.',
      });

      setFormData(INITIAL_FORM_STATE);
      setSelectedDate(null);

      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 5000);
    } catch (error) {
      const fieldErrors = {};
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail) => {
          if (detail?.field) {
            fieldErrors[detail.field] = detail.message;
          }
        });
      }

      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setStatus({
        type: 'error',
        message: error.message || 'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-2xl shadow-xl rounded-lg p-12">
        <h2 className="text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold">
          Controleer Beschikbaarheid
        </h2>
        <p className="text-center text-[#1A2C4B] mb-10">
          Vul je gegevens in en wij koppelen binnen 24 uur terug met een definitieve bevestiging.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-base font-medium text-[#1A2C4B] mb-2">
                Naam <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-md focus:ring-primary focus:border-primary ${
                  errors.name ? 'border-red-500' : 'border-neutral-gray-500'
                }`}
                placeholder="Voor- en achternaam"
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-base font-medium text-[#1A2C4B] mb-2">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-md focus:ring-primary focus:border-primary ${
                  errors.email ? 'border-red-500' : 'border-neutral-gray-500'
                }`}
                placeholder="naam@voorbeeld.nl"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="text-base font-medium text-[#1A2C4B] mb-2">
                Telefoonnummer <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-md focus:ring-primary focus:border-primary ${
                  errors.phone ? 'border-red-500' : 'border-neutral-gray-500'
                }`}
                placeholder="06 12345678"
                autoComplete="tel"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="eventType" className="text-base font-medium text-[#1A2C4B] mb-2">
                Type evenement <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-md focus:ring-primary focus:border-primary ${
                  errors.eventType ? 'border-red-500' : 'border-neutral-gray-500'
                }`}
              >
                {EVENT_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.eventType && <p className="text-red-500 text-sm mt-2">{errors.eventType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-base font-medium text-[#1A2C4B] mb-2">
                Gewenste datum <span className="text-red-500">*</span>
              </span>
              <div
                className={`rounded-lg border ${
                  errors.eventDate ? 'border-red-500' : 'border-neutral-gray-500'
                } p-2`}
              >
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  fromDate={new Date()}
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
              {errors.eventDate && <p className="text-red-500 text-sm mt-2">{errors.eventDate}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="packageId" className="text-base font-medium text-[#1A2C4B] mb-2">
                Gewenst pakket
              </label>
              <select
                id="packageId"
                name="packageId"
                value={formData.packageId}
                onChange={handleInputChange}
                className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              >
                {PACKAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label htmlFor="message" className="text-base font-medium text-[#1A2C4B] mt-6 mb-2">
                Extra informatie (optioneel)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-4 border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Vertel ons meer over jullie plannen, locatie of speciale wensen."
              />
            </div>
          </div>

          {status.type && (
            <div
              className={`p-4 rounded-md text-center text-white ${
                status.type === 'success' ? 'bg-semantic-success' : 'bg-semantic-error'
              }`}
            >
              {status.message}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Versturen…' : 'Controleer & Verstuur Aanvraag'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AvailabilityChecker;
