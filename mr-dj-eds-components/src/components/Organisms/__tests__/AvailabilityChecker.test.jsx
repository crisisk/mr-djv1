import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AvailabilityChecker from '../AvailabilityChecker.jsx';

const submitBookingMock = vi.fn();
const trackAvailabilityCheckMock = vi.fn();
const trackFormSubmissionMock = vi.fn();
const getUserVariantMock = vi.fn();

vi.mock('react-day-picker', () => ({
  DayPicker: ({ selected, onSelect }) => (
    <div>
      <span data-testid="selected-date">{selected ? selected.toISOString() : 'no-date'}</span>
      <button type="button" onClick={() => onSelect?.(new Date('2025-06-15T00:00:00.000Z'))}>
        Selecteer datum
      </button>
    </div>
  )
}));

vi.mock('../../services/api.js', () => ({
  submitBooking: (...args) => submitBookingMock(...args)
}));

vi.mock('../../utils/trackConversion', () => ({
  trackAvailabilityCheck: (...args) => trackAvailabilityCheckMock(...args),
  trackFormSubmission: (...args) => trackFormSubmissionMock(...args),
  getUserVariant: (...args) => getUserVariantMock(...args)
}));

const fillBaseForm = () => {
  fireEvent.change(screen.getByLabelText(/Naam/i), { target: { value: 'Test Gebruiker' } });
  fireEvent.change(screen.getByLabelText(/Uw e-mailadres/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Telefoonnummer/i), { target: { value: '+31 6 12345678' } });
};

describe('AvailabilityChecker submission flow', () => {
  beforeEach(() => {
    submitBookingMock.mockReset();
    trackAvailabilityCheckMock.mockReset();
    trackFormSubmissionMock.mockReset();
    getUserVariantMock.mockReset();
    getUserVariantMock.mockReturnValue('A');
  });

  it('shows error when required contact details are missing', async () => {
    render(<AvailabilityChecker />);

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Vul alstublieft uw naam, e-mailadres en telefoonnummer in.');
    expect(submitBookingMock).not.toHaveBeenCalled();
  });

  it('shows error when event type is not selected', async () => {
    render(<AvailabilityChecker />);

    fillBaseForm();

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Selecteer een type evenement.');
    expect(submitBookingMock).not.toHaveBeenCalled();
  });

  it('shows error when date is not selected', async () => {
    render(<AvailabilityChecker />);

    fillBaseForm();
    fireEvent.change(screen.getByLabelText(/Type evenement/i), { target: { value: 'bruiloft' } });

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Kies een gewenste datum voor uw event.');
    expect(submitBookingMock).not.toHaveBeenCalled();
  });

  it('submits successfully, resets state, and tracks events with ISO date', async () => {
    submitBookingMock.mockResolvedValueOnce({ message: 'Mocked succesbericht' });
    getUserVariantMock.mockReturnValue('B');

    render(<AvailabilityChecker />);

    fillBaseForm();
    fireEvent.change(screen.getByLabelText(/Type evenement/i), { target: { value: 'bruiloft' } });

    fireEvent.click(screen.getByText('Selecteer datum'));

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    await waitFor(() => {
      expect(submitBookingMock).toHaveBeenCalledTimes(1);
    });

    const payload = submitBookingMock.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: 'Test Gebruiker',
      email: 'test@example.com',
      phone: '+31 6 12345678',
      eventType: 'bruiloft',
      eventDate: '2025-06-15'
    });

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Mocked succesbericht');

    expect(trackAvailabilityCheckMock).toHaveBeenCalledWith('B', '2025-06-15');
    expect(trackFormSubmissionMock).toHaveBeenCalledWith('B', 'bruiloft', 'availability');

    expect(screen.getByLabelText(/Naam/i)).toHaveValue('');
    expect(screen.getByLabelText(/Uw e-mailadres/i)).toHaveValue('');
    expect(screen.getByLabelText(/Telefoonnummer/i)).toHaveValue('');
    expect(screen.getByLabelText(/Type evenement/i)).toHaveValue('');
    expect(screen.getByTestId('selected-date')).toHaveTextContent('no-date');
  });

  it('shows fallback error message when submission fails without details', async () => {
    submitBookingMock.mockRejectedValueOnce(new Error(''));

    render(<AvailabilityChecker />);

    fillBaseForm();
    fireEvent.change(screen.getByLabelText(/Type evenement/i), { target: { value: 'bruiloft' } });
    fireEvent.click(screen.getByText('Selecteer datum'));

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'Er ging iets mis bij het verzenden. Probeer het later opnieuw of bel direct met Mister DJ.'
    );
    expect(trackAvailabilityCheckMock).not.toHaveBeenCalled();
    expect(trackFormSubmissionMock).not.toHaveBeenCalled();
  });
});
