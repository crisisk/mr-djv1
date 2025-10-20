import { useCallback, useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { apiClient } from './apiClient'
import type { ApiClientError } from './apiClient'

export interface PricingBreakdownItem {
  label?: string | null
  amount?: number | null
  formattedAmount?: string | null
  [key: string]: unknown
}

export interface PricingSummary {
  total?: number | null
  currency?: string | null
  formattedTotal?: string | null
  breakdown?: PricingBreakdownItem[]
  [key: string]: unknown
}

export interface BookingPackageSummary {
  id?: string | number | null
  name?: string | null
  slug?: string | null
  description?: string | null
  price?: number | null
  currency?: string | null
  [key: string]: unknown
}

export interface BookingSelections {
  date: string | null
  location: string | null
  eventType: string | null
  package: BookingPackageSummary | null
  pricing: PricingSummary | null
}

export type BookingSelectionUpdate = Partial<BookingSelections>

export interface BookingSessionState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  selections: BookingSelections
  error: string | null
  optimistic: boolean
  lastSyncedAt: number | null
}

interface SessionResponse {
  selections?: unknown
}

const structuredCloneFn: (<T>(value: T) => T) | undefined =
  typeof globalThis.structuredClone === 'function'
    ? globalThis.structuredClone.bind(globalThis)
    : undefined

const DEFAULT_SELECTIONS: BookingSelections = Object.freeze({
  date: null,
  location: null,
  eventType: null,
  package: null,
  pricing: null
})

function createDefaultSelections(): BookingSelections {
  return {
    date: DEFAULT_SELECTIONS.date,
    location: DEFAULT_SELECTIONS.location,
    eventType: DEFAULT_SELECTIONS.eventType,
    package: DEFAULT_SELECTIONS.package,
    pricing: DEFAULT_SELECTIONS.pricing
  }
}

function cloneValue<T>(value: T): T {
  if (value === null || value === undefined) {
    return value
  }

  if (structuredCloneFn) {
    return structuredCloneFn(value)
  }

  return JSON.parse(JSON.stringify(value))
}

function cloneSelections(value: BookingSelections | undefined): BookingSelections {
  if (!value) {
    return createDefaultSelections()
  }

  return {
    date: value.date ?? null,
    location: value.location ?? null,
    eventType: value.eventType ?? null,
    package: value.package ? cloneValue(value.package) : null,
    pricing: value.pricing ? cloneValue(value.pricing) : null
  }
}

function normaliseString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalisePackage(value: unknown): BookingPackageSummary | null | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  if (typeof value !== 'object') {
    return null
  }

  const source = value as Record<string, unknown>
  const result: BookingPackageSummary = {}

  for (const [key, raw] of Object.entries(source)) {
    if (raw === undefined) {
      continue
    }

    if (typeof raw === 'string') {
      ;(result as Record<string, unknown>)[key] = raw.trim()
    } else {
      ;(result as Record<string, unknown>)[key] = raw
    }
  }

  return result
}

function normaliseBreakdown(items: unknown): PricingBreakdownItem[] | undefined {
  if (!Array.isArray(items)) {
    return undefined
  }

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const source = item as Record<string, unknown>
      const result: PricingBreakdownItem = {}

      for (const [key, raw] of Object.entries(source)) {
        if (raw === undefined) {
          continue
        }

        if (typeof raw === 'string') {
          ;(result as Record<string, unknown>)[key] = raw.trim()
        } else {
          ;(result as Record<string, unknown>)[key] = raw
        }
      }

      return result
    })
}

function normalisePricing(value: unknown): PricingSummary | null | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  if (typeof value !== 'object') {
    return null
  }

  const source = value as Record<string, unknown>
  const result: PricingSummary = {}

  for (const [key, raw] of Object.entries(source)) {
    if (raw === undefined) {
      continue
    }

    if (key === 'breakdown') {
      const breakdown = normaliseBreakdown(raw)
      if (breakdown) {
        result.breakdown = breakdown
      }
      continue
    }

    if (typeof raw === 'string') {
      ;(result as Record<string, unknown>)[key] = raw.trim()
    } else {
      ;(result as Record<string, unknown>)[key] = raw
    }
  }

  return result
}

function normaliseSelections(raw: unknown): BookingSelections {
  const base = createDefaultSelections()

  if (!raw || typeof raw !== 'object') {
    return base
  }

  const source = raw as Record<string, unknown>

  if (Object.prototype.hasOwnProperty.call(source, 'date')) {
    base.date = normaliseString(source.date)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'location')) {
    base.location = normaliseString(source.location)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'eventType')) {
    base.eventType = normaliseString(source.eventType)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'package')) {
    const pkg = normalisePackage(source.package ?? null)
    if (pkg !== undefined) {
      base.package = pkg
    }
  }

  if (Object.prototype.hasOwnProperty.call(source, 'pricing')) {
    const pricing = normalisePricing(source.pricing ?? null)
    if (pricing !== undefined) {
      base.pricing = pricing
    }
  }

  return base
}

function mergeSelections(base: BookingSelections, updates: BookingSelectionUpdate): BookingSelections {
  const next = cloneSelections(base)
  const source = updates as Record<string, unknown>

  if (Object.prototype.hasOwnProperty.call(source, 'date')) {
    next.date = normaliseString(source.date)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'location')) {
    next.location = normaliseString(source.location)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'eventType')) {
    next.eventType = normaliseString(source.eventType)
  }

  if (Object.prototype.hasOwnProperty.call(source, 'package')) {
    const pkg = normalisePackage(source.package ?? null)
    if (pkg !== undefined) {
      next.package = pkg
    }
  }

  if (Object.prototype.hasOwnProperty.call(source, 'pricing')) {
    const pricing = normalisePricing(source.pricing ?? null)
    if (pricing !== undefined) {
      next.pricing = pricing
    }
  }

  return next
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as Partial<ApiClientError>

    const data = err.data as Record<string, unknown> | undefined
    if (data && typeof data.error === 'string' && data.error.trim().length > 0) {
      return data.error
    }

    if (typeof err.message === 'string' && err.message.trim().length > 0) {
      return err.message
    }
  }

  return 'Er is iets misgegaan bij het opslaan van je keuzes.'
}

let state: BookingSessionState = {
  status: 'idle',
  selections: createDefaultSelections(),
  error: null,
  optimistic: false,
  lastSyncedAt: null
}

const listeners = new Set<() => void>()
let hydrationPromise: Promise<BookingSessionState> | null = null
let mutationCounter = 0
const mutationHistory = new Map<number, BookingSelections>()

function notify() {
  listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error('bookingSessionStore listener failed', error)
    }
  })
}

function setState(
  updater:
    | Partial<BookingSessionState>
    | ((current: BookingSessionState) => BookingSessionState)
): BookingSessionState {
  const nextState =
    typeof updater === 'function'
      ? updater(state)
      : {
          ...state,
          ...updater,
          selections:
            updater && 'selections' in updater && updater.selections
              ? (updater.selections as BookingSelections)
              : state.selections
        }

  state = {
    ...nextState,
    selections: cloneSelections(nextState.selections)
  }

  notify()
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return state
}

async function hydrate(force = false): Promise<BookingSessionState> {
  if (!force) {
    if (state.status === 'loading') {
      return hydrationPromise ?? state
    }

    if (state.status === 'ready') {
      return state
    }
  }

  if (hydrationPromise) {
    return hydrationPromise
  }

  hydrationPromise = (async () => {
    setState((current) => ({
      ...current,
      status: 'loading',
      error: current.status === 'error' && !force ? current.error : null,
      optimistic: current.optimistic
    }))

    try {
      const response = await apiClient.get<SessionResponse>('/session')
      const selections = normaliseSelections(response?.selections)

      return setState({
        status: 'ready',
        selections,
        error: null,
        optimistic: false,
        lastSyncedAt: Date.now()
      })
    } catch (error) {
      const message = getErrorMessage(error)
      setState((current) => ({
        ...current,
        status: 'error',
        error: message,
        optimistic: false
      }))
      throw error
    } finally {
      hydrationPromise = null
    }
  })()

  return hydrationPromise
}

function ensureHydrated(force = false) {
  return hydrate(force)
}

async function updateSelections(updates: BookingSelectionUpdate): Promise<BookingSelections> {
  if (!updates || Object.keys(updates).length === 0) {
    return cloneSelections(state.selections)
  }

  const mutationId = ++mutationCounter
  const previousSelections = cloneSelections(state.selections)
  mutationHistory.set(mutationId, previousSelections)

  const optimisticSelections = mergeSelections(previousSelections, updates)
  setState((current) => ({
    ...current,
    status: current.status === 'idle' ? 'ready' : current.status,
    selections: optimisticSelections,
    optimistic: true,
    error: null
  }))

  try {
    const response = await apiClient.patch<SessionResponse>('/session', {
      selections: updates
    })
    const resolved = normaliseSelections(response?.selections)

    if (mutationId === mutationCounter) {
      setState({
        status: 'ready',
        selections: resolved,
        error: null,
        optimistic: false,
        lastSyncedAt: Date.now()
      })
    } else {
      setState((current) => ({
        ...current,
        status: 'ready',
        optimistic: current.optimistic,
        error: null,
        lastSyncedAt: Date.now()
      }))
    }

    return resolved
  } catch (error) {
    const message = getErrorMessage(error)
    const previousSyncedAt = state.lastSyncedAt

    if (mutationId === mutationCounter) {
      const fallback = mutationHistory.get(mutationId) ?? previousSelections
      setState({
        status: 'error',
        selections: fallback,
        error: message,
        optimistic: false,
        lastSyncedAt: previousSyncedAt
      })
    } else {
      setState((current) => ({
        ...current,
        status: 'error',
        error: message,
        optimistic: false
      }))
    }

    throw error
  } finally {
    mutationHistory.delete(mutationId)
  }
}

function resetStore() {
  state = {
    status: 'idle',
    selections: createDefaultSelections(),
    error: null,
    optimistic: false,
    lastSyncedAt: null
  }
  hydrationPromise = null
  mutationCounter = 0
  mutationHistory.clear()
  notify()
}

function setStateForTesting(partial: Partial<BookingSessionState>) {
  state = {
    ...state,
    ...partial,
    selections: partial.selections
      ? cloneSelections(partial.selections)
      : cloneSelections(state.selections)
  }
  notify()
}

export const bookingSessionStore = {
  subscribe,
  getSnapshot,
  ensureHydrated,
  updateSelections,
  reset: resetStore
}

export function useBookingSession(options?: { autoHydrate?: boolean }) {
  const autoHydrate = options?.autoHydrate ?? true
  const snapshot = useSyncExternalStore(bookingSessionStore.subscribe, getSnapshot, getSnapshot)

  const ensure = useCallback((force = false) => ensureHydrated(force), [])
  const update = useCallback((updates: BookingSelectionUpdate) => updateSelections(updates), [])
  const refresh = useCallback(() => ensureHydrated(true), [])

  useEffect(() => {
    if (autoHydrate && snapshot.status === 'idle') {
      ensure().catch(() => undefined)
    }
  }, [autoHydrate, ensure, snapshot.status])

  return {
    ...snapshot,
    ensureHydrated: ensure,
    updateSelections: update,
    refresh
  }
}

export const bookingSessionTestHelpers = {
  reset: resetStore,
  setState: setStateForTesting
}
