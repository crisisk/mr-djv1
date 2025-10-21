// components/WhatsAppChat.jsx
import React from 'react';
import styled from 'styled-components';
import { getWhatsAppConfig, createWhatsAppClickHandler } from '../../../../config/whatsappConfig.js';

import { IconBase, mergeClassNames } from '../shared/IconBase';
import type { IconBaseProps } from '../shared/IconBase';
import type { WhatsAppConfig } from '../../../../config/whatsappConfig';

const FALLBACK_CONTACT_PATH = '/contact';
const logger = console;

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

const WhatsAppIcon = ({ className, ...props }: IconBaseProps) => (
  <IconBase
    className={mergeClassNames('h-8 w-8 text-neutral-light md:h-10 md:w-10', className)}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
  </IconBase>
);

const trackWhatsAppInteraction = async (config: WhatsAppConfig) => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    event: 'conversion',
    conversion_type: 'whatsapp_click',
    channel: 'whatsapp',
    timestamp: new Date().toISOString(),
    phone_mask: config.phoneNumber.slice(-4),
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: 'whatsapp_chat',
    });
  }
};

const WhatsAppChat = () => {
  const config = getWhatsAppConfig({ logger });

  const handleClick = createWhatsAppClickHandler({
    config,
    fallbackUrl: FALLBACK_CONTACT_PATH,
    track: trackWhatsAppInteraction,
    logger,
    openWindow: true,
  });

  const href = config.isValid && config.whatsappUrl ? config.whatsappUrl : FALLBACK_CONTACT_PATH;
  const target = config.isValid ? '_blank' : undefined;
  const rel = config.isValid ? 'noopener noreferrer' : undefined;

  return (
    <WhatsAppButton
      href={href}
      target={target}
      rel={rel}
      aria-label={config.isValid ? 'Chat with us on WhatsApp' : 'Open contact form'}
      onClick={(event) => {
        void handleClick(event);
      }}
    >
      <WhatsAppIcon aria-hidden />
    </WhatsAppButton>
  );
};

export default WhatsAppChat;
