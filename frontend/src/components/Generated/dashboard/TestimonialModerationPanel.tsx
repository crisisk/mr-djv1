"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

type ModerationAction = 'approve' | 'reject'

export type PendingTestimonial = {
  id: string | number
  name: string | null
  eventType: string | null
  city: string | null
  rating: number | null
  reviewText: string | null
  createdAt?: string | null
  moderationState?: 'pending' | 'approved' | 'rejected'
}

const dateTimeFormatter = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Amsterdam'
})

type FetchState = {
  loading: boolean
  error?: string
  testimonials: PendingTestimonial[]
  lastLoadedAt?: string | null
}

type ActionState = Record<string, ModerationAction | null>

type FeedbackState = {
  type: 'success' | 'error'
  message: string
} | null

const DEFAULT_LIST_ENDPOINT = '/dashboard/api/reviews/pending'
const DEFAULT_MUTATION_BASE = '/dashboard/api/reviews'

export interface TestimonialModerationPanelProps {
  listEndpoint?: string
  moderationEndpointBase?: string
}

function formatDate(value: string | null | undefined, hydrated: boolean): string {
  if (!value || !hydrated) {
    return 'Onbekende datum'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Onbekende datum'
  }

  try {
    return dateTimeFormatter.format(date)
  } catch (_error) {
    return date.toISOString()
  }
}

function formatCity(city?: string | null): string {
  return city && city.trim().length > 0 ? city : 'Onbekende stad'
}

function formatRating(rating?: number | null): string {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) {
    return '—'
  }
  return `${rating.toFixed(1)} / 5`
}

export default function TestimonialModerationPanel({
  listEndpoint = DEFAULT_LIST_ENDPOINT,
  moderationEndpointBase = DEFAULT_MUTATION_BASE
}: TestimonialModerationPanelProps) {
  const [state, setState] = useState<FetchState>({ loading: true, testimonials: [] })
  const [actions, setActions] = useState<ActionState>({})
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const normalizedListEndpoint = useMemo(() => {
    return listEndpoint.replace(/\/$/, '')
  }, [listEndpoint])

  const normalizedModerationBase = useMemo(() => {
    return moderationEndpointBase.replace(/\/$/, '')
  }, [moderationEndpointBase])

  const loadTestimonials = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }))
    setFeedback(null)

    try {
      const response = await fetch(normalizedListEndpoint, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Kon testimonials niet laden')
      }

      const payload = (await response.json()) as { testimonials?: PendingTestimonial[] }
      const testimonials = Array.isArray(payload.testimonials) ? payload.testimonials : []
      setState({ loading: false, testimonials, lastLoadedAt: new Date().toISOString() })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout bij laden van testimonials'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }, [normalizedListEndpoint])

  useEffect(() => {
    loadTestimonials()
  }, [loadTestimonials])

  const isActing = useCallback(
    (testimonialId: string | number) => Boolean(actions[String(testimonialId)]),
    [actions]
  )

  const handleModeration = useCallback(
    async (testimonialId: string | number, action: ModerationAction) => {
      const actionKey = String(testimonialId)
      setActions((prev) => ({ ...prev, [actionKey]: action }))
      setFeedback(null)

      try {
        const url = `${normalizedModerationBase}/${encodeURIComponent(actionKey)}/${action}`
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({})
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          const errorMessage = typeof payload.error === 'string' ? payload.error : undefined
          throw new Error(
            errorMessage ||
              (action === 'approve'
                ? 'Kon testimonial niet goedkeuren'
                : 'Kon testimonial niet afwijzen')
          )
        }

        setFeedback({
          type: 'success',
          message: action === 'approve' ? 'Testimonial goedgekeurd' : 'Testimonial afgewezen'
        })
        await loadTestimonials()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Onbekende fout bij moderatie'
        setFeedback({ type: 'error', message })
      } finally {
        setActions((prev) => {
          const next = { ...prev }
          delete next[actionKey]
          return next
        })
      }
    },
    [normalizedModerationBase, loadTestimonials]
  )

  return (
    <section className="testimonial-panel" data-loading={state.loading ? 'true' : undefined}>
      <header className="testimonial-panel__header">
        <div>
          <h2>Testimonials in moderatie</h2>
          <p className="testimonial-panel__description">
            Keur binnengekomen testimonials goed of wijs af zodat de openbare reviews direct actueel blijven.
          </p>
        </div>
        <button
          className="testimonial-panel__refresh"
          type="button"
          onClick={loadTestimonials}
          disabled={state.loading}
        >
          {state.loading ? 'Bezig…' : 'Ververs'}
        </button>
      </header>

      {feedback ? (
        <p className={`testimonial-panel__feedback testimonial-panel__feedback--${feedback.type}`} role="status">
          {feedback.message}
        </p>
      ) : null}

      {state.error ? (
        <p className="testimonial-panel__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <ul className="testimonial-panel__list">
        {state.testimonials.length === 0 && !state.loading ? (
          <li className="testimonial-panel__empty">Geen pending testimonials gevonden.</li>
        ) : null}
        {state.testimonials.map((testimonial) => {
          const actionInFlight = isActing(testimonial.id)
          return (
            <li key={String(testimonial.id)} className="testimonial-card">
              <header className="testimonial-card__header">
                <div>
                  <h3>{testimonial.name || 'Onbekende inzender'}</h3>
                  <p className="testimonial-card__event">{testimonial.eventType || 'Onbekend evenement'}</p>
                </div>
                <dl className="testimonial-card__meta">
                  <div>
                    <dt>Stad</dt>
                    <dd>{formatCity(testimonial.city)}</dd>
                  </div>
                  <div>
                    <dt>Rating</dt>
                    <dd>{formatRating(testimonial.rating)}</dd>
                  </div>
                </dl>
              </header>

              <p className="testimonial-card__text">{testimonial.reviewText || 'Geen bericht toegevoegd.'}</p>

              <footer className="testimonial-card__footer">
                <time dateTime={testimonial.createdAt ?? undefined}>{formatDate(testimonial.createdAt, hydrated)}</time>
                <div className="testimonial-card__actions">
                  <button
                    type="button"
                    className="testimonial-card__action testimonial-card__action--approve"
                    onClick={() => handleModeration(testimonial.id, 'approve')}
                    disabled={actionInFlight}
                  >
                    Goedkeuren
                  </button>
                  <button
                    type="button"
                    className="testimonial-card__action testimonial-card__action--reject"
                    onClick={() => handleModeration(testimonial.id, 'reject')}
                    disabled={actionInFlight}
                  >
                    Afwijzen
                  </button>
                </div>
              </footer>
            </li>
          )
        })}
      </ul>

      <footer className="testimonial-panel__footer">
        Laatste update: {state.lastLoadedAt ? formatDate(state.lastLoadedAt, hydrated) : 'Onbekend'}
      </footer>
    </section>
  )
}
