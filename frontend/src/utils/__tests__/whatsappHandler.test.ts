import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createWhatsAppClickHandler } from '../../../../config/whatsappConfig.js';
import type { WhatsAppConfig } from '../../../../config/whatsappConfig';

const buildConfig = (overrides: Partial<WhatsAppConfig> = {}): WhatsAppConfig => ({
  rawPhoneNumber: '+31123456789',
  phoneNumber: '31123456789',
  normalizedPhoneNumber: '31123456789',
  message: 'Hoi!',
  isValid: true,
  whatsappUrl: 'https://wa.me/31123456789?text=Hoi%21',
  ...overrides,
});

describe('createWhatsAppClickHandler (frontend)', () => {
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;

  beforeEach(() => {
    const mockLocation = {
      assign: vi.fn(),
    } as unknown as Location;

    globalThis.window = {
      open: vi.fn(),
      location: mockLocation,
    } as unknown as Window & typeof globalThis;
    globalThis.location = mockLocation;
  });

  afterEach(() => {
    if (originalWindow) {
      globalThis.window = originalWindow;
    } else {
      Reflect.deleteProperty(globalThis as { window?: unknown }, 'window');
    }

    if (originalLocation) {
      globalThis.location = originalLocation;
    } else {
      Reflect.deleteProperty(globalThis as { location?: unknown }, 'location');
    }

    vi.restoreAllMocks();
  });

  it('tracks and opens WhatsApp when config is valid', async () => {
    const preventDefault = vi.fn();
    const track = vi.fn().mockResolvedValue(undefined);

    const handler = createWhatsAppClickHandler({
      config: buildConfig(),
      fallbackUrl: '/contact',
      track,
      openWindow: true,
      logger: console,
    });

    const result = await handler({ preventDefault } as unknown as Event);

    expect(track).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(globalThis.window?.open).toHaveBeenCalledWith(
      'https://wa.me/31123456789?text=Hoi%21',
      '_blank',
      'noopener,noreferrer',
    );
    expect(result.usedFallback).toBe(false);
  });

  it('redirects to fallback when configuration is invalid', async () => {
    const preventDefault = vi.fn();
    const assign = vi.fn();
    if (globalThis.window) {
      (globalThis.window as unknown as { location: { assign: (value: string) => void } }).location.assign = assign;
      globalThis.location = globalThis.window.location;
    } else {
      globalThis.location = { assign } as unknown as Location;
    }

    const handler = createWhatsAppClickHandler({
      config: buildConfig({ isValid: false, whatsappUrl: null }),
      fallbackUrl: '/contact',
      logger: console,
    });

    const result = await handler({ preventDefault } as unknown as Event);

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledWith('/contact');
    expect(result).toMatchObject({ usedFallback: true, reason: 'invalid-config', url: '/contact' });
  });
});
