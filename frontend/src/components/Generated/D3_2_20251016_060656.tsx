// components/WhatsAppChat.jsx
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { WhatsAppIcon } from '../../icons'
import { CONTACT_PHONE_NUMBER, CONTACT_PHONE_NUMBER_WHATSAPP, CONTACT_WHATSAPP_MESSAGE, HAS_WHATSAPP_NUMBER } from '../../config/contact'
import { trackContactChannelClick } from '../../lib/analytics/events'

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background-color: #128C7E;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }
`;

const WhatsAppChat = () => {
  const message = encodeURIComponent(CONTACT_WHATSAPP_MESSAGE)
  const phoneNumber = CONTACT_PHONE_NUMBER_WHATSAPP

  const handleClick = useCallback(() => {
    trackContactChannelClick({
      channel: 'whatsapp',
      origin: 'floating-action',
      phoneNumber: CONTACT_PHONE_NUMBER,
    })
  }, [])

  if (!HAS_WHATSAPP_NUMBER) {
    return null
  }

  return (
    <WhatsAppButton
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat met Mister DJ via WhatsApp"
      onClick={handleClick}
    >
      <WhatsAppIcon aria-hidden className="h-8 w-8 text-neutral-light md:h-10 md:w-10" />
    </WhatsAppButton>
  )
}

export default WhatsAppChat
