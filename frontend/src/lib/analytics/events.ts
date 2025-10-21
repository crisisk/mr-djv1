import { pushEvent } from './ga4'

type Fbq = ((...args: unknown[]) => void) | null

const getFbq = (): Fbq => {
  if (typeof window === 'undefined') {
    return null
  }

  const candidate = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq
  return typeof candidate === 'function' ? candidate : null
}

export type BookingTrackingPayload = {
  origin: string
  bookingId?: string | null
  eventType?: string | null
  packageId?: string | null
  status?: string | null
  value?: number | null
  currency?: string | null
}

export const trackBookingLead = ({
  origin,
  bookingId,
  eventType,
  packageId,
  status,
  value,
  currency,
}: BookingTrackingPayload): void => {
  const params = {
    lead_origin: origin,
    booking_id: bookingId ?? undefined,
    event_type: eventType ?? undefined,
    package_id: packageId ?? undefined,
    booking_status: status ?? undefined,
    value: typeof value === 'number' ? value : undefined,
    currency: currency ?? undefined,
  }

  pushEvent({
    name: 'generate_lead',
    params,
  })

  const fbq = getFbq()
  if (fbq) {
    fbq('track', 'Lead', {
      content_name: origin,
      content_category: eventType ?? undefined,
      status: status ?? undefined,
      package: packageId ?? undefined,
      value: typeof value === 'number' ? value : undefined,
      currency: currency ?? undefined,
    })
  }
}

export type ContactChannelPayload = {
  channel: string
  origin?: string
  phoneNumber?: string
}

export const trackContactChannelClick = ({
  channel,
  origin,
  phoneNumber,
}: ContactChannelPayload): void => {
  pushEvent({
    name: 'select_content',
    params: {
      content_type: 'contact_channel',
      item_id: channel,
      item_variant: origin ?? undefined,
      phone_number: phoneNumber ?? undefined,
    },
  })

  const fbq = getFbq()
  if (fbq) {
    fbq('trackCustom', 'ContactChannelClick', {
      channel,
      origin,
      phoneNumber,
    })
  }
}
