import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AvailabilityChecker from '../../../AvailabilityChecker.jsx';

vi.mock('react-day-picker', () => {
  return {
    DayPicker: ({ selected, onSelect }: { selected?: Date | null; onSelect?: (day: Date | undefined) => void }) => (
      <div>
        <span data-testid="selected-date">{selected ? selected.toISOString() : 'no-date'}</span>
        <button type="button" onClick={() => onSelect?.(new Date('2025-06-15T00:00:00.000Z'))}>
          Select date
        </button>
      </div>
    ),
  };
});

const STORAGE_KEY = 'availabilityCheckerForm';

describe('AvailabilityChecker autosave behaviour', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pre-populates the form with saved data', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ email: 'saved@example.com', selectedDate: '2025-02-01T00:00:00.000Z' })
    );

    render(<AvailabilityChecker />);

    expect(screen.getByLabelText('Uw E-mailadres')).toHaveValue('saved@example.com');
    await waitFor(() => {
      expect(screen.getByTestId('selected-date')).toHaveTextContent('2025-02-01T00:00:00.000Z');
    });
  });

  it('saves user input to localStorage', async () => {
    render(<AvailabilityChecker />);

    fireEvent.change(screen.getByLabelText('Uw E-mailadres'), {
      target: { value: 'new@example.com' },
    });

    fireEvent.click(screen.getByText('Select date'));

    await waitFor(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved as string);
      expect(parsed).toMatchObject({
        email: 'new@example.com',
        selectedDate: '2025-06-15T00:00:00.000Z',
      });
    });
  });

  it('clears saved data after a successful submission', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: vi.fn() } as unknown as Response);

    render(<AvailabilityChecker />);

    fireEvent.change(screen.getByLabelText('Uw E-mailadres'), {
      target: { value: 'submit@example.com' },
    });

    fireEvent.click(screen.getByText('Select date'));

    fireEvent.click(screen.getByRole('button', { name: /Controleer & Vraag Aan/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Beschikbaarheid gecontroleerd! We nemen contact op via e-mail.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(screen.getByLabelText('Uw E-mailadres')).toHaveValue('');
      expect(screen.getByTestId('selected-date')).toHaveTextContent('no-date');
    });
  });
});
