// ExitIntentPopup.jsx
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { recordBookingCta } from '../../lib/ctaTracking';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateY(-100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  margin-top: 1rem;
  background: #dcfce7;
  color: #065f46;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
`

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('djExitPopupShown')
    if (hasSeenPopup) return

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowPopup(true)
        localStorage.setItem('djExitPopupShown', 'true')
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (!hasSeenPopup && window.innerWidth <= 768) {
        setShowPopup(true)
        localStorage.setItem('djExitPopupShown', 'true')
      }
    }, 30000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handleBookNow = useCallback(() => {
    void recordBookingCta({
      cta: 'exit-intent-popup',
      metadata: {
        surface: 'exit_intent_popup',
        trigger: 'exit_intent',
      },
      navigateTo: '/#contact',
    }).catch((error) => {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[ExitIntentPopup] Failed to record CTA', error);
      }
    });

    handleClose();
  }, [handleClose]);

  return (
    <PopupOverlay show={showPopup} onClick={handleClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <h2>🎵 Special Offer!</h2>
        <p>Don't miss out on your perfect DJ experience!</p>
        <h3>Get 15% OFF your first booking</h3>
        <p>Use code: FIRSTMIX</p>
        <button onClick={handleBookNow}>
          Book Now
        </button>
      </PopupContent>
    </PopupOverlay>
  )
}

const HelperText = styled.p`
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.85rem;
`

export default ExitIntentPopup
