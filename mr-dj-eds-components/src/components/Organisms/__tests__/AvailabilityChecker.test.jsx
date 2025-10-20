import React from 'react';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import AvailabilityChecker from '../AvailabilityChecker.jsx';

const mockSubmitBooking = vi.fn();
const mockTrackAvailabilityCheck = vi.fn();
const mockTrackFormSubmission = vi.fn();
const mockGetUserVariant = vi.fn(() => 'variant-a');

vi.mock('react-day-picker', () => ({
  DayPicker: ({ selected, onSelect }) => (
    <div>
      <span data-testid="selected-date">{selected ? selected.toISOString() : 'no-date'}</span>
      <button type="button" onClick={() => onSelect?.(new Date('2025-06-15T00:00:00.000Z'))}>
        Kies datum
      </button>
    </div>
  ),
}));

vi.mock('../../../services/api.js', () => ({
  submitBooking: mockSubmitBooking,
}));

vi.mock('../../../utils/trackConversion', () => ({
  trackAvailabilityCheck: mockTrackAvailabilityCheck,
  trackFormSubmission: mockTrackFormSubmission,
  getUserVariant: mockGetUserVariant,
}));

describe('AvailabilityChecker form validation and submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: 'Jane Tester' } });
    fireEvent.change(screen.getByLabelText(/uw e-mailadres/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/telefoonnummer/i), { target: { value: '+31 6 12345678' } });
    fireEvent.change(screen.getByLabelText(/type evenement/i), { target: { value: 'bruiloft' } });
  };

  it('shows error messages when required fields are missing', () => {
    render(<AvailabilityChecker />);

    fireEvent.click(screen.getByRole('button', { name: /controleer & vraag aan/i }));

    expect(
      screen.getByText('Vul alstublieft uw naam, e-mailadres en telefoonnummer in.')
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/naam/i), { target: { value: 'Jane Tester' } });
    fireEvent.change(screen.getByLabelText(/uw e-mailadres/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/telefoonnummer/i), { target: { value: '+31 6 12345678' } });

    fireEvent.click(screen.getByRole('button', { name: /controleer & vraag aan/i }));
    expect(screen.getByText('Selecteer een type evenement.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/type evenement/i), { target: { value: 'bruiloft' } });

    fireEvent.click(screen.getByRole('button', { name: /controleer & vraag aan/i }));
    expect(screen.getByText('Kies een gewenste datum voor uw event.')).toBeInTheDocument();
  });

  it('submits successfully, resets state, and tracks metrics with ISO date', async () => {
    mockSubmitBooking.mockResolvedValueOnce({});
    mockGetUserVariant.mockReturnValueOnce('variant-b');

    render(<AvailabilityChecker />);

    fillRequiredFields();

    fireEvent.click(screen.getByText('Kies datum'));

    fireEvent.click(screen.getByRole('button', { name: /controleer & vraag aan/i }));

    await waitFor(() => {
      expect(mockSubmitBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Tester',
          email: 'jane@example.com',
          phone: '+31 6 12345678',
          eventType: 'bruiloft',
          eventDate: '2025-06-15',
        })
      );
    });

    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent(
      'Beschikbaarheid gecontroleerd! We nemen binnen 24 uur contact op.'
    );

    expect(mockTrackAvailabilityCheck).toHaveBeenCalledWith('variant-b', '2025-06-15');
    expect(mockTrackFormSubmission).toHaveBeenCalledWith('variant-b', 'bruiloft', 'availability');

    expect(screen.getByLabelText(/naam/i)).toHaveValue('');
    expect(screen.getByLabelText(/uw e-mailadres/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefoonnummer/i)).toHaveValue('');
    expect(screen.getByLabelText(/type evenement/i)).toHaveValue('');
    expect(screen.getByTestId('selected-date')).toHaveTextContent('no-date');
  });

  it('shows fallback error message when submission fails without details', async () => {
    mockSubmitBooking.mockRejectedValueOnce(new Error(''));

    render(<AvailabilityChecker />);

    fillRequiredFields();
    fireEvent.click(screen.getByText('Kies datum'));

    fireEvent.click(screen.getByRole('button', { name: /controleer & vraag aan/i }));

    const errorBanner = await screen.findByRole('alert');
    expect(errorBanner).toHaveTextContent(
      'Er ging iets mis bij het verzenden. Probeer het later opnieuw of bel direct met Mister DJ.'
    );

    expect(mockTrackAvailabilityCheck).not.toHaveBeenCalled();
    expect(mockTrackFormSubmission).not.toHaveBeenCalled();
  });
});
