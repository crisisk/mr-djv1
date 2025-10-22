import React, { useEffect, useRef, useState } from 'react';
import { submitCallbackRequest } from '../../services/api.js';
import { getWindow } from '../../lib/environment.js';
import { useHCaptchaWidget } from '../../hooks/useHCaptchaWidget.js';
import { loadTrackConversion } from '../../utils/loadTrackConversion';

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

const INITIAL_FORM_STATE = {
  name: '',
  phone: '',
  eventType: '',
};

const QuickCallbackForm = ({ variant = 'A', className = '' }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const successResetTimeoutRef = useRef(null);

  const captcha = useHCaptchaWidget(HCAPTCHA_SITE_KEY);

  useEffect(() => {
    return () => {
      if (successResetTimeoutRef.current) {
        clearTimeout(successResetTimeoutRef.current);
      }
    };
  }, []);

  const normalizeFormData = (data) => ({
    name: data.name.trim(),
    phone: data.phone.replace(/\s+/g, ' ').trim(),
    eventType: data.eventType,
  });

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) {
      errors.name = 'Naam is verplicht';
    } else if (data.name.length < 2) {
      errors.name = 'Naam moet minimaal 2 tekens bevatten';
    }

    if (!data.phone) {
      errors.phone = 'Telefoonnummer is verplicht';
    } else if (!/^[0-9+\s()-]{6,}$/.test(data.phone)) {
      errors.phone = 'Voer een geldig telefoonnummer in';
    }

    if (!data.eventType) {
      errors.eventType = 'Kies een type feest';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const normalizedFormData = normalizeFormData(formData);

    if (!validateForm(normalizedFormData)) {
      return;
    }

    if (HCAPTCHA_SITE_KEY && !captcha.token) {
      captcha.setError('Bevestig dat je geen robot bent.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...normalizedFormData,
      hCaptchaToken: captcha.token || undefined,
    };

    try {
      const response = await submitCallbackRequest(payload);
      let abVariant = variant;

      try {
        const { getUserVariant, trackFormSubmission } = await loadTrackConversion();
        if (typeof getUserVariant === 'function') {
          abVariant = getUserVariant() || variant;
        }
        if (typeof trackFormSubmission === 'function') {
          trackFormSubmission(abVariant, payload.eventType || '', 'callback');
        }
      } catch (trackingError) {
        console.error('Failed to load tracking utilities for quick callback submission', trackingError);
      }

      const browser = getWindow();
      if (browser) {
        browser.dataLayer = browser.dataLayer || [];
        browser.dataLayer.push({
          event: 'quick_callback_submit',
          form_variant: abVariant,
          event_type: payload.eventType || '',
          form_type: 'callback',
        });
      }

      setFieldErrors({});
      setSuccessMessage(response?.message || 'Bedankt! We bellen je zo snel mogelijk terug.');
      setIsSubmitted(true);
      setSubmitError(null);
      captcha.reset();

      if (successResetTimeoutRef.current) {
        clearTimeout(successResetTimeoutRef.current);
      }

      successResetTimeoutRef.current = setTimeout(() => {
        setFormData(INITIAL_FORM_STATE);
        setFieldErrors({});
        setIsSubmitted(false);
        setSuccessMessage('');
        captcha.reset();
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Er ging iets mis. Bel ons direct: 040 - 842 2594');
      captcha.reset();
      if (error?.message && error.message.toLowerCase().includes('captcha')) {
        captcha.setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border-2 border-green-500 p-spacing-xl rounded-lg text-center ${className}`}>
        <div className="text-5xl mb-spacing-md">✓</div>
        <h2 className="text-2xl font-bold text-green-700 mb-spacing-sm">Bedankt!</h2>
        <p className="text-neutral-dark">
          {successMessage || 'We bellen je zo snel mogelijk terug!'}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-secondary p-spacing-xl rounded-lg shadow-xl ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-spacing-sm text-center">📞 Bel Mij Terug</h2>
      <p className="text-neutral-dark mb-spacing-lg text-center">Vul je gegevens in en wij bellen je vandaag nog!</p>

      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-spacing-md"
          role="alert"
          aria-live="assertive"
        >
          <strong className="font-semibold block mb-1">Oops!</strong>
          <span>
            {submitError}{' '}
            <a
              href="tel:+31408422594"
              className="font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-white"
            >
              Bel ons direct
            </a>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            minLength={2}
            required
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'callback-name-error' : undefined}
          />
          {fieldErrors.name && (
            <p id="callback-name-error" className="text-sm text-red-600 mt-1">
              {fieldErrors.name}
            </p>
          )}
        </div>

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
            className="w-full p-3 md:p-4 rounded-lg border-2 border-neutral-gray-100 focus:border-primary focus:outline-none text-neutral-dark placeholder-neutral-gray-500"
            required
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'callback-phone-error' : undefined}
          />
          {fieldErrors.phone && (
            <p id="callback-phone-error" className="text-sm text-red-600 mt-1">
              {fieldErrors.phone}
            </p>
          )}
        </div>

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
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.eventType)}
            aria-describedby={fieldErrors.eventType ? 'callback-event-type-error' : undefined}
          >
            <option value="">Kies een optie</option>
            <option value="bruiloft">Bruiloft</option>
            <option value="bedrijfsfeest">Bedrijfsfeest</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="schoolfeest">Schoolfeest</option>
            <option value="carnaval">Carnaval</option>
            <option value="anders">Anders</option>
          </select>
          {fieldErrors.eventType && (
            <p id="callback-event-type-error" className="text-sm text-red-600 mt-1">
              {fieldErrors.eventType}
            </p>
          )}
        </div>

        {HCAPTCHA_SITE_KEY && (
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Beveiligingscontrole <span className="text-red-500">*</span>
            </label>
            <div ref={captcha.containerRef} className="h-captcha" aria-live="polite" />
            {captcha.isLoading && (
              <p className="text-sm text-neutral-dark mt-2">Beveiligingscontrole wordt geladen…</p>
            )}
            {captcha.error && <p className="text-sm text-red-600 mt-2">{captcha.error}</p>}
          </div>
        )}

          <button
            type="submit"
            disabled={isSubmitting || (HCAPTCHA_SITE_KEY ? !captcha.isReady : false)}
            className="w-full bg-[var(--color-primary-blue)] text-white p-4 md:p-5 rounded-lg font-bold text-lg hover:bg-[#00487A] transition-colors duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#66A6D9] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:bg-neutral-gray-500 disabled:text-white disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <IconBase className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </IconBase>
              Versturen...
            </span>
          ) : (
            '📞 Bel Mij Vandaag Nog'
          )}
        </button>

        <p className="text-xs text-neutral-dark text-center mt-4">
          We respecteren je privacy en bellen alleen tijdens kantooruren (9:00-18:00)
        </p>
      </form>
    </div>
  );
};

export default QuickCallbackForm;

