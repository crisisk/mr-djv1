import { prepareRevealElement } from './reveal.js';

export const initContactForm = (analytics) => {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  if (!contactForm || !formMessage) return;

  let availabilityStarted = false;

  const emitAvailabilityStart = () => {
    if (availabilityStarted) return;
    availabilityStarted = true;
    if (analytics) {
      const eventTypeField = document.getElementById('eventType');
      analytics.trackAvailabilityStart({
        event_type: eventTypeField?.value || null,
        source: 'contact_form',
      });
    }
  };

  const eventDateField = document.getElementById('eventDate');
  if (eventDateField) {
    eventDateField.addEventListener('focus', emitAvailabilityStart, { once: true });
    eventDateField.addEventListener('change', emitAvailabilityStart, { once: true });
  }

  const contactCtas = document.querySelectorAll('[data-track="contact-start"]');
  contactCtas.forEach((cta) => {
    cta.addEventListener('click', emitAvailabilityStart, { once: true });
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      eventType: document.getElementById('eventType').value,
      eventDate: document.getElementById('eventDate').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const validationMessage = Array.isArray(data.details)
          ? data.details.map((detail) => `${detail.field}: ${detail.message}`).join(' ')
          : data.message || data.error;
        throw new Error(validationMessage || 'Er is iets misgegaan');
      }

      formMessage.className = 'form-message success';
      formMessage.textContent = data.message;
      prepareRevealElement(formMessage);
      contactForm.reset();
      availabilityStarted = false;
      document.dispatchEvent(new Event('contact:formReset'));

      if (analytics) {
        const analyticsPayload = {
          event_type: formData.eventType,
          event_date: formData.eventDate,
          city_context: formData.message.match(/in ([A-Za-zÀ-ÿ\s-]+)/i)?.[1] || null,
          source: 'contact_form',
        };
        analytics.trackAvailabilitySuccess(analyticsPayload);
        analytics.trackLeadSubmitted({
          ...analyticsPayload,
          lead_email_domain: formData.email.split('@')[1] || null,
        });
      }
    } catch (error) {
      formMessage.className = 'form-message error';
      formMessage.textContent = error.message || 'Er is een fout opgetreden. Probeer het later opnieuw of bel ons direct.';
      console.error('Form submission error:', error);
    }

    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
};
