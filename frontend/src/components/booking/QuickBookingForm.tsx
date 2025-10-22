import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import type { BookingResponse } from '../../services/booking'
import useBooking from '../../hooks/useBooking'

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

const SecondaryButton = styled.button`
  background: transparent;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 0.6rem 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
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

type FormState = {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  message: string
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  message: '',
}

type QuickBookingFormProps = {
  origin: string
  onSuccess?: (response: BookingResponse) => void
  onCancel?: () => void
  className?: string
  focusOnMount?: boolean
}

const QuickBookingForm = ({ origin, onSuccess, onCancel, className, focusOnMount }: QuickBookingFormProps) => {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE)
  const { submit, status, error, reset } = useBooking()
  const [showValidationError, setShowValidationError] = useState(false)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (status === 'success') {
      reset()
      setShowValidationError(false)
    }
  }, [reset, status])

  useEffect(() => {
    if (!focusOnMount) {
      return
    }

    const node = nameInputRef.current
    node?.focus({ preventScroll: true })
  }, [focusOnMount])

  const isSubmitting = status === 'loading'

  const canSubmit = useMemo(() => {
    return (
      formState.name.trim().length > 0 &&
      formState.email.trim().length > 0 &&
      formState.phone.trim().length > 0 &&
      formState.eventType.trim().length > 0
    )
  }, [formState.email, formState.eventType, formState.name, formState.phone])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (showValidationError) {
      setShowValidationError(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit || isSubmitting) {
      setShowValidationError(true)
      return
    }

    try {
      const response = await submit({
        origin,
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        eventType: formState.eventType,
        eventDate: formState.eventDate ? formState.eventDate : undefined,
        message: formState.message.trim() ? formState.message.trim() : undefined,
      })
      setFormState(INITIAL_STATE)
      onSuccess?.(response)
    } catch (submissionError) {
      console.error('Quick booking form submission failed', submissionError)
    }
  }

  return (
    <Form className={className} onSubmit={handleSubmit} noValidate>
      {error ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
      {showValidationError && !canSubmit ? (
        <ErrorMessage role="alert">Vul alle verplichte velden in om je aanvraag te versturen.</ErrorMessage>
      ) : null}

      <Field>
        Naam*
        <Input
          ref={nameInputRef}
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          placeholder="Uw naam"
          required
        />
      </Field>

      <Field>
        E-mail*
        <Input
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="uw.naam@voorbeeld.nl"
          required
        />
      </Field>

      <Field>
        Telefoonnummer*
        <Input
          name="phone"
          type="tel"
          value={formState.phone}
          onChange={handleChange}
          placeholder="+31 6 12345678"
          required
        />
        <HelperText>We bellen je alleen voor updates over je aanvraag.</HelperText>
      </Field>

      <Field>
        Type evenement*
        <Select name="eventType" value={formState.eventType} onChange={handleChange} required>
          {EVENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        Datum (optioneel)
        <Input name="eventDate" type="date" value={formState.eventDate} onChange={handleChange} />
      </Field>

      <Field>
        Voorkeursbericht (optioneel)
        <Textarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Vertel kort over je event"
        />
      </Field>

      <Actions>
        {onCancel ? (
          <SecondaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
            Annuleren
          </SecondaryButton>
        ) : null}
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Versturen…' : 'Verstuur aanvraag'}
        </SubmitButton>
      </Actions>
    </Form>
  )
}

export default QuickBookingForm
