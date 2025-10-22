import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import QuickBookingForm from '../booking/QuickBookingForm'
import { recordBookingCta } from '../../lib/ctaTracking'
import type { BookingResponse } from '../../services/booking'

const StickyCTAWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  transform: translateY(${({ $visible }) => ($visible ? '0' : '120px')});
  transition: transform 0.3s ease-in-out;
  display: flex;
  justify-content: flex-end;
  width: min(100%, 360px);
  pointer-events: none;

  @media (max-width: 768px) {
    left: 0;
    right: 0;
    margin: 0 auto;
    width: calc(100% - 24px);
  }
`

const CtaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  pointer-events: auto;
`

const FloatingButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  border-radius: 9999px;
  padding: 0.9rem 1.6rem;
  background: #ff4136;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.2);
  transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: #e03026;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #111827;
    outline-offset: 2px;
  }
`

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #111827;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 0.375rem;

  &:hover {
    background: rgba(17, 24, 39, 0.08);
  }

  &:focus-visible {
    outline: 3px solid #111827;
    outline-offset: 2px;
  }
`

const SuccessBanner = styled.div`
  background: #dcfce7;
  color: #065f46;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  box-shadow: inset 0 0 0 1px rgba(6, 95, 70, 0.18);
`

const CTA_IDENTIFIER = 'sticky-booking-cta'
const SCROLL_THRESHOLD = 300

const isBrowser = () => typeof window !== 'undefined'

const initialVisibility = () => {
  if (!isBrowser()) {
    return false
  }

  return window.scrollY > SCROLL_THRESHOLD
}

const StickyBookingCTA = () => {
  const [isVisible, setIsVisible] = useState(initialVisibility)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isBrowser()) {
      return undefined
    }

    const updateVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    updateVisibility()

    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateVisibility)
    }
  }, [])

  useEffect(() => {
    if (!successMessage || !isBrowser()) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 8000)

    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const handleOpenForm = useCallback(() => {
    setIsFormOpen(true)
    setSuccessMessage(null)

    void recordBookingCta({
      cta: CTA_IDENTIFIER,
      metadata: {
        surface: 'sticky_booking_cta',
        trigger: 'open_form'
      }
    }).catch((error) => {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[StickyBookingCTA] Failed to record CTA', error)
      }
    })
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  const handleSuccess = useCallback((response: BookingResponse) => {
    setSuccessMessage(response.message ?? 'Bedankt voor je aanvraag!')
    setIsFormOpen(false)
  }, [])

  const hasFeedback = Boolean(successMessage)

  const content = useMemo(() => {
    if (isFormOpen) {
      return (
        <FormCard role="dialog" aria-modal="true" aria-label="Snelle boekingsaanvraag">
          <FormHeader>
            <Title>Boek direct een DJ</Title>
            <CloseButton type="button" onClick={handleCloseForm} aria-label="Sluit boekingsformulier">
              ×
            </CloseButton>
          </FormHeader>
          <QuickBookingForm
            origin={CTA_IDENTIFIER}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
            focusOnMount
          />
        </FormCard>
      )
    }

    return (
      <FloatingButton type="button" onClick={handleOpenForm} aria-haspopup="dialog" aria-expanded={isFormOpen}>
        Boek direct een DJ
      </FloatingButton>
    )
  }, [handleCloseForm, handleOpenForm, handleSuccess, isFormOpen])

  return (
    <StickyCTAWrapper $visible={isVisible} aria-live="polite">
      <CtaContainer>
        {hasFeedback ? (
          <SuccessBanner role="status">{successMessage}</SuccessBanner>
        ) : null}
        {content}
      </CtaContainer>
    </StickyCTAWrapper>
  )
}

export default StickyBookingCTA
