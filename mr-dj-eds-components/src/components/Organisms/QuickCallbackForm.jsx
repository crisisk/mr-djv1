import React, { useState } from 'react';
import { submitCallbackRequest } from '../../services/api';
import { trackFormSubmission } from '../../utils/trackConversion';

/**
 * QuickCallbackForm - Simplified callback request form
 * Reduced friction: only name, phone, event type
 * Higher conversion than full contact forms
 */
const QuickCallbackForm = ({ variant = 'A', className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) {
      errors.name = 'Naam is verplicht';
    } else if (trimmedName.length < 2) {
      errors.name = 'Naam moet minimaal 2 tekens bevatten';
    }

    if (!trimmedPhone) {
      errors.phone = 'Telefoonnummer is verplicht';
    } else if (!/^[\d\s()+-]{10,15}$/.test(trimmedPhone)) {
      errors.phone = 'Voer een geldig telefoonnummer in';
    }

    if (!formData.eventType) {
      errors.eventType = 'Kies een type feest';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        eventType: formData.eventType,
      };

      await submitCallbackRequest(payload);

      // Track form submission
      trackFormSubmission(variant, payload.eventType, 'callback');

      // Push to GTM dataLayer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'quick_callback_submit',
          form_variant: variant,
          event_type: payload.eventType,
          form_type: 'callback',
        });
      }

      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', phone: '', eventType: '' });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(error.message || 'Er ging iets mis. Bel ons direct: 040 - 842 2594');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border-2 border-green-500 p-spacing-xl rounded-lg text-center ${className}`}>
        <div className="text-5xl mb-spacing-md">✓</div>
        <h3 className="text-2xl font-bold text-green-700 mb-spacing-sm">
          Bedankt!
        </h3>
        <p className="text-neutral-dark">
          We bellen je zo snel mogelijk terug!
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-secondary p-spacing-xl rounded-lg shadow-xl ${className}`}>
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-spacing-sm text-center">
        📞 Bel Mij Terug
      </h3>
      <p className="text-neutral-dark mb-spacing-lg text-center">
        Vul je gegevens in en wij bellen je vandaag nog!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
            Je naam *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Bijv. Jan Jansen"
            className="w-full p-3 md:p-4 rounded-lg border-2 border-neutral-gray-100 focus:border-primary focus:outline-none text-neutral-dark placeholder-neutral-gray-500"
            required
            minLength={2}
          />
          {fieldErrors.name && <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark mb-1">
            Je telefoonnummer *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
            pattern="[0-9\\s()+-]{10,15}"
            className="w-full p-3 md:p-4 rounded-lg border-2 border-neutral-gray-100 focus:border-primary focus:outline-none text-neutral-dark placeholder-neutral-gray-500"
            required
          />
          {fieldErrors.phone && <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>}
        </div>

        {/* Event Type Field */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-neutral-dark mb-1">
            Type feest *
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full p-3 md:p-4 rounded-lg border-2 border-neutral-gray-100 focus:border-primary focus:outline-none text-neutral-dark bg-white"
            required
          >
            <option value="">Kies een optie</option>
            <option value="bruiloft">Bruiloft</option>
            <option value="bedrijfsfeest">Bedrijfsfeest</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="schoolfeest">Schoolfeest</option>
            <option value="carnaval">Carnaval</option>
            <option value="anders">Anders</option>
          </select>
          {fieldErrors.eventType && <p className="text-sm text-red-600 mt-1">{fieldErrors.eventType}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white p-4 md:p-5 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-neutral-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Versturen...
            </span>
          ) : (
            '📞 Bel Mij Vandaag Nog'
          )}
        </button>

        {/* Trust Signal */}
        <p className="text-xs text-neutral-dark text-center mt-4">
          We respecteren je privacy en bellen alleen tijdens kantooruren (9:00-18:00)
        </p>

        {errorMessage && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 text-center">
            {errorMessage} <a href="tel:+31408422594" className="font-semibold underline">Bel ons direct</a>
          </p>
        )}
      </form>
    </div>
  );
};

export default QuickCallbackForm;
