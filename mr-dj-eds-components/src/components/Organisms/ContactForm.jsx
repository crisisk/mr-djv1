import React, { useEffect, useRef, useState } from 'react';
import { submitContactForm } from '../../services/api';
import Button from '../Atoms/Buttons';
import { trackFormSubmission } from '../../utils/trackConversion';
import { useHCaptchaWidget } from '../../hooks/useHCaptchaWidget.js';

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

/**
 * ContactForm Component
 *
 * Full-featured contact form with validation, loading states, and error handling
 * Integrates with backend API via submitContactForm service
 *
 * Props:
 * @param {string} variant - Form variant for A/B testing (optional)
 * @param {string} eventType - Pre-filled event type (optional, e.g., "bruiloft")
 */
const ContactForm = ({ variant = 'A', eventType: initialEventType = '' }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    eventType: initialEventType,
    eventDate: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const successTimeoutRef = useRef(null);
  const captcha = useHCaptchaWidget(HCAPTCHA_SITE_KEY);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Naam is verplicht';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Naam moet minimaal 2 tekens bevatten';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is verplicht';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Ongeldig emailadres';
    }

    // Phone validation (backend requires a phone number with minimum length)
    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      errors.phone = 'Telefoonnummer is verplicht';
    } else {
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      if (digitsOnly.length < 6) {
        errors.phone = 'Telefoonnummer moet minimaal 6 cijfers bevatten';
      } else if (!/^[\d\s\-+()]+$/.test(trimmedPhone)) {
        errors.phone = 'Ongeldig telefoonnummer';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Bericht is verplicht';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Bericht moet minimaal 10 tekens bevatten';
    }

    // Event type validation
    if (!formData.eventType) {
      errors.eventType = 'Selecteer een type evenement';
    }

    // Event date validation (optional, but must be in the future when provided)
    if (formData.eventDate) {
      const selectedDate = new Date(`${formData.eventDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime())) {
        errors.eventDate = 'Ongeldige datum';
      } else if (selectedDate < today) {
        errors.eventDate = 'Datum moet in de toekomst liggen';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate
    if (!validateForm()) {
      return;
    }

    if (HCAPTCHA_SITE_KEY && !captcha.token) {
      captcha.setError('Bevestig dat je geen robot bent.');
      return;
    }

    // Submit
    setIsSubmitting(true);

    try {
      await submitContactForm({
        ...formData,
        hCaptchaToken: captcha.token || undefined,
      });

      // Success
      setSubmitSuccess(true);

      // Track conversion with enhanced GA4 tracking
      trackFormSubmission(variant, formData.eventType, 'contact');

      // Legacy GTM tracking (keeping for backwards compatibility)
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'contact_form_submit',
          form_variant: variant,
          event_type: formData.eventType,
        });
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        eventType: initialEventType,
        eventDate: '',
      });
      captcha.reset();
      captcha.setError('');

      // Auto-hide success message after 5 seconds
      successTimeoutRef.current = setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      // Error handling
      setSubmitError(error.message || 'Er is een fout opgetreden. Probeer het later opnieuw.');
      console.error('Contact form error:', error);
      captcha.reset();
      if (error?.message && error.message.toLowerCase().includes('captcha')) {
        captcha.setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-[#1A2C4B] mb-2">
        {variant === 'B' ? 'Vraag Direct een Offerte Aan' : 'Neem Contact Op'}
      </h2>
      <p className="text-gray-500 mb-6">
        Vul het formulier in en we nemen binnen 24 uur contact met je op.
      </p>

      {/* Success Message */}
      {submitSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          role="status"
          aria-live="polite"
        >
          <strong>Succesvol verzonden!</strong>
          <p>Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
          aria-live="assertive"
        >
          <strong>Fout bij verzenden</strong>
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Naam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              fieldErrors.name ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            placeholder="Jouw naam"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              fieldErrors.email ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            placeholder="jouw@email.nl"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Telefoonnummer
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            minLength={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              fieldErrors.phone ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            placeholder="+31 6 12345678"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          />
          {fieldErrors.phone && (
            <p id="phone-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Type Evenement <span className="text-red-500">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              fieldErrors.eventType ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            aria-invalid={Boolean(fieldErrors.eventType)}
            aria-describedby={fieldErrors.eventType ? 'eventType-error' : undefined}
          >
            <option value="">Selecteer type evenement</option>
            <option value="bruiloft">Bruiloft</option>
            <option value="bedrijfsfeest">Bedrijfsfeest</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="jubileum">Jubileum</option>
            <option value="feest">Algemeen Feest</option>
            <option value="anders">Anders</option>
          </select>
          {fieldErrors.eventType && (
            <p id="eventType-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.eventType}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Gewenste Datum
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              fieldErrors.eventDate ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            aria-invalid={Boolean(fieldErrors.eventDate)}
            aria-describedby={fieldErrors.eventDate ? 'eventDate-error' : undefined}
          />
          {fieldErrors.eventDate && (
            <p id="eventDate-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.eventDate}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#1A2C4B] mb-1">
            Bericht <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none ${
              fieldErrors.message ? 'border-red-500' : 'border-neutral-gray-300'
            }`}
            placeholder="Vertel ons meer over jouw evenement..."
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          />
          {fieldErrors.message && (
            <p id="message-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {HCAPTCHA_SITE_KEY && (
          <div>
            <label className="block text-sm font-medium text-[#1A2C4B] mb-2">
              Beveiligingscontrole <span className="text-red-500">*</span>
            </label>
            <div
              ref={captcha.containerRef}
              className="h-captcha"
              aria-live="polite"
            />
            {captcha.isLoading && (
              <p className="text-sm text-gray-500 mt-2">Beveiligingscontrole wordt geladen…</p>
            )}
            {captcha.error && <p className="text-red-500 text-sm mt-2">{captcha.error}</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isSubmitting || (HCAPTCHA_SITE_KEY ? !captcha.isReady : false)}
            className="w-full"
          >
            {isSubmitting ? 'Bezig met verzenden...' : variant === 'B' ? 'Vraag Offerte Aan' : 'Verstuur Bericht'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 mt-4">
          Door dit formulier te versturen ga je akkoord met ons{' '}
          <a href="/privacy-policy" className="text-primary-500 hover:underline">
            privacybeleid
          </a>
          . We gebruiken je gegevens alleen om contact met je op te nemen over je evenement.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
