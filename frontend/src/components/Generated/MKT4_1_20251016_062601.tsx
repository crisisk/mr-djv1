import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import QuickBookingForm from '../booking/QuickBookingForm'
import type { BookingResponse } from '../../services/booking'
import { recordBookingCta } from '../../lib/ctaTracking'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1100;
`

const Popup = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
  max-width: 640px;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;

  &:hover {
    background: rgba(148, 163, 184, 0.2);
  }

  &:focus-visible {
    outline: 3px solid #0f172a;
    outline-offset: 2px;
  }
`

const Heading = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
`

const SubHeading = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #475569;
`

const OfferHighlight = styled.div`
  background: linear-gradient(135deg, #fde68a, #f97316);
  color: #0f172a;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.15);
`

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #065f46;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  box-shadow: inset 0 0 0 1px rgba(6, 95, 70, 0.18);
`

const STORAGE_KEY = 'djExitPopupShown'
const CTA_IDENTIFIER = 'exit-intent-popup'
const AUTO_CLOSE_DELAY_MS = 2000
const MOBILE_TRIGGER_DELAY_MS = 30_000

const hasSeenPopup = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const markPopupSeen = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // ignore storage failures
  }
}

type ExitIntentPopupProps = {
  autoCloseDelayMs?: number
}

const ExitIntentPopup = ({ autoCloseDelayMs = AUTO_CLOSE_DELAY_MS }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showSuccessState, setShowSuccessState] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null)

  const closePopup = useCallback(() => {
    if (closeTimerRef.current !== null) {
      globalThis.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsOpen(false)
    setSuccessMessage(null)
    setShowSuccessState(false)
  }, [])

  const openPopup = useCallback(() => {
    setIsOpen(true)
    setShowSuccessState(false)
    setSuccessMessage(null)
    markPopupSeen()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    if (hasSeenPopup()) {
      return undefined
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        openPopup()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    const timeoutId = globalThis.setTimeout(() => {
      if (window.innerWidth <= 768) {
        openPopup()
      }
    }, MOBILE_TRIGGER_DELAY_MS)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      globalThis.clearTimeout(timeoutId)
    }
  }, [openPopup])

  const handleSuccess = useCallback((response: BookingResponse) => {
    setIsOpen(false)
    setShowSuccessState(true)
    setSuccessMessage(response.message ?? 'Bedankt voor je aanvraag!')
    void recordBookingCta({
      cta: CTA_IDENTIFIER,
      metadata: {
        surface: 'exit_intent_popup',
        outcome: 'conversion'
      }
    }).catch((error) => {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[ExitIntentPopup] Failed to record CTA conversion', error)
      }
    })
  }, [])

  useEffect(() => {
    if (!showSuccessState) {
      return undefined
    }

    if (closeTimerRef.current !== null) {
      globalThis.clearTimeout(closeTimerRef.current)
    }

    const timerId = globalThis.setTimeout(() => {
      closePopup()
    }, autoCloseDelayMs)
    closeTimerRef.current = timerId

    return () => {
      globalThis.clearTimeout(timerId)
      closeTimerRef.current = null
    }
  }, [autoCloseDelayMs, closePopup, showSuccessState])

  if (!isOpen && !showSuccessState) {
    return null
  }

  const showOffer = isOpen && !successMessage
  const shouldRenderSuccess = showSuccessState && successMessage

  return (
    <Overlay role="presentation" onClick={closePopup}>
      <Popup role="dialog" aria-modal="true" aria-label="Exit intent booking" onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={closePopup} aria-label="Sluit popup">
          ×
        </CloseButton>
        {showOffer ? (
          <>
            <Heading>🎵 Special Offer!</Heading>
            <SubHeading>Mis je kans niet op een onvergetelijke avond met onze professionele DJ's.</SubHeading>
            <OfferHighlight>Ontvang 15% korting op je eerste booking. Gebruik code FIRSTMIX.</OfferHighlight>
          </>
        ) : null}
        {shouldRenderSuccess ? <SuccessMessage role="status">{successMessage}</SuccessMessage> : null}
        {!showSuccessState ? (
          <QuickBookingForm origin={CTA_IDENTIFIER} onSuccess={handleSuccess} onCancel={closePopup} focusOnMount />
        ) : null}
      </Popup>
    </Overlay>
  )
}

export default ExitIntentPopup
