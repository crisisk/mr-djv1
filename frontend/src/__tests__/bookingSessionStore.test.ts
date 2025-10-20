import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../lib/apiClient'
import {
  bookingSessionStore,
  bookingSessionTestHelpers
} from '../lib/bookingSessionStore'

describe('bookingSessionStore', () => {
  beforeEach(() => {
    bookingSessionTestHelpers.reset()
    vi.restoreAllMocks()
  })

  it('hydrates selections from the session endpoint', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      selections: {
        date: '2025-05-20',
        location: 'Tilburg',
        eventType: 'Bruiloft'
      }
    })

    const state = await bookingSessionStore.ensureHydrated(true)

    expect(apiClient.get).toHaveBeenCalledWith('/session')
    expect(state.status).toBe('ready')
    expect(state.selections).toMatchObject({
      location: 'Tilburg',
      eventType: 'Bruiloft',
      date: '2025-05-20'
    })
  })

  it('applies optimistic updates and syncs with the API response', async () => {
    bookingSessionTestHelpers.setState({
      status: 'ready'
    })

    const patchMock = vi.spyOn(apiClient, 'patch').mockResolvedValue({
      selections: {
        location: 'Amsterdam',
        pricing: {
          formattedTotal: '€1.499,-'
        }
      }
    })

    const updatePromise = bookingSessionStore.updateSelections({
      location: 'Amsterdam'
    })

    const optimisticState = bookingSessionStore.getSnapshot()
    expect(optimisticState.optimistic).toBe(true)
    expect(optimisticState.selections.location).toBe('Amsterdam')

    const result = await updatePromise

    expect(patchMock).toHaveBeenCalledWith('/session', {
      selections: { location: 'Amsterdam' }
    })
    expect(result.location).toBe('Amsterdam')

    const finalState = bookingSessionStore.getSnapshot()
    expect(finalState.optimistic).toBe(false)
    expect(finalState.status).toBe('ready')
    expect(finalState.selections.location).toBe('Amsterdam')
    expect(finalState.selections.pricing).toMatchObject({ formattedTotal: '€1.499,-' })
  })

  it('restores the previous state when an update fails', async () => {
    bookingSessionTestHelpers.setState({
      status: 'ready',
      selections: {
        date: null,
        location: 'Eindhoven',
        eventType: 'Bruiloft',
        package: null,
        pricing: null
      }
    })

    vi.spyOn(apiClient, 'patch').mockRejectedValue(new Error('Timeout'))

    await expect(
      bookingSessionStore.updateSelections({ location: 'Breda' })
    ).rejects.toThrow('Timeout')

    const state = bookingSessionStore.getSnapshot()
    expect(state.status).toBe('error')
    expect(state.optimistic).toBe(false)
    expect(state.error).toContain('Timeout')
    expect(state.selections.location).toBe('Eindhoven')
  })
})
