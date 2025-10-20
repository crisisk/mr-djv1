import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../lib/apiClient'

type PricingExtra = {
  id: string
  name: string
  price: number
  description?: string | null
}

type PricingLocation = {
  input: string | null
  zone: string
  label: string
  travelFee: number
}

type PricingPackage = {
  id: string
  name: string
  price: number
}

type PricingTotals = {
  base: number
  extras: number
  travel: number
  grandTotal: number
}

export type PricingQuote = {
  currency: string
  package: PricingPackage
  extras: PricingExtra[]
  location: PricingLocation
  totals: PricingTotals
  updatedAt: string
}

type PricingStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface BookingSidebarProps {
  packageId: string | null
  location?: string | null
  extras?: string[]
  onCheckout?: () => void
  isSubmitting?: boolean
  className?: string
}

const formatError = (error: unknown): string => {
  if (!error) {
    return 'Onbekende fout bij het ophalen van de prijs.'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message || 'Er ging iets mis bij het ophalen van de prijs.'
  }

  if (typeof error === 'object' && 'error' in (error as Record<string, unknown>)) {
    const value = (error as { error?: unknown }).error
    if (typeof value === 'string') {
      return value
    }
  }

  return 'Er ging iets mis bij het ophalen van de prijs.'
}

const uniqExtras = (extras?: string[] | null): string[] => {
  if (!Array.isArray(extras)) return []
  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const extra of extras) {
    if (typeof extra !== 'string') continue
    const normalised = extra.trim().toLowerCase()
    if (!normalised || seen.has(normalised)) continue
    seen.add(normalised)
    cleaned.push(normalised)
  }

  return cleaned
}

const BookingSidebar = ({
  packageId,
  location,
  extras,
  onCheckout,
  isSubmitting,
  className,
}: BookingSidebarProps) => {
  const [status, setStatus] = useState<PricingStatus>('idle')
  const [quote, setQuote] = useState<PricingQuote | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  const cleanedLocation = useMemo(() => (location ?? '').trim(), [location])
  const extrasList = useMemo(() => uniqExtras(extras), [extras])

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: quote?.currency ?? 'EUR',
        minimumFractionDigits: 2,
      }),
    [quote?.currency]
  )

  useEffect(() => {
    if (!packageId) {
      setStatus('idle')
      setQuote(null)
      setErrorMessage(null)
      return
    }

    let isCancelled = false
    setStatus('loading')
    setErrorMessage(null)

    const payload: Record<string, unknown> = {
      packageId,
      extras: extrasList,
    }

    if (cleanedLocation) {
      payload.location = cleanedLocation
    }

    apiClient
      .post<PricingQuote>('/pricing/quote', payload)
      .then((response) => {
        if (isCancelled) return
        setQuote(response)
        setStatus('ready')
      })
      .catch((error) => {
        if (isCancelled) return
        console.error('Failed to load pricing quote', error)
        setQuote(null)
        setStatus('error')
        setErrorMessage(formatError(error))
      })

    return () => {
      isCancelled = true
    }
  }, [packageId, cleanedLocation, requestVersion, extrasList])

  const retry = () => {
    setRequestVersion((value) => value + 1)
  }

  const handleCheckout = () => {
    if (status !== 'ready' || isSubmitting) return
    onCheckout?.()
  }

  const isCheckoutDisabled = status !== 'ready' || Boolean(isSubmitting)

  const renderExtras = () => {
    if (!quote || quote.extras.length === 0) {
      return <li className="booking-sidebar__empty">Geen extra opties geselecteerd</li>
    }

    return quote.extras.map((extra) => (
      <li key={extra.id} className="booking-sidebar__extra">
        <span>{extra.name}</span>
        <span>{currencyFormatter.format(extra.price)}</span>
      </li>
    ))
  }

  const asideClassName = useMemo(
    () => ['booking-sidebar', className].filter(Boolean).join(' '),
    [className]
  )

  return (
    <aside className={asideClassName} aria-live="polite">
      <header className="booking-sidebar__header">
        <h2>Jouw boeking</h2>
        {quote?.updatedAt && (
          <span className="booking-sidebar__timestamp">
            Laatst geüpdatet: {new Intl.DateTimeFormat('nl-NL', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(quote.updatedAt))}
          </span>
        )}
      </header>

      {status === 'idle' && (
        <p className="booking-sidebar__helper">Selecteer een pakket om een prijsopgave te zien.</p>
      )}

      {status === 'loading' && (
        <p className="booking-sidebar__status" role="status">
          Prijzen laden...
        </p>
      )}

      {status === 'error' && (
        <div className="booking-sidebar__error" role="alert">
          <p>{errorMessage ?? 'Kan prijs niet ophalen.'}</p>
          <button type="button" onClick={retry} className="booking-sidebar__retry">
            Opnieuw proberen
          </button>
        </div>
      )}

      {status === 'ready' && quote && (
        <div className="booking-sidebar__content">
          <section className="booking-sidebar__section">
            <h3>Pakket</h3>
            <p className="booking-sidebar__package-name">{quote.package.name}</p>
            <dl className="booking-sidebar__totals">
              <div className="booking-sidebar__row">
                <dt>Basisprijs</dt>
                <dd data-testid="pricing-base">{currencyFormatter.format(quote.totals.base)}</dd>
              </div>
              <div className="booking-sidebar__row">
                <dt>Extra&apos;s</dt>
                <dd data-testid="pricing-extras">{currencyFormatter.format(quote.totals.extras)}</dd>
              </div>
              <div className="booking-sidebar__row">
                <dt>Reiskosten</dt>
                <dd data-testid="pricing-travel">{currencyFormatter.format(quote.totals.travel)}</dd>
              </div>
            </dl>
          </section>

          <section className="booking-sidebar__section">
            <h3>Geselecteerde extra&apos;s</h3>
            <ul className="booking-sidebar__extras">{renderExtras()}</ul>
          </section>

          <section className="booking-sidebar__section booking-sidebar__section--location">
            <h3>Locatie</h3>
            <p className="booking-sidebar__location">
              {quote.location.input ?? 'Nog te bepalen'}
              <span className="booking-sidebar__location-zone">{quote.location.label}</span>
            </p>
          </section>

          <section className="booking-sidebar__summary">
            <div className="booking-sidebar__row booking-sidebar__row--total">
              <span>Totaal</span>
              <span data-testid="pricing-total">{currencyFormatter.format(quote.totals.grandTotal)}</span>
            </div>
          </section>
        </div>
      )}

      <footer className="booking-sidebar__footer">
        <button
          type="button"
          className="booking-sidebar__checkout"
          onClick={handleCheckout}
          disabled={isCheckoutDisabled}
        >
          Bevestig &amp; Ga Verder
        </button>
        {isCheckoutDisabled && status !== 'ready' && (
          <p className="booking-sidebar__footer-note">
            Afronden is pas mogelijk zodra de prijsopgave bevestigd is.
          </p>
        )}
      </footer>
    </aside>
  )
}

export default BookingSidebar
