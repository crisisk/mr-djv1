// components/Layout.jsx or App.jsx
import React from 'react';
import StickyBookingCTA from './StickyBookingCTA.jsx';
import WhatsAppChat from './WhatsAppChat.jsx';

/**
 * Helper layout wrapper that adds the sticky booking CTA and WhatsApp
 * conversation widget to any page or layout that uses it. The wrapper keeps
 * the behaviour optional so that pages like landing pages or dashboards can
 * decide whether the overlays should be visible.
 */
const LayoutWithLiveSupport = ({
  children,
  showStickyCta = true,
  showWhatsAppChat = true,
}) => (
  <>
    {children}
    {showStickyCta && <StickyBookingCTA />}
    {showWhatsAppChat && <WhatsAppChat />}
  </>
);

export default LayoutWithLiveSupport;
