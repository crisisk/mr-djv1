import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import WhatsAppIcon from '../../icons/WhatsAppIcon'
import {
  CONTACT_PHONE_NUMBER,
  CONTACT_PHONE_NUMBER_WHATSAPP,
  CONTACT_WHATSAPP_MESSAGE,
  HAS_WHATSAPP_NUMBER
} from '../../config/contact'

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #25d366;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
  text-decoration: none;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  z-index: 900;

  &:hover {
    transform: scale(1.05);
    background-color: #128c7e;
  }

  &:focus-visible {
    outline: 3px solid #0b0d17;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    bottom: 16px;
    right: 16px;
  }
`

const CTA_ORIGIN = 'floating-action'

const sanitiseNumber = (value: string | number | null | undefined): string | null => {
  if (!value) {
    return null
  }

  const digits = String(value).replace(/[^0-9]/g, '')
  return digits.length > 0 ? digits : null
}

const resolveMessage = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }

  return 'Hi! Ik wil een DJ boeken.'
}

const WhatsAppChat = () => {
  const phoneNumber = sanitiseNumber(CONTACT_PHONE_NUMBER_WHATSAPP)
  const message = resolveMessage(CONTACT_WHATSAPP_MESSAGE)

  const whatsappUrl = useMemo(() => {
    if (!HAS_WHATSAPP_NUMBER || !phoneNumber) {
      return null
    }

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }, [message, phoneNumber])

  const handleClick = useCallback(async () => {
    try {
      const module = await import('../../lib/analytics/events')
      module.trackContactChannelClick({
        channel: 'whatsapp',
        origin: CTA_ORIGIN,
        phoneNumber: CONTACT_PHONE_NUMBER,
      })
    } catch (error) {
      if (import.meta.env?.MODE !== 'production') {
        console.warn('[WhatsAppChat] Failed to track contact channel click', error)
      }
    }
  }, [])

  if (!HAS_WHATSAPP_NUMBER || !whatsappUrl) {
    return null
  }

  return (
    <WhatsAppButton
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat met Mister DJ via WhatsApp"
      onClick={handleClick}
    >
      <WhatsAppIcon aria-hidden focusable={false} />
    </WhatsAppButton>
  )
}

export default WhatsAppChat
