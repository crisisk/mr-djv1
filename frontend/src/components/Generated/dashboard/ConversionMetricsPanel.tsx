"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

export type FunnelStep = {
  id: string
  label: string
  count: number
}

export type VariantSummary = {
  variantId: string
  label: string
  conversions: number
  conversionRate: number
  ctaClicks: number
  exposures: number
  formStarts: number
  formSubmits: number
}

export type RecentConversion = {
  id: string
  variantId: string
  variantLabel: string
  keyword: string | null
  createdAt: string
  payload?: Record<string, unknown> | null
}

export type ConversionTotals = {
  exposures: number
  impressions: number
  ctaClicks: number
  conversions: number
  formStarts: number
  formSubmits: number
  conversionRate: number
  ctaClickRate: number
  formCompletionRate: number
  exposureLogSize: number
  eventLogSize: number
  conversionEvents: number
  formStartEvents: number
  formSubmitEvents: number
}

export type ConversionStats = {
  updatedAt?: string
  totals: ConversionTotals
  funnel: FunnelStep[]
  topVariants: VariantSummary[]
  recentConversions: RecentConversion[]
}

const numberFormatter = new Intl.NumberFormat('nl-NL')
const percentFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
})
const currencyFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR'
})
const dateTimeFormatter = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Amsterdam'
})

function formatNumber(value: number | undefined | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '0'
  }
  return numberFormatter.format(value)
}

function formatPercent(value: number | undefined | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }
  return percentFormatter.format(value / 100)
}

type FetchState = {
  loading: boolean
  error?: string
  data?: ConversionStats
}

const DEFAULT_ENDPOINT = '/dashboard/api/observability/conversions'

export interface ConversionMetricsPanelProps {
  endpoint?: string
}

export default function ConversionMetricsPanel({ endpoint = DEFAULT_ENDPOINT }: ConversionMetricsPanelProps) {
  const [state, setState] = useState<FetchState>({ loading: true })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const metricDefinitions = useMemo(
    () => [
      { key: 'exposures', label: 'Variant exposures' },
      { key: 'impressions', label: 'Hero impressions' },
      { key: 'ctaClicks', label: 'CTA clicks', rateKey: 'ctaClickRate', rateLabel: 'Click-through' },
      { key: 'formStarts', label: 'Form starts' },
      {
        key: 'formSubmits',
        label: 'Form submits',
        rateKey: 'formCompletionRate',
        rateLabel: 'Completion'
      },
      { key: 'conversions', label: 'Conversions', rateKey: 'conversionRate', rateLabel: 'Conversion rate' }
    ],
    []
  )

  const fetchStats = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }))

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Kon conversiestatistieken niet laden')
      }

      const payload = (await response.json()) as ConversionStats
      setState({ loading: false, data: payload })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout bij laden van metrics'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }, [endpoint])

  useEffect(() => {
    void fetchStats()
  }, [fetchStats])

  const totals = state.data?.totals
  const updatedAtLabel = useMemo(() => {
    if (!state.data?.updatedAt) {
      return 'Onbekend'
    }

    if (!hydrated) {
      return '—'
    }

    const parsed = new Date(state.data.updatedAt)
    if (Number.isNaN(parsed.getTime())) {
      return state.data.updatedAt
    }

    try {
      return dateTimeFormatter.format(parsed)
    } catch {
      return parsed.toISOString()
    }
  }, [hydrated, state.data?.updatedAt])

  const recentConversions = useMemo(() => {
    if (!state.data?.recentConversions || !hydrated) {
      return []
    }

    return state.data.recentConversions.map((entry) => {
      const timestamp = new Date(entry.createdAt)
      let formattedTimestamp: string
      if (Number.isNaN(timestamp.getTime())) {
        formattedTimestamp = entry.createdAt
      } else {
        try {
          formattedTimestamp = dateTimeFormatter.format(timestamp)
        } catch {
          formattedTimestamp = timestamp.toISOString()
        }
      }

      let revenue: string | null = null
      if (entry.payload && typeof entry.payload === 'object') {
        const rawAmount =
          (entry.payload.amount as number | string | undefined) ??
          (entry.payload.revenue as number | string | undefined) ??
          (entry.payload.value as number | string | undefined)
        const amount = typeof rawAmount === 'string' ? Number(rawAmount) : rawAmount
        if (typeof amount === 'number' && Number.isFinite(amount)) {
          try {
            revenue = ` · omzet: ${currencyFormatter.format(amount)}`
          } catch {
            revenue = ` · omzet: €${formatNumber(Math.round(amount))}`
          }
        }
      }

      return {
        id: entry.id,
        label: `${formattedTimestamp} – ${entry.variantLabel}`,
        meta: `${entry.keyword ? `keyword: ${entry.keyword}` : 'geen keyword'}${revenue ?? ''}`
      }
    })
  }, [hydrated, state.data?.recentConversions])

  return (
    <section className="conversion-panel" data-loading={state.loading ? 'true' : undefined}>
      <header className="conversion-panel__header">
        <div>
          <h2>Conversies &amp; funnel</h2>
          <p className="conversion-panel__description">
            Realtime overzicht van personalization funnel prestaties vanuit de configuratie dashboard API.
          </p>
        </div>
        <button className="conversion-panel__refresh" type="button" onClick={fetchStats} disabled={state.loading}>
          {state.loading ? 'Bezig…' : 'Ververs'}
        </button>
      </header>

      {state.error ? (
        <p className="conversion-panel__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="conversion-panel__grid">
        {metricDefinitions.map((definition) => {
          const value = totals ? (totals as Record<string, number>)[definition.key] : undefined
          const rateValue =
            totals && definition.rateKey ? (totals as Record<string, number>)[definition.rateKey] : undefined
          return (
            <article key={definition.key} className="conversion-panel__metric">
              <p className="metric-title">{definition.label}</p>
              <p className="metric-value">{formatNumber(value)}</p>
              {definition.rateKey ? (
                <span className="metric-secondary">
                  {(definition.rateLabel ?? 'Ratio') + ': ' + formatPercent(rateValue)}
                </span>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="conversion-panel__sections">
        <section>
          <h3>Funnel overzicht</h3>
          <ul className="funnel-list">
            {state.data?.funnel?.length ? (
              state.data.funnel.map((step) => (
                <li key={step.id}>
                  <span>{step.label}</span>
                  <span className="value">{formatNumber(step.count)}</span>
                </li>
              ))
            ) : (
              <li className="empty">Nog geen funnelgegevens beschikbaar.</li>
            )}
          </ul>
        </section>
        <section>
          <h3>Top varianten</h3>
          <ul className="metric-list">
            {state.data?.topVariants?.length ? (
              state.data.topVariants.map((variant) => (
                <li key={variant.variantId}>
                  <strong>{variant.label}</strong>
                  <span>
                    {formatNumber(variant.conversions)} conversies · CTA {formatNumber(variant.ctaClicks)} ·{' '}
                    {formatPercent(variant.conversionRate)}
                  </span>
                </li>
              ))
            ) : (
              <li className="empty">Nog geen varianten met conversies.</li>
            )}
          </ul>
        </section>
        <section>
          <h3>Laatste conversies</h3>
          <ul className="metric-list">
            {state.data?.recentConversions?.length ? (
              hydrated && recentConversions.length > 0 ? (
                recentConversions.map((entry) => (
                  <li key={entry.id}>
                    <span className="conversion-panel__recent-title">{entry.label}</span>
                    <span className="conversion-panel__recent-meta">{entry.meta}</span>
                  </li>
                ))
              ) : (
                <li className="empty">Hydratatie bezig…</li>
              )
            ) : (
              <li className="empty">Nog geen conversie events geregistreerd.</li>
            )}
          </ul>
        </section>
      </div>

      <footer className="conversion-panel__footer">Laatste update: {updatedAtLabel}</footer>
    </section>
  )
}
