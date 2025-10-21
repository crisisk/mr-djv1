// components/StickyBookingCTA.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import QuickBookingForm from '../booking/QuickBookingForm'

const StickyCTAWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transform: translateY(${(props) => (props.$visible ? '0' : '120px')});
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`

const BookButton = styled.button`
  background: #ff4136;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e03026;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.2);
  padding: 1.5rem;
  width: clamp(280px, 90vw, 360px);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &:hover {
    background: rgba(17, 24, 39, 0.05);
  }
`

const SuccessBanner = styled.div`
  background: #dcfce7;
  color: #065f46;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: inset 0 0 0 1px rgba(6, 95, 70, 0.1);
  font-size: 0.95rem;
`

const StickyBookingCTA = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300
      setIsVisible(shouldShow)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleOpenForm = useCallback(() => {
    setSuccessMessage(null)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  const handleSuccess = useCallback((response: { message?: string }) => {
    setSuccessMessage(response?.message ?? 'Bedankt! We nemen binnen 24 uur contact op.')
    setIsFormOpen(false)
  }, [])

  const ctaContent = useMemo(() => {
    if (successMessage) {
      return <SuccessBanner role="status">{successMessage}</SuccessBanner>
    }

    if (isFormOpen) {
      return (
        <FormCard>
          <FormHeader>
            <Title>Plan je DJ</Title>
            <CloseButton type="button" aria-label="Sluit formulier" onClick={handleCloseForm}>
              &times;
            </CloseButton>
          </FormHeader>
          <QuickBookingForm origin="sticky-cta" onSuccess={handleSuccess} onCancel={handleCloseForm} autoFocus />
        </FormCard>
      )
    }

    return (
      <BookButton type="button" onClick={handleOpenForm}>
        Boek direct een DJ
      </BookButton>
    )
  }, [handleCloseForm, handleOpenForm, handleSuccess, isFormOpen, successMessage])

  return <StickyCTAWrapper $visible={isVisible}>{ctaContent}</StickyCTAWrapper>
}

export default StickyBookingCTA
