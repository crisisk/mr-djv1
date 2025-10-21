const DEFAULT_MESSAGE = 'Hoi! Ik wil graag meer informatie over jullie DJ services.';

const logState = {
  didLog: false,
};

const maskPhoneNumber = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length <= 4) {
    return '*'.repeat(digits.length);
  }
  return `${'*'.repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}`;
};

const maskMessage = (value) => {
  if (!value) return '';
  const normalized = String(value).trim();
  if (normalized.length <= 6) {
    return `${normalized.slice(0, 1)}***`;
  }
  return `${normalized.slice(0, 3)}…${normalized.slice(-2)}`;
};

const getEnvValue = (key) => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (error) {
    // Ignore - process/env might not exist in browser builds
  }

  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (typeof import.meta.env[key] !== 'undefined') {
        return import.meta.env[key];
      }
      const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
      if (typeof import.meta.env[viteKey] !== 'undefined') {
        return import.meta.env[viteKey];
      }
    }
  } catch (error) {
    // Ignore - import.meta may not be defined in test environments
  }

  return undefined;
};

const validatePhoneNumber = (value) => {
  if (!value) return false;
  const digits = String(value).replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
};

const logConfigOnce = (config, logger = console) => {
  if (logState.didLog) {
    return;
  }

  const logMethod = config.isValid ? logger?.info : logger?.warn;
  if (typeof logMethod === 'function') {
    logMethod('[WhatsAppConfig] Loaded WhatsApp configuration', {
      phoneNumber: maskPhoneNumber(config.rawPhoneNumber || config.phoneNumber),
      messagePreview: maskMessage(config.message),
      isValid: config.isValid,
    });
  }

  logState.didLog = true;
};

const resolveLocation = () => {
  if (typeof window !== 'undefined' && window.location) {
    return window.location;
  }
  if (typeof globalThis !== 'undefined' && globalThis.location) {
    return globalThis.location;
  }
  return undefined;
};

export const getWhatsAppConfig = (overrides = {}) => {
  const { phoneNumber: overrideNumber, message: overrideMessage, logger } = overrides;

  const rawNumber =
    typeof overrideNumber !== 'undefined' ? overrideNumber : getEnvValue('WHATSAPP_NUMBER');
  const rawMessage =
    typeof overrideMessage !== 'undefined' ? overrideMessage : getEnvValue('WHATSAPP_MESSAGE');

  const normalizedNumber = rawNumber ? String(rawNumber).replace(/\D/g, '') : '';
  const message = rawMessage && String(rawMessage).trim().length > 0
    ? String(rawMessage).trim()
    : DEFAULT_MESSAGE;

  const isValid = validatePhoneNumber(normalizedNumber);
  const whatsappUrl = isValid
    ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`
    : null;

  const config = {
    rawPhoneNumber: rawNumber || '',
    phoneNumber: normalizedNumber,
    normalizedPhoneNumber: normalizedNumber,
    message,
    isValid,
    whatsappUrl,
  };

  logConfigOnce(config, logger);

  return config;
};

export const createWhatsAppClickHandler = (options = {}) => {
  const {
    config,
    resolveConfig,
    fallbackUrl = '/contact',
    track,
    logger = console,
    openWindow = false,
  } = options;

  const getConfig = () => {
    if (typeof config === 'function') {
      return config();
    }
    if (config) {
      return config;
    }
    if (typeof resolveConfig === 'function') {
      return resolveConfig();
    }
    return getWhatsAppConfig({ logger });
  };

  return async (event) => {
    const activeConfig = getConfig();

    if (typeof track === 'function') {
      try {
        await track(activeConfig);
      } catch (error) {
        if (logger?.error) {
          logger.error('[WhatsAppClickHandler] Tracking failed', error);
        }
      }
    }

    const hasWindow = typeof window !== 'undefined' && typeof window.open === 'function';
    const shouldFallback = !activeConfig?.isValid || !activeConfig?.whatsappUrl;

    if (shouldFallback || !hasWindow) {
      if (event?.preventDefault) {
        event.preventDefault();
      }

      if (logger?.warn) {
        logger.warn('[WhatsAppClickHandler] Falling back to contact flow', {
          reason: shouldFallback ? 'invalid-config' : 'missing-window',
          fallbackUrl,
        });
      }

      const location = resolveLocation();
      if (fallbackUrl && location && typeof location.assign === 'function') {
        location.assign(fallbackUrl);
      }

      return {
        usedFallback: true,
        reason: shouldFallback ? 'invalid-config' : 'missing-window',
        url: fallbackUrl || null,
      };
    }

    if (openWindow && activeConfig.whatsappUrl) {
      if (event?.preventDefault) {
        event.preventDefault();
      }
      window.open(activeConfig.whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    return {
      usedFallback: false,
      url: activeConfig?.whatsappUrl || null,
    };
  };
};

export const __private__ = {
  maskPhoneNumber,
  maskMessage,
  validatePhoneNumber,
  resolveLocation,
};

export default {
  getWhatsAppConfig,
  createWhatsAppClickHandler,
};
