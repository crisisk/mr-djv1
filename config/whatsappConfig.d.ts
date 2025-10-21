export interface WhatsAppConfig {
  rawPhoneNumber: string;
  phoneNumber: string;
  normalizedPhoneNumber: string;
  message: string;
  isValid: boolean;
  whatsappUrl: string | null;
}

export interface WhatsAppClickHandlerResult {
  usedFallback: boolean;
  reason?: 'invalid-config' | 'missing-window';
  url: string | null;
}

export interface CreateWhatsAppClickHandlerOptions {
  config?: WhatsAppConfig | (() => WhatsAppConfig);
  resolveConfig?: () => WhatsAppConfig;
  fallbackUrl?: string;
  track?: (config: WhatsAppConfig) => void | Promise<void>;
  logger?: Pick<Console, 'info' | 'warn' | 'error'>;
  openWindow?: boolean;
}

export function getWhatsAppConfig(overrides?: {
  phoneNumber?: string;
  message?: string;
  logger?: Pick<Console, 'info' | 'warn' | 'error'>;
}): WhatsAppConfig;

export function createWhatsAppClickHandler(
  options?: CreateWhatsAppClickHandlerOptions
): (event?: { preventDefault?: () => void } | Event) => Promise<WhatsAppClickHandlerResult>;

export const __private__: {
  maskPhoneNumber: (value: string) => string;
  maskMessage: (value: string) => string;
  validatePhoneNumber: (value: string) => boolean;
};

declare const _default: {
  getWhatsAppConfig: typeof getWhatsAppConfig;
  createWhatsAppClickHandler: typeof createWhatsAppClickHandler;
};

export default _default;
