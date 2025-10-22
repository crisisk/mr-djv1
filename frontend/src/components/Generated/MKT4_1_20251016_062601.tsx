import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { recordBookingCta } from '../../lib/ctaTracking'
import useBooking from '../../hooks/useBooking'

const PopupOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
`

const PopupContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 520px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #111827;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
`

const SuccessMessage = styled.div`
  margin-top: 0.25rem;
  background: #dcfce7;
  color: #065f46;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #111827;
`

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;

  &:focus {
    outline: 2px solid #111827;
    outline-offset: 1px;
  }
`

const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;

  &:focus {
    outline: 2px solid #111827;
    outline-offset: 1px;
  }
`

const Textarea = styled.textarea`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  min-height: 90px;
  font-size: 0.95rem;

  &:focus {
    outline: 2px solid #111827;
    outline-offset: 1px;
  }
`

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
`

const SubmitButton = styled.button`
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 0.6rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:enabled {
    background: #0b0d17;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.p`
  background: #fee2e2;
  color: #991b1b;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  margin: 0;
`

const EVENT_TYPES: Array<{ value: string; label: string }> = [
  { value: '', label: 'Selecteer type evenement' },
  { value: 'bruiloft', label: 'Bruiloft' },
  { value: 'bedrijfsfeest', label: 'Bedrijfsfeest' },
  { value: 'verjaardag', label: 'Verjaardag' },
  { value: 'jubileum', label: 'Jubileum' },
  { value: 'feest', label: 'Feest of festival' },
  { value: 'anders', label: 'Anders' },
]

const resolveField = (value: FormDataEntryValue | null | undefined) =>
  typeof value === 'string' ? value.trim() : ''

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const { submit, status, error, reset } = useBooking()

  useEffect(() => {
    const hasSeenPopup = window.localStorage.getItem('djExitPopupShown')
    if (hasSeenPopup) {
      return
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        setShowPopup(true)
        window.localStorage.setItem('djExitPopupShown', 'true')
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (!window.localStorage.getItem('djExitPopupShown') && window.innerWidth <= 768) {
        setShowPopup(true)
        window.localStorage.setItem('djExitPopupShown', 'true')
      }
    }, 30_000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.clearTimeout(timeoutId)
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (status === 'success') {
      reset()
      setValidationError(null)
    }
  }, [reset, status])

  const isSubmitting = status === 'loading'

  const handleClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setShowPopup(false)
    setSuccessMessage(null)
    setValidationError(null)
    formRef.current?.reset()
  }, [])

  const handleSuccess = useCallback((message: string | null | undefined) => {
    setSuccessMessage(message ?? 'Bedankt voor je aanvraag!')

    closeTimerRef.current = window.setTimeout(() => {
      setShowPopup(false)
      setSuccessMessage(null)
      setValidationError(null)
      formRef.current?.reset()
      closeTimerRef.current = null
    }, 2_000)

    void recordBookingCta({
      cta: 'exit-intent-popup',
      metadata: {
        surface: 'exit_intent_popup',
        trigger: 'exit_intent',
      },
      navigateTo: '/#contact',
    }).catch((ctaError) => {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[ExitIntentPopup] Failed to record CTA', ctaError)
      }
    })
  }, [])

  const extractFormData = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const name = resolveField(data.get('name'))
    const email = resolveField(data.get('email'))
    const phone = resolveField(data.get('phone'))
    const eventType = resolveField(data.get('eventType'))
    const eventDate = resolveField(data.get('eventDate'))
    const message = resolveField(data.get('message'))

    const canSubmit = name && email && phone && eventType

    return {
      canSubmit,
      payload: {
        origin: 'exit-intent-popup' as const,
        name,
        email,
        phone,
        eventType,
        eventDate: eventDate || undefined,
        message: message || undefined,
      },
    }
  }

  const submitForm = async (form: HTMLFormElement | null) => {
    if (!form) {
      return
    }

    const { canSubmit, payload } = extractFormData(form)

    if (!canSubmit || isSubmitting) {
      setValidationError('Vul alle verplichte velden in om je aanvraag te versturen.')
      return
    }

    setValidationError(null)

    try {
      const response = await submit(payload)
      form.reset()
      handleSuccess(response?.message)
    } catch (submissionError) {
      console.error('Exit intent booking submission failed', submissionError)
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    await submitForm(event.currentTarget)
  }

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    const form = event.currentTarget.closest('form') as HTMLFormElement | null
    await submitForm(form)
  }

  return (
    <PopupOverlay $show={showPopup} role="dialog" aria-modal="true" onClick={handleClose}>
      <PopupContent onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={handleClose} aria-label="Sluiten">
          &times;
        </CloseButton>
        <h2 id="exit-intent-heading">🎵 Special Offer!</h2>
        <p>Don't miss out on your perfect DJ experience!</p>
        <p>Gebruik code <strong>FIRSTMIX</strong> voor 15% korting op je eerste boeking.</p>
        {successMessage ? <SuccessMessage role="status">{successMessage}</SuccessMessage> : null}
        <Form ref={formRef} data-testid="exit-booking-form" onSubmit={handleSubmit} noValidate>
          {error ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
          {validationError ? <ErrorMessage role="alert">{validationError}</ErrorMessage> : null}
          <Field>
            Naam*
            <Input name="name" type="text" placeholder="Uw naam" required autoFocus />
          </Field>
          <Field>
            E-mail*
            <Input name="email" type="email" placeholder="uw.naam@voorbeeld.nl" required />
          </Field>
          <Field>
            Telefoonnummer*
            <Input name="phone" type="tel" placeholder="+31 6 12345678" required />
            <HelperText>We bellen je alleen voor updates over je aanvraag.</HelperText>
          </Field>
          <Field>
            Type evenement*
            <Select name="eventType" required defaultValue="">
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            Datum (optioneel)
            <Input name="eventDate" type="date" />
          </Field>
          <Field>
            Voorkeursbericht (optioneel)
            <Textarea name="message" placeholder="Vertel kort over je event" />
          </Field>
          <Actions>
            <SubmitButton type="button" onClick={handleButtonClick} disabled={isSubmitting}>
              {isSubmitting ? 'Versturen…' : 'Verstuur aanvraag'}
            </SubmitButton>
          </Actions>
        </Form>
      </PopupContent>
    </PopupOverlay>
  )
}

export default ExitIntentPopup
