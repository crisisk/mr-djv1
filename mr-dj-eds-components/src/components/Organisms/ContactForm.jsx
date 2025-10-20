import React, { useEffect, useRef, useState } from 'react';
import { submitContactForm } from '../../services/api';
import Button from '../Atoms/Buttons';
import { trackFormSubmission } from '../../utils/trackConversion';
import { colors, spacing, typography } from '../../theme/tokens.js';

const withAlpha = (hex, alpha) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
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

    // Submit
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);

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

      // Auto-hide success message after 5 seconds
      successTimeoutRef.current = setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      // Error handling
      setSubmitError(error.message || 'Er is een fout opgetreden. Probeer het later opnieuw.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContainerStyle = {
    backgroundColor: colors.neutral.light,
    padding: spacing.xl,
    borderRadius: '0.75rem',
    boxShadow: '0 20px 45px rgba(26, 44, 75, 0.15)',
  };

  const headingStyle = {
    fontSize: typography.fontSize.h2,
    fontFamily: typography.fontFamily.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.dark,
    marginBottom: spacing.sm,
  };

  const introStyle = {
    color: colors.neutral.gray500,
    marginBottom: spacing.lg,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.primary,
    lineHeight: typography.lineHeight.normal,
  };

  const statusBaseStyle = {
    padding: spacing.md,
    borderRadius: '0.75rem',
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.primary,
    lineHeight: typography.lineHeight.normal,
  };

  const successStyle = {
    ...statusBaseStyle,
    backgroundColor: withAlpha(colors.semantic.success, 0.12),
    border: `1px solid ${withAlpha(colors.semantic.success, 0.4)}`,
    color: colors.semantic.success,
  };

  const errorStyle = {
    ...statusBaseStyle,
    backgroundColor: withAlpha(colors.semantic.error, 0.12),
    border: `1px solid ${withAlpha(colors.semantic.error, 0.4)}`,
    color: colors.semantic.error,
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  };

  const labelStyle = {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.dark,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.primary,
  };

  const requiredMarkStyle = {
    color: colors.semantic.error,
    marginLeft: '4px',
  };

  const helperTextStyle = {
    color: colors.semantic.error,
    fontSize: typography.fontSize.small,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.primary,
  };

  const getInputStyle = (hasError) => ({
    width: '100%',
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderRadius: '0.75rem',
    border: `1px solid ${hasError ? colors.semantic.error : colors.neutral.gray300}`,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.primary,
    color: colors.neutral.dark,
    backgroundColor: colors.neutral.light,
    outlineColor: colors.primary.main,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  const textareaStyle = {
    ...getInputStyle(Boolean(fieldErrors.message)),
    resize: 'none',
    minHeight: '144px',
  };

  const privacyStyle = {
    fontSize: typography.fontSize.small,
    color: colors.neutral.gray500,
    marginTop: spacing.md,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
  };

  const privacyLinkStyle = {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold,
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={headingStyle}>
        {variant === 'B' ? 'Vraag Direct een Offerte Aan' : 'Neem Contact Op'}
      </h2>
      <p style={introStyle}>
        Vul het formulier in en we nemen binnen 24 uur contact met je op.
      </p>

      {/* Success Message */}
      {submitSuccess && (
        <div style={successStyle} role="status" aria-live="polite">
          <strong>Succesvol verzonden!</strong>
          <p>Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div style={errorStyle} role="alert" aria-live="assertive">
          <strong>Fout bij verzenden</strong>
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Name */}
        <div>
          <label htmlFor="name" style={labelStyle}>
            Naam
            <span style={requiredMarkStyle}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={getInputStyle(Boolean(fieldErrors.name))}
            className="focus:outline-none"
            placeholder="Jouw naam"
          />
          {fieldErrors.name && <p style={helperTextStyle}>{fieldErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email
            <span style={requiredMarkStyle}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={getInputStyle(Boolean(fieldErrors.email))}
            className="focus:outline-none"
            placeholder="jouw@email.nl"
          />
          {fieldErrors.email && <p style={helperTextStyle}>{fieldErrors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" style={labelStyle}>
            Telefoonnummer
            <span style={requiredMarkStyle}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            minLength={6}
            style={getInputStyle(Boolean(fieldErrors.phone))}
            className="focus:outline-none"
            placeholder="+31 6 12345678"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          />
          {fieldErrors.phone && (
            <p id="phone-error" style={helperTextStyle}>
              {fieldErrors.phone}
            </p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="eventType" style={labelStyle}>
            Type Evenement
            <span style={requiredMarkStyle}>*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            style={getInputStyle(Boolean(fieldErrors.eventType))}
            className="focus:outline-none"
          >
            <option value="">Selecteer type evenement</option>
            <option value="bruiloft">Bruiloft</option>
            <option value="bedrijfsfeest">Bedrijfsfeest</option>
            <option value="verjaardag">Verjaardag</option>
            <option value="jubileum">Jubileum</option>
            <option value="feest">Algemeen Feest</option>
            <option value="anders">Anders</option>
          </select>
          {fieldErrors.eventType && <p style={helperTextStyle}>{fieldErrors.eventType}</p>}
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" style={labelStyle}>
            Gewenste Datum
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            style={getInputStyle(false)}
            className="focus:outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" style={labelStyle}>
            Bericht
            <span style={requiredMarkStyle}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={textareaStyle}
            className="focus:outline-none"
            placeholder="Vertel ons meer over jouw evenement..."
          />
          {fieldErrors.message && <p style={helperTextStyle}>{fieldErrors.message}</p>}
        </div>

        {/* Submit Button */}
        <div style={{ paddingTop: spacing.sm }}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Bezig met verzenden...' : variant === 'B' ? 'Vraag Offerte Aan' : 'Verstuur Bericht'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <p style={privacyStyle}>
          Door dit formulier te versturen ga je akkoord met ons{' '}
          <a href="/privacy-policy" style={privacyLinkStyle}>
            privacybeleid
          </a>
          . We gebruiken je gegevens alleen om contact met je op te nemen over je evenement.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
