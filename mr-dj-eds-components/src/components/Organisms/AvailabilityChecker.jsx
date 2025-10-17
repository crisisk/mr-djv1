import React, { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from '../ui/button.jsx';
import { trackEvent } from '../../lib/analytics.js';
import { getWindow } from '../../lib/environment.js';

const DEFAULT_EVENT_TYPES = ['Bruiloft', 'Bedrijfsfeest', 'Festival', 'Private event'];
const DEFAULT_PACKAGE_OPTIONS = ['Brons', 'Zilver', 'Goud'];

const resolveApiBase = () => {
  const browser = getWindow();
  if (!browser) {
    return '/api';
  }

  const envBase = import.meta?.env?.VITE_BACKEND_URL || import.meta?.env?.VITE_API_BASE_URL;
  if (envBase && typeof envBase === 'string') {
    return envBase.replace(/\/$/, '');
  }

  return '/api';
};

const buildErrorMessage = (payload) => {
  if (!payload) return 'Onbekende fout. Probeer het opnieuw of neem contact op met het team.';
  if (Array.isArray(payload)) {
    return payload
      .map((item) => (typeof item === 'string' ? item : item?.message))
      .filter(Boolean)
      .join('\n');
  }

  if (Array.isArray(payload.details) && payload.details.length) {
    return payload.details.map((detail) => `${detail.field}: ${detail.message}`).join('\n');
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  return 'Onbekende fout. Probeer het opnieuw of neem contact op met het team.';
};

const AvailabilityChecker = ({ personalization, onEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    packageId: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const leadCapture = personalization || {};
  const apiBase = useMemo(resolveApiBase, []);
  const eventTypeOptions = Array.isArray(leadCapture.eventTypeOptions) && leadCapture.eventTypeOptions.length
    ? leadCapture.eventTypeOptions
    : DEFAULT_EVENT_TYPES;
  const packageOptions = Array.isArray(leadCapture.packageOptions) && leadCapture.packageOptions.length
    ? leadCapture.packageOptions
    : DEFAULT_PACKAGE_OPTIONS;

  const defaultEventType = leadCapture.defaultEventType || eventTypeOptions[0] || '';
  const defaultPackageId = leadCapture.defaultPackageId || '';

  const handleChange = (field) => (event) => {
    const value = event?.target?.value ?? '';
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status) {
      setStatus(null);
    }
    if (!hasTrackedStart) {
      emitStartEvent({ field });
    }
  };

  const emitStartEvent = (context = {}) => {
    if (hasTrackedStart) return;
    trackEvent('availability_check_started', {
      component: 'AvailabilityChecker',
      ...context,
    });
    setHasTrackedStart(true);
    onEvent?.('journey_step', {
      step: 'availability_start',
      component: 'AvailabilityChecker',
      ...context
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();
    const selectedEventType = (form.eventType || defaultEventType || '').trim();

    if (!selectedDate || !trimmedEmail || !trimmedName || !trimmedPhone || !selectedEventType) {
      setStatus({
        type: 'error',
        message: 'Vul alstublieft alle verplichte velden (naam, e-mail, telefoon, datum en type evenement) in.'
      });
      return;
    }

    setStatus({ type: 'loading', message: 'Bezig met controleren...' });

    emitStartEvent({
      event_date: selectedDate?.toISOString(),
    });

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      eventType: selectedEventType,
      eventDate: selectedDate.toISOString(),
      packageId: form.packageId || defaultPackageId || null,
      message: form.message?.trim() || leadCapture.defaultMessage || null,
    };

    try {
      const response = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: buildErrorMessage(data) });
        return;
      }

      setStatus({ type: 'success', message: data.message || (leadCapture.successMessage ?? 'Aanvraag succesvol verzonden!') });
      setHasTrackedStart(false);
      setSelectedDate(null);
      setForm({
        name: '',
        email: '',
        phone: '',
        eventType: defaultEventType,
        packageId: defaultPackageId,
        message: ''
      });

      trackEvent('availability_check_success', {
        component: 'AvailabilityChecker',
        event_date: selectedDate.toISOString(),
      });
      trackEvent('lead_submitted', {
        component: 'AvailabilityChecker',
        lead_email_domain: trimmedEmail.split('@')[1] || null,
        event_date: selectedDate.toISOString(),
        event_type: selectedEventType,
      });
      onEvent?.('form_submit', {
        form: 'availability_checker',
        event_date: selectedDate.toISOString(),
        email_domain: trimmedEmail.split('@')[1] || null,
        event_type: selectedEventType,
        booking_id: data.bookingId,
        rentguy_delivery: data.rentGuySync?.delivered || false
      });
      onEvent?.('conversion', {
        form: 'availability_checker',
        variant: personalization?.id,
        booking_id: data.bookingId,
        rentguy_delivery: data.rentGuySync?.delivered || false
      });
    } catch (error) {
      setStatus({ type: 'error', message: `Netwerkfout: ${error.message}` });
    }
  };

  const statusClasses = status
    ? status.type === 'success'
      ? 'bg-green-600 text-neutral-light'
      : 'bg-red-600 text-neutral-light'
    : 'hidden';

  return (
    <section className="py-spacing-3xl bg-neutral-light">
      <div className="container mx-auto px-spacing-md max-w-lg shadow-xl rounded-lg p-spacing-2xl">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-lg font-extrabold">
          {leadCapture.formHeadline || 'Controleer Beschikbaarheid'}
        </h2>
        <p className="text-center text-neutral-dark mb-spacing-xl">
          {leadCapture.formCopy || 'Kies uw gewenste datum en wij controleren direct of Mr. DJ beschikbaar is.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-spacing-xl">
          <div className="grid gap-spacing-md">
            <div>
              <label htmlFor="name" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
                Naam
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={handleChange('name')}
                className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Voor- en achternaam"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
                Telefoonnummer
              </label>
              <input
                type="tel"
                id="phone"
                value={form.phone}
                onChange={handleChange('phone')}
                className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
                placeholder="06 1234 5678"
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) {
                  emitStartEvent({ event_date: date.toISOString() });
                }
              }}
              modifiersClassNames={{
                selected: 'bg-primary text-neutral-light rounded-full',
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
            <label htmlFor="email" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
              Uw E-mailadres
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange('email')}
              onFocus={() => emitStartEvent({})}
              className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder="uw.naam@voorbeeld.nl"
              required
            />
          </div>

          <div className="grid gap-spacing-md md:grid-cols-2">
            <div>
              <label htmlFor="eventType" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
                Type evenement
              </label>
              <select
                id="eventType"
                value={form.eventType || defaultEventType}
                onChange={handleChange('eventType')}
                className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
                required
              >
                {eventTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="packageId" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
                Gewenst pakket (optioneel)
              </label>
              <select
                id="packageId"
                value={form.packageId || defaultPackageId}
                onChange={handleChange('packageId')}
                className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Maak keuze tijdens intake</option>
                {packageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-font-size-body font-medium text-neutral-dark mb-spacing-sm">
              Extra informatie (optioneel)
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={handleChange('message')}
              rows={4}
              className="w-full p-spacing-md border border-neutral-gray-500 rounded-md focus:ring-primary focus:border-primary"
              placeholder={leadCapture.defaultMessage || 'Vertel ons over de locatie, aantal gasten of speciale wensen.'}
            />
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-spacing-md rounded-md text-neutral-light text-center ${statusClasses}`}>
              {status.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={status && status.type === 'loading'}
            onClick={() => {
              trackEvent('availability_cta_click', {
                component: 'AvailabilityChecker',
              });
              onEvent?.('cta_click', {
                cta: 'availability_submit',
                component: 'AvailabilityChecker'
              });
            }}
          >
            {status && status.type === 'loading' ? 'Bezig...' : 'Controleer & Vraag Aan'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AvailabilityChecker;
