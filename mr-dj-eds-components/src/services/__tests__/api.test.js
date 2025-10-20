import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from '../api';

const jsonResponse = (data, overrides = {}) => ({
  ok: true,
  status: 200,
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  ...overrides,
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('fetchAPI integration', () => {
  it('returns parsed JSON when the response body contains valid JSON', async () => {
    const payload = { status: 'ok' };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(payload)));

    await expect(api.checkHealth()).resolves.toEqual(payload);
  });

  it('returns the raw text body when the response is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue('All systems operational'),
      }),
    );

    await expect(api.checkHealth()).resolves.toBe('All systems operational');
  });

  it('returns null for 204 No Content responses', async () => {
    const text = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        text,
      }),
    );

    await expect(api.checkHealth()).resolves.toBeNull();
    expect(text).not.toHaveBeenCalled();
  });

  it('throws the message from a JSON error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: 'Invalid request' })),
      }),
    );

    await expect(api.checkHealth()).rejects.toThrow('Invalid request');
  });

  it('falls back to the HTTP status when no error message is provided', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        text: vi.fn().mockResolvedValue('Bad Gateway'),
      }),
    );

    await expect(api.checkHealth()).rejects.toThrow('HTTP Error: 502');
  });

  it('converts network failures into a friendly error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(api.checkHealth()).rejects.toThrow(
      'Netwerkfout: Kan geen verbinding maken met de server',
    );
  });

  it('converts invalid server responses into a syntax error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')));

    await expect(api.checkHealth()).rejects.toThrow('Server antwoordde met ongeldige data');
  });
});

describe('service helpers', () => {
  it('submits the contact form to the correct endpoint', async () => {
    const formData = { name: 'John Doe' };
    const response = { success: true };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(response)));

    await expect(api.submitContactForm(formData)).resolves.toEqual(response);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(formData),
      }),
    );
  });

  it('submits the callback request to the correct endpoint', async () => {
    const formData = { phone: '+1234567890' };
    const response = { success: true };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(response)));

    await expect(api.submitCallbackRequest(formData)).resolves.toEqual(response);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/callback-request',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(formData),
      }),
    );
  });

  it('fetches packages from the expected endpoint', async () => {
    const response = { packages: [{ id: 1 }] };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(response)));

    await expect(api.getPackages()).resolves.toEqual(response.packages);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/packages',
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });

  it('checks health using the shared wrapper', async () => {
    const response = { ok: true };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(response)));

    await expect(api.checkHealth()).resolves.toEqual(response);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/health',
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });

  it('submits booking data to the correct endpoint', async () => {
    const bookingData = { eventDate: '2024-06-01' };
    const response = { success: true };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(response)));

    await expect(api.submitBooking(bookingData)).resolves.toEqual(response);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookings',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    );
  });
});
