// src/components/App.jsx
import React from 'react';
import Header from '../../Molecules/Header.jsx';
import Footer from '../../Organisms/Footer.jsx';
import StickyBookingCTA from '../../StickyBookingCTA.jsx';
import WhatsAppChat from '../../WhatsAppChat.jsx';
import BookingNotification from './BookingNotification.jsx';

/**
 * High-level application shell that wires the generated marketing components
 * together. The shell adds the global header/footer as well as engagement
 * utilities such as the sticky booking button, WhatsApp chat widget and
 * real-time booking notifications.
 */
const GeneratedAppShell = ({
  children,
  headerTransparent = false,
  mainClassName = 'flex-1',
  showStickyCta = true,
  showWhatsAppChat = true,
  showBookingNotification = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header transparent={headerTransparent} />
      <main className={mainClassName}>{children}</main>
      <Footer />
      {showStickyCta && <StickyBookingCTA />}
      {showWhatsAppChat && <WhatsAppChat />}
      {showBookingNotification && <BookingNotification />}
    </div>
  );
};

export default GeneratedAppShell;
