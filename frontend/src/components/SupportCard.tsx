import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../lib/apiClient'

type SupportChannelView = {
  id: string
  type: string
  label: string
  value: string
  href?: string
  description?: string
  priority?: number
}

type SupportAvailabilityWindowView = {
  days: string[]
  start: string
  end: string
  note?: string
}

type SupportAvailabilityView = {
  timezone: string
  windows: SupportAvailabilityWindowView[]
  note?: string
}

type SupportMessageView = {
  headline: string
  body: string
  availabilityNote?: string
  ctaLabel?: string
  ctaHref?: string
}

type SupportViewModel = {
  channels: SupportChannelView[]
  availability: SupportAvailabilityView
  message: SupportMessageView
  locale: string
  locales: string[]
  metadata: {
    updatedAt: string | null
    source: string
    cacheStatus: string
    stale: boolean
    error: string | null
  }
}

type SupportApiChannel = Partial<SupportChannelView> & {
  id?: string
  type?: string
  label?: string
  value?: string
  href?: string
  description?: string
  priority?: number
}

type SupportApiAvailabilityWindow = Partial<SupportAvailabilityWindowView>

type SupportApiAvailability = {
  timezone?: string
  windows?: SupportApiAvailabilityWindow[]
  note?: string
}

type SupportApiMessage = Partial<SupportMessageView>

type SupportApiResponse = {
  channels?: SupportApiChannel[]
  availability?: SupportApiAvailability
  message?: SupportApiMessage
  locale?: string
  locales?: string[]
  metadata?: {
    updatedAt?: string | null
    source?: string
    cacheStatus?: string
    stale?: boolean
    error?: string | null
  }
}

interface SupportCardProps {
  locale?: string
  className?: string
}

type SupportState = {
  data: SupportViewModel
  loading: boolean
  error: string | null
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const CACHE_TTL_MS = 5 * 60 * 1000
const STALE_CACHE_TTL_MS = 60 * 1000
const GENERIC_ERROR_MESSAGE =
  'We are using saved contact details while the live support configuration is unavailable.'

const FALLBACK_CHANNELS: SupportChannelView[] = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    value: 'support@misterdj.com',
    href: 'mailto:support@misterdj.com',
    description: 'We reply within one business day on business hours.',
    priority: 1
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone',
    value: '+31 (0)20 123 4567',
    href: 'tel:+31201234567',
    description: 'Urgent request? Call us for an immediate response.',
    priority: 2
  },
  {
    id: 'whatsapp',
    type: 'chat',
    label: 'WhatsApp',
    value: '+31 6 1234 5678',
    href: 'https://wa.me/31612345678',
    description: 'Send us a voice note or text and we will get back within the hour.',
    priority: 3
  }
]

const FALLBACK_AVAILABILITY: SupportAvailabilityView = {
  timezone: 'Europe/Amsterdam',
  windows: [
    {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      start: '09:00',
      end: '18:00',
      note: 'Core support team online.'
    },
    {
      days: ['saturday'],
      start: '10:00',
      end: '14:00',
      note: 'On-call crew for live events.'
    }
  ],
  note: 'Outside these hours we monitor inboxes for urgent event-day issues.'
}

const FALLBACK_MESSAGES: Record<string, SupportMessageView> = {
  en: {
    headline: 'Need help planning your event?',
    body: 'Our specialists are ready via email, phone or WhatsApp. Reach out and we will reply shortly.',
    availabilityNote: 'Average response time: under 1 hour on business days.'
  },
  nl: {
    headline: 'Hulp nodig met je eventplanning?',
    body: 'Ons supportteam staat klaar via e-mail, telefoon of WhatsApp. Laat iets van je horen en we reageren snel.',
    availabilityNote: 'Gemiddelde reactietijd: binnen één uur op werkdagen.'
  }
}

const supportCache = new Map<string, { data: SupportViewModel; expiresAt: number }>()

const isNonNull = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined

const getBrowserLocale = (): string => {
  if (typeof navigator === 'undefined') {
    return 'en'
  }

  return navigator.language || 'en'
}

const normaliseLocale = (locale?: string): string => {
  if (!locale) {
    return 'en'
  }

  const trimmed = locale.trim()
  if (!trimmed) {
    return 'en'
  }

  return trimmed.toLowerCase().split(/[_.-]/)[0]
}

const sortChannels = (channels: SupportChannelView[]): SupportChannelView[] => {
  return [...channels].sort((a, b) => {
    const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER
    const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    return a.label.localeCompare(b.label)
  })
}

const cloneAvailability = (availability: SupportAvailabilityView): SupportAvailabilityView => ({
  timezone: availability.timezone,
  note: availability.note,
  windows: availability.windows.map((window) => ({
    days: [...window.days],
    start: window.start,
    end: window.end,
    note: window.note
  }))
})

const buildFallbackView = (
  locale: string,
  options: { stale?: boolean; cacheStatus?: string; error?: string | null } = {}
): SupportViewModel => {
  const normalisedLocale = normaliseLocale(locale)
  const fallbackMessage = FALLBACK_MESSAGES[normalisedLocale] ?? FALLBACK_MESSAGES.en

  return {
    channels: sortChannels(FALLBACK_CHANNELS.map((channel) => ({ ...channel }))),
    availability: cloneAvailability(FALLBACK_AVAILABILITY),
    message: { ...fallbackMessage },
    locale: normalisedLocale,
    locales: Object.keys(FALLBACK_MESSAGES),
    metadata: {
      updatedAt: null,
      source: 'fallback',
      cacheStatus: options.cacheStatus ?? 'fallback',
      stale: Boolean(options.stale),
      error: options.error ?? null
    }
  }
}

const sanitiseChannel = (channel: SupportApiChannel, index: number): SupportChannelView | null => {
  if (!channel || typeof channel !== 'object') {
    return null
  }

  const value = typeof channel.value === 'string' ? channel.value.trim() : ''
  if (!value) {
    return null
  }

  const type = typeof channel.type === 'string' && channel.type.trim() ? channel.type.trim() : 'other'
  const label = typeof channel.label === 'string' && channel.label.trim()
    ? channel.label.trim()
    : type.charAt(0).toUpperCase() + type.slice(1)

  const priority = Number.isFinite(Number(channel.priority)) ? Number(channel.priority) : undefined
  const description = typeof channel.description === 'string' && channel.description.trim()
    ? channel.description.trim()
    : undefined

  const href = typeof channel.href === 'string' && channel.href.trim()
    ? channel.href.trim()
    : type === 'email'
      ? `mailto:${value}`
      : type === 'phone'
        ? `tel:${value.replace(/[^+\d]/g, '')}`
        : undefined

  const id = typeof channel.id === 'string' && channel.id.trim() ? channel.id.trim() : `${type}-${index}`

  return { id, type, label, value, href, description, priority }
}

const sanitiseAvailabilityWindow = (
  window: SupportApiAvailabilityWindow
): SupportAvailabilityWindowView | null => {
  if (!window || typeof window !== 'object') {
    return null
  }

  const days = Array.isArray(window.days)
    ? Array.from(
        new Set(
          window.days
            .map((day) => (typeof day === 'string' ? day.trim().toLowerCase() : ''))
            .filter((day) => DAY_ORDER.includes(day as (typeof DAY_ORDER)[number]))
        )
      )
    : []

  if (!days.length) {
    return null
  }

  const start = typeof window.start === 'string' && window.start.trim() ? window.start.trim() : null
  const end = typeof window.end === 'string' && window.end.trim() ? window.end.trim() : null

  if (!start || !end) {
    return null
  }

  const note = typeof window.note === 'string' && window.note.trim() ? window.note.trim() : undefined

  return { days, start, end, note }
}

const sanitiseAvailability = (
  availability: SupportApiAvailability | undefined,
  fallback: SupportAvailabilityView
): SupportAvailabilityView => {
  if (!availability || typeof availability !== 'object') {
    return cloneAvailability(fallback)
  }

  const timezone = typeof availability.timezone === 'string' && availability.timezone.trim()
    ? availability.timezone.trim()
    : fallback.timezone

  const windows = Array.isArray(availability.windows)
    ? availability.windows.map((window) => sanitiseAvailabilityWindow(window)).filter(isNonNull)
    : []

  const note = typeof availability.note === 'string' && availability.note.trim()
    ? availability.note.trim()
    : fallback.note

  return {
    timezone,
    windows: windows.length ? windows : cloneAvailability(fallback).windows,
    note
  }
}

const mapResponseToView = (response: SupportApiResponse, locale: string): SupportViewModel => {
  const fallback = buildFallbackView(locale, {
    stale: response.metadata?.stale,
    cacheStatus: response.metadata?.cacheStatus ?? 'miss',
    error: response.metadata?.error ?? null
  })

  const normalisedLocale = normaliseLocale(response.locale ?? locale)

  const channels = Array.isArray(response.channels) && response.channels.length
    ? sortChannels(response.channels.map((channel, index) => sanitiseChannel(channel, index)).filter(isNonNull))
    : fallback.channels

  const availability = sanitiseAvailability(response.availability, fallback.availability)

  const baseMessage = fallback.message
  const message: SupportMessageView = response.message && typeof response.message === 'object'
    ? {
        headline:
          typeof response.message.headline === 'string' && response.message.headline.trim()
            ? response.message.headline.trim()
            : baseMessage.headline,
        body:
          typeof response.message.body === 'string' && response.message.body.trim()
            ? response.message.body.trim()
            : baseMessage.body,
        availabilityNote:
          typeof response.message.availabilityNote === 'string' && response.message.availabilityNote.trim()
            ? response.message.availabilityNote.trim()
            : baseMessage.availabilityNote,
        ctaLabel:
          typeof response.message.ctaLabel === 'string' && response.message.ctaLabel.trim()
            ? response.message.ctaLabel.trim()
            : baseMessage.ctaLabel,
        ctaHref:
          typeof response.message.ctaHref === 'string' && response.message.ctaHref.trim()
            ? response.message.ctaHref.trim()
            : baseMessage.ctaHref
      }
    : baseMessage

  const locales = Array.isArray(response.locales) && response.locales.length
    ? Array.from(
        new Set(
          response.locales
            .map((value) => (typeof value === 'string' ? normaliseLocale(value) : null))
            .filter(isNonNull)
        )
      )
    : [...fallback.locales]

  if (!locales.includes(normalisedLocale)) {
    locales.push(normalisedLocale)
  }

  const metadataSource =
    typeof response.metadata?.source === 'string' && response.metadata.source.trim()
      ? response.metadata.source.trim()
      : response.metadata?.cacheStatus
        ? 'api'
        : fallback.metadata.source

  const metadata = {
    updatedAt: response.metadata?.updatedAt ?? fallback.metadata.updatedAt,
    source: metadataSource,
    cacheStatus: response.metadata?.cacheStatus ?? fallback.metadata.cacheStatus,
    stale: typeof response.metadata?.stale === 'boolean' ? response.metadata.stale : Boolean(fallback.metadata.stale),
    error: response.metadata?.error ?? fallback.metadata.error
  }

  return {
    channels,
    availability,
    message,
    locale: normalisedLocale,
    locales,
    metadata
  }
}

const formatDayRange = (indexes: number[], locale: string): string => {
  if (!indexes.length) {
    return ''
  }

  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const labels = indexes.map((index) => {
    const referenceDate = new Date(Date.UTC(2024, 0, 1 + index))
    return formatter.format(referenceDate)
  })

  if (indexes.length === 1) {
    return labels[0]
  }

  const isConsecutive = indexes.every((value, idx, arr) => idx === 0 || value === arr[idx - 1] + 1)
  return isConsecutive ? `${labels[0]} – ${labels[labels.length - 1]}` : labels.join(', ')
}

const formatAvailabilityWindows = (
  availability: SupportAvailabilityView,
  locale: string
): Array<{ id: string; label: string; hours: string; note?: string }> => {
  return availability.windows.map((window, index) => {
    const dayIndexes = window.days
      .map((day) => DAY_ORDER.indexOf(day as (typeof DAY_ORDER)[number]))
      .filter((value) => value >= 0)
      .sort((a, b) => a - b)

    const label = formatDayRange(dayIndexes, locale)

    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: availability.timezone
    })

    const toTime = (value: string): string => {
      const [hours, minutes] = value.split(':').map(Number)
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return value
      }
      const referenceDate = new Date(Date.UTC(2024, 0, 1, hours, minutes))
      return timeFormatter.format(referenceDate)
    }

    const hours = `${toTime(window.start)} – ${toTime(window.end)}`

    return {
      id: `${label || 'availability'}-${index}`,
      label,
      hours,
      note: window.note
    }
  })
}

const formatTimezoneLabel = (timezone: string, locale: string): string | null => {
  if (!timezone) {
    return null
  }

  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      timeZoneName: 'short'
    })

    const parts = formatter.formatToParts(new Date())
    const tzName = parts.find((part) => part.type === 'timeZoneName')?.value

    return tzName ? `${timezone} (${tzName})` : timezone
  } catch {
    return timezone
  }
}

const formatUpdatedAt = (value: string | null | undefined, locale: string): string | null => {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  } catch {
    return date.toISOString()
  }
}

const SupportCard = ({ locale, className }: SupportCardProps) => {
  const browserLocale = useMemo(() => locale ?? getBrowserLocale(), [locale])
  const resolvedLocale = useMemo(() => normaliseLocale(browserLocale), [browserLocale])

  const [state, setState] = useState<SupportState>(() => ({
    data: buildFallbackView(resolvedLocale, { cacheStatus: 'bootstrap' }),
    loading: true,
    error: null
  }))

  useEffect(() => {
    let cancelled = false
    const now = Date.now()
    const cacheEntry = supportCache.get(resolvedLocale)

    if (cacheEntry) {
      setState({ data: cacheEntry.data, loading: false, error: null })
    } else {
      setState({ data: buildFallbackView(resolvedLocale, { cacheStatus: 'bootstrap' }), loading: true, error: null })
    }

    const shouldRefresh = !cacheEntry || cacheEntry.expiresAt <= now
    if (!shouldRefresh) {
      return () => {
        cancelled = true
      }
    }

    const fetchSupport = async () => {
      try {
        const response = await apiClient.get<SupportApiResponse>(`/support?locale=${encodeURIComponent(resolvedLocale)}`)
        const viewModel = mapResponseToView(response, resolvedLocale)
        supportCache.set(resolvedLocale, { data: viewModel, expiresAt: Date.now() + CACHE_TTL_MS })
        if (!cancelled) {
          setState({ data: viewModel, loading: false, error: null })
        }
      } catch (error) {
        console.error('Failed to load support configuration', error)
        const fallback = cacheEntry
          ? {
              ...cacheEntry.data,
              metadata: {
                ...cacheEntry.data.metadata,
                stale: true,
                cacheStatus: 'stale',
                error: GENERIC_ERROR_MESSAGE
              }
            }
          : buildFallbackView(resolvedLocale, {
              stale: true,
              cacheStatus: 'fallback',
              error: GENERIC_ERROR_MESSAGE
            })

        supportCache.set(resolvedLocale, { data: fallback, expiresAt: Date.now() + STALE_CACHE_TTL_MS })

        if (!cancelled) {
          setState({ data: fallback, loading: false, error: GENERIC_ERROR_MESSAGE })
        }
      }
    }

    fetchSupport()

    return () => {
      cancelled = true
    }
  }, [resolvedLocale])

  const formattedWindows = useMemo(
    () => formatAvailabilityWindows(state.data.availability, resolvedLocale),
    [state.data.availability, resolvedLocale]
  )

  const timezoneLabel = useMemo(
    () => formatTimezoneLabel(state.data.availability.timezone, resolvedLocale),
    [state.data.availability.timezone, resolvedLocale]
  )

  const updatedAtLabel = useMemo(
    () => formatUpdatedAt(state.data.metadata.updatedAt, resolvedLocale),
    [state.data.metadata.updatedAt, resolvedLocale]
  )

  const statusMessage = useMemo(() => {
    if (state.data.metadata.stale) {
      return 'Showing saved contact details while we reconnect to the live service.'
    }

    if (state.loading) {
      return 'Loading support availability…'
    }

    return null
  }, [state.data.metadata.stale, state.loading])

  const containerClassName = ['support-card', className].filter(Boolean).join(' ')

  return (
    <section className={containerClassName} aria-live="polite">
      <header className="support-card__header">
        <h3 className="support-card__headline">{state.data.message.headline}</h3>
        <p className="support-card__body">{state.data.message.body}</p>
      </header>

      <ul className="support-card__channels">
        {state.data.channels.map((channel) => (
          <li key={channel.id} className={`support-card__channel support-card__channel--${channel.type}`}>
            {channel.href ? (
              <a className="support-card__channel-link" href={channel.href}>
                <span className="support-card__channel-label">{channel.label}</span>
                <span className="support-card__channel-value">{channel.value}</span>
              </a>
            ) : (
              <div className="support-card__channel-link" aria-label={`${channel.label}: ${channel.value}`}>
                <span className="support-card__channel-label">{channel.label}</span>
                <span className="support-card__channel-value">{channel.value}</span>
              </div>
            )}
            {channel.description ? (
              <p className="support-card__channel-description">{channel.description}</p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="support-card__availability">
        <h4 className="support-card__availability-title">Availability</h4>
        <ul className="support-card__availability-list">
          {formattedWindows.map((window) => (
            <li key={window.id} className="support-card__availability-item">
              <span className="support-card__availability-days">{window.label}</span>
              <span className="support-card__availability-hours">{window.hours}</span>
              {window.note ? (
                <span className="support-card__availability-note">{window.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
        {state.data.message.availabilityNote ? (
          <p className="support-card__availability-summary">{state.data.message.availabilityNote}</p>
        ) : null}
        {timezoneLabel ? (
          <p className="support-card__timezone">Timezone: {timezoneLabel}</p>
        ) : null}
      </div>

      <footer className="support-card__footer">
        {updatedAtLabel ? (
          <p className="support-card__updated-at">Last updated {updatedAtLabel}</p>
        ) : null}
        {statusMessage ? <p className="support-card__status">{statusMessage}</p> : null}
      </footer>
    </section>
  )
}

export default SupportCard
