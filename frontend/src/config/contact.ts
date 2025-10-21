const DEFAULT_PHONE_NUMBER = '+31-40-8422594'
const DEFAULT_WHATSAPP_MESSAGE = 'Hi! Ik wil graag een DJ boeken.'

const resolveEnvValue = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const rawPhone =
  resolveEnvValue((import.meta.env as unknown as Record<string, unknown>)?.VITE_CONTACT_PHONE_NUMBER) ??
  DEFAULT_PHONE_NUMBER

const normaliseForWhatsApp = (value: string): string => value.replace(/[^0-9]/g, '')

export const CONTACT_PHONE_NUMBER = rawPhone
export const CONTACT_PHONE_NUMBER_WHATSAPP = normaliseForWhatsApp(rawPhone)

export const CONTACT_WHATSAPP_MESSAGE =
  resolveEnvValue((import.meta.env as unknown as Record<string, unknown>)?.VITE_WHATSAPP_DEFAULT_MESSAGE) ??
  DEFAULT_WHATSAPP_MESSAGE

export const HAS_WHATSAPP_NUMBER = CONTACT_PHONE_NUMBER_WHATSAPP.length > 0
