import React, { useState } from 'react';

/**
 * Lead Capture Form voor Mr-DJ website
 * Integreert met RentGuy CRM systeem via public API
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    event_date: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch('https://sevensa.rentguy.nl/api/v1/public/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant: 'mrdj',
          ...formData,
          captcha_token: 'web-form-submission', // In productie: echte reCAPTCHA token
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Er ging iets mis');
      }

      const result = await response.json();

      setStatus({
        submitting: false,
        success: true,
        error: null
      });

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        event_date: '',
      });

      // Redirect naar bedankt pagina na 2 seconden
      setTimeout(() => {
        window.location.href = '/bedankt';
      }, 2000);

    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div className="contact-form-container">
      <style>{`
        .contact-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .contact-form-title {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .contact-form-subtitle {
          color: #6b7280;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-label.required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: #ef4444;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #dc2626;
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .status-message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .status-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .status-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .privacy-notice {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>

      <h2 className="contact-form-title">Offerte Aanvragen</h2>
      <p className="contact-form-subtitle">
        Vul onderstaand formulier in en wij nemen binnen 24 uur contact met je op
      </p>

      {status.success && (
        <div className="status-message status-success">
          ✅ Bedankt voor je aanvraag! We nemen zo snel mogelijk contact met je op.
        </div>
      )}

      {status.error && (
        <div className="status-message status-error">
          ❌ {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name" className="form-label required">
              Voornaam
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-input"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={status.submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label required">
              Achternaam
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-input"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={status.submitting}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label required">
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label required">
            Telefoonnummer
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+31 6 12345678"
            required
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_date" className="form-label">
            Gewenste Datum Event
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            className="form-input"
            value={formData.event_date}
            onChange={handleChange}
            disabled={status.submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Jouw Wensen & Opmerkingen
          </label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            value={formData.message}
            onChange={handleChange}
            placeholder="Vertel ons over je event..."
            disabled={status.submitting}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={status.submitting}
        >
          {status.submitting ? '⏳ Versturen...' : '📨 Offerte Aanvragen'}
        </button>

        <p className="privacy-notice">
          Door dit formulier te versturen ga je akkoord met onze privacy voorwaarden
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
