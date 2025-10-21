import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createWhatsAppClickHandler } from '../../../../config/whatsappConfig.js';

const buildConfig = (overrides = {}) => ({
  rawPhoneNumber: '+31123456789',
  phoneNumber: '31123456789',
  normalizedPhoneNumber: '31123456789',
  message: 'Hoi!',
  isValid: true,
  whatsappUrl: 'https://wa.me/31123456789?text=Hoi%21',
  ...overrides,
});

const createLogger = () => ({
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
});

describe('createWhatsAppClickHandler (mr-dj-eds-components)', () => {
  const originalWindow = global.window;
  const originalLocation = global.location;

  beforeEach(() => {
    global.window = {
      open: vi.fn(),
      location: {
        assign: vi.fn(),
      },
    };
    global.location = global.window.location;
  });

  afterEach(() => {
    global.window = originalWindow;
    global.location = originalLocation;
    vi.restoreAllMocks();
  });

  it('opens WhatsApp in a new window when configuration is valid', async () => {
    const preventDefault = vi.fn();
    const track = vi.fn().mockResolvedValue(undefined);
    const logger = createLogger();

    const handler = createWhatsAppClickHandler({
      config: buildConfig(),
      fallbackUrl: '/contact',
      track,
      logger,
      openWindow: true,
    });

    const result = await handler({ preventDefault });

    expect(track).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(global.window.open).toHaveBeenCalledWith(
      'https://wa.me/31123456789?text=Hoi%21',
      '_blank',
      'noopener,noreferrer',
    );
    expect(result).toMatchObject({ usedFallback: false, url: expect.stringContaining('wa.me') });
  });

  it('falls back to the contact page when window is unavailable', async () => {
    const preventDefault = vi.fn();
    const logger = createLogger();
    const assign = vi.fn();

    delete global.window;
    global.location = { assign };

    const handler = createWhatsAppClickHandler({
      config: buildConfig(),
      fallbackUrl: '/contact',
      logger,
    });

    const result = await handler({ preventDefault });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledWith('/contact');
    expect(logger.warn).toHaveBeenCalled();
    expect(result).toMatchObject({ usedFallback: true, reason: 'missing-window', url: '/contact' });
  });
});
