import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookingSidebar from '../components/BookingSidebar'

const quoteResponse = {
  currency: 'EUR',
  package: { id: 'gold', name: 'Goud Pakket', price: 995 },
  extras: [
    { id: 'photobooth', name: 'Photobooth', price: 200, description: null },
  ],
  location: {
    input: 'Amsterdam',
    zone: 'randstad',
    label: 'Randstad & centraal Nederland',
    travelFee: 50,
  },
  totals: {
    base: 995,
    extras: 200,
    travel: 50,
    grandTotal: 1245,
  },
  updatedAt: '2025-02-01T10:00:00.000Z',
}

const createFetchResponse = (body: unknown) =>
  ({
    ok: true,
    text: async () => JSON.stringify(body),
  } as unknown as Response)

describe('BookingSidebar', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests pricing data and renders the totals when ready', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(createFetchResponse(quoteResponse))

    render(
      <BookingSidebar packageId="gold" location="Amsterdam" extras={['photobooth']} />
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    const [, options] = fetchMock.mock.calls[0]
    expect(fetchMock.mock.calls[0][0]).toBe('/pricing/quote')
    expect(options).toMatchObject({ method: 'POST' })
    expect(JSON.parse((options as RequestInit).body as string)).toEqual({
      packageId: 'gold',
      location: 'Amsterdam',
      extras: ['photobooth'],
    })

    await waitFor(() => {
      expect(screen.getByTestId('pricing-total').textContent?.replace(/\s+/g, ''))
        .toBe('€1.245,00')
    })
    expect(screen.getByText('Photobooth')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Bevestig/i })).toBeEnabled()
  })

  it('displays an error and allows retrying when pricing fails', async () => {
    const resolvedQuote = {
      ...quoteResponse,
      extras: [],
      location: {
        input: 'Eindhoven',
        zone: 'local',
        label: 'Regio Noord-Brabant & Limburg',
        travelFee: 0,
      },
      totals: {
        base: 1200,
        extras: 0,
        travel: 0,
        grandTotal: 1200,
      },
      updatedAt: '2025-03-01T08:30:00.000Z',
    }

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(createFetchResponse(resolvedQuote))

    const user = userEvent.setup()

    render(<BookingSidebar packageId="gold" location="Eindhoven" extras={[]} />)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Bevestig/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Opnieuw proberen/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await waitFor(() => {
      expect(screen.getByTestId('pricing-total').textContent?.replace(/\s+/g, ''))
        .toBe('€1.200,00')
    })
    expect(screen.getByRole('button', { name: /Bevestig/i })).toBeEnabled()
  })
})
