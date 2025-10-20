import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const createCaptchaHelpers = () => ({
  containerRef: vi.fn(),
  token: 'test-token',
  error: '',
  setError: vi.fn(),
  reset: vi.fn(),
  isReady: true,
  isLoading: false,
});

const captchaInstances = [];
const useHCaptchaWidgetMock = vi.fn();

vi.mock('../../hooks/useHCaptchaWidget.js', () => ({
  __esModule: true,
  useHCaptchaWidget: useHCaptchaWidgetMock,
}));

vi.mock('../../services/api', () => ({
  __esModule: true,
  submitContactForm: vi.fn(),
}));

vi.mock('../../utils/trackConversion', () => ({
  __esModule: true,
  trackFormSubmission: vi.fn(),
}));

import ContactForm from '../ContactForm.jsx';
import { submitContactForm } from '../../services/api';
import { trackFormSubmission } from '../../utils/trackConversion';

const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/telefoonnummer/i), { target: { value: '0612345678' } });
  fireEvent.change(screen.getByLabelText(/type evenement/i), { target: { value: 'bruiloft' } });
  fireEvent.change(screen.getByLabelText(/bericht/i), { target: { value: 'Dit is een geldig bericht.' } });
};

describe('ContactForm', () => {
  beforeEach(() => {
    captchaInstances.length = 0;
    useHCaptchaWidgetMock.mockImplementation(() => {
      const helpers = createCaptchaHelpers();
      captchaInstances.push(helpers);
      return helpers;
    });

    window.dataLayer = { push: vi.fn() };

    submitContactForm.mockReset();
    trackFormSubmission.mockReset();
  });

  afterEach(() => {
    delete window.dataLayer;
  });

  it('shows inline validation errors when submitting empty form', async () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole('button', { name: /verstuur bericht/i }));

    expect(await screen.findByText('Naam is verplicht')).toBeInTheDocument();
    expect(screen.getByText('Email is verplicht')).toBeInTheDocument();
    expect(screen.getByText('Telefoonnummer is verplicht')).toBeInTheDocument();
    expect(screen.getByText('Bericht is verplicht')).toBeInTheDocument();
    expect(screen.getByText('Selecteer een type evenement')).toBeInTheDocument();
  });

  it('submits successfully, shows success feedback, and resets the form', async () => {
    const deferred = createDeferred();
    submitContactForm.mockReturnValueOnce(deferred.promise);

    render(<ContactForm variant="A" />);

    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /verstuur bericht/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: /bezig met verzenden/i })).toBeInTheDocument();

    expect(submitContactForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0612345678',
      message: 'Dit is een geldig bericht.',
      eventType: 'bruiloft',
      eventDate: '',
      hCaptchaToken: 'test-token',
    });

    deferred.resolve();
    await deferred.promise;

    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent('Succesvol verzonden!');

    await waitFor(() => {
      expect(trackFormSubmission).toHaveBeenCalledWith('A', 'bruiloft', 'contact');
    });

    expect(window.dataLayer.push).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'contact_form_submit',
        form_variant: 'A',
        event_type: 'bruiloft',
      })
    );

    expect(screen.getByLabelText(/naam/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefoonnummer/i)).toHaveValue('');
    expect(screen.getByLabelText(/type evenement/i)).toHaveValue('');
    expect(screen.getByLabelText(/bericht/i)).toHaveValue('');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /verstuur bericht/i })).toBeInTheDocument();
    });

    const captcha = captchaInstances.at(-1);
    expect(captcha.reset).toHaveBeenCalled();
    expect(captcha.setError).toHaveBeenCalledWith('');
  });

  it('shows an error alert and logs issues when submission fails', async () => {
    const error = new Error('Server error');
    submitContactForm.mockRejectedValueOnce(error);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ContactForm />);

    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /verstuur bericht/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Fout bij verzenden');
    expect(screen.getByText('Server error')).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Contact form error:', error);
    expect(window.dataLayer.push).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /verstuur bericht/i })).toBeInTheDocument();
    });

    const captcha = captchaInstances.at(-1);
    expect(captcha.reset).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
