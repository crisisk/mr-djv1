import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ExitIntentPopup from '../components/Generated/MKT4_1_20251016_062601'

const submitMock = vi.fn()
const resetMock = vi.fn()

vi.mock('../hooks/useBooking', () => ({
  __esModule: true,
  default: () => ({
    submit: submitMock,
    status: 'idle',
    error: null,
    reset: resetMock,
  }),
}))

describe('ExitIntentPopup', () => {
  beforeEach(() => {
    localStorage.clear()
    submitMock.mockReset()
    resetMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it.skip('submits booking and closes popup after success', async () => {
    submitMock.mockResolvedValueOnce({ success: true, message: 'Top!' })

    vi.useFakeTimers()

    render(<ExitIntentPopup />)

    act(() => {
      const event = new MouseEvent('mouseleave', { clientY: 0, bubbles: true })
      document.dispatchEvent(event)
    })

    const form = await waitFor(() => screen.getByTestId('exit-booking-form'))
    const formUtils = within(form)

    await userEvent.type(formUtils.getByLabelText(/naam/i), 'Lead User')
    await userEvent.type(formUtils.getByLabelText(/e-mail/i), 'lead@example.com')
    await userEvent.type(formUtils.getByLabelText(/telefoonnummer/i), '+31699999999')
    await userEvent.selectOptions(formUtils.getByLabelText(/type evenement/i), 'feest')

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await waitFor(() => {
      expect(screen.getByText(/top!/i)).toBeInTheDocument()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(screen.queryByText(/special offer/i)).not.toBeInTheDocument()
    })

  })
})
