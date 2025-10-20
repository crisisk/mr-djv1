import React from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const mocks = vi.hoisted(() => {
  let lastCaptcha = null;

  return {
    submitContactForm: vi.fn(),
    trackFormSubmission: vi.fn(),
    useHCaptchaWidget: vi.fn(() => {
      lastCaptcha = {
        containerRef: vi.fn(),
        token: '',
        error: '',
        setError: vi.fn(),
        reset: vi.fn(),
        isReady: true,
        isLoading: false
      };

      return lastCaptcha;
    }),
    getLatestCaptcha: () => lastCaptcha
  };
});

vi.mock('../../../services/api.js', () => ({
  submitContactForm: mocks.submitContactForm
}));

vi.mock('../../../utils/trackConversion.js', () => ({
  trackFormSubmission: mocks.trackFormSubmission
}));

vi.mock('../../../hooks/useHCaptchaWidget.js', () => ({
  useHCaptchaWidget: mocks.useHCaptchaWidget
}));

import ContactForm from '../ContactForm.jsx';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_HCAPTCHA_SITE_KEY', '');
    window.dataLayer = { push: vi.fn() };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.dataLayer;
  });

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/telefoonnummer/i), { target: { value: '+31 6 12345678' } });
    fireEvent.change(screen.getByLabelText(/type evenement/i), { target: { value: 'bruiloft' } });
    fireEvent.change(screen.getByLabelText(/bericht/i), {
      target: { value: 'Dit is een geldig bericht met voldoende lengte.' }
    });
  };

  it('displays inline errors for invalid submission attempts', async () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole('button', { name: /verstuur bericht/i }));

    expect(await screen.findByText('Naam is verplicht')).toBeInTheDocument();
    expect(await screen.findByText('Email is verplicht')).toBeInTheDocument();
    expect(await screen.findByText('Telefoonnummer is verplicht')).toBeInTheDocument();
    expect(await screen.findByText('Bericht is verplicht')).toBeInTheDocument();
    expect(await screen.findByText('Selecteer een type evenement')).toBeInTheDocument();

    expect(mocks.submitContactForm).not.toHaveBeenCalled();
  });

  it('handles a successful submission flow with tracking and reset', async () => {
    mocks.submitContactForm.mockResolvedValueOnce({});

    render(<ContactForm />);

    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /verstuur bericht/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toHaveTextContent('Bezig met verzenden...'));

    await waitFor(() => expect(submitButton).toHaveTextContent('Verstuur Bericht'));

    expect(await screen.findByRole('status')).toHaveTextContent('Succesvol verzonden!');

    expect(screen.getByLabelText(/naam/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefoonnummer/i)).toHaveValue('');
    expect(screen.getByLabelText(/type evenement/i)).toHaveValue('');
    expect(screen.getByLabelText(/bericht/i)).toHaveValue('');

    expect(mocks.submitContactForm).toHaveBeenCalledTimes(1);
    expect(mocks.submitContactForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+31 6 12345678',
      message: 'Dit is een geldig bericht met voldoende lengte.',
      eventType: 'bruiloft',
      eventDate: '',
      hCaptchaToken: undefined
    });

    expect(mocks.trackFormSubmission).toHaveBeenCalledWith('A', 'bruiloft', 'contact');
    expect(window.dataLayer.push).toHaveBeenCalledWith({
      event: 'contact_form_submit',
      form_variant: 'A',
      event_type: 'bruiloft'
    });

    const captcha = mocks.getLatestCaptcha();
    expect(captcha.reset).toHaveBeenCalled();
    expect(captcha.setError).toHaveBeenCalledWith('');
  });

  it('surfaces errors and logs failures when submission is rejected', async () => {
    const error = new Error('Server error occurred');
    mocks.submitContactForm.mockRejectedValueOnce(error);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);

    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /verstuur bericht/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toHaveTextContent('Bezig met verzenden...'));
    await waitFor(() => expect(submitButton).toHaveTextContent('Verstuur Bericht'));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Fout bij verzenden');
    expect(alert).toHaveTextContent('Server error occurred');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Contact form error:', error);
    expect(mocks.trackFormSubmission).not.toHaveBeenCalled();
    expect(window.dataLayer.push).not.toHaveBeenCalled();

    const captcha = mocks.getLatestCaptcha();
    expect(captcha.reset).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
