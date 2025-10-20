// In your App.jsx or layout component
import React from 'react';
import BookingNotification from './src/components/BookingNotification.jsx';

/**
 * Wrapper that mounts the realtime booking notification widget on top of the
 * existing page tree. The widget can be toggled so that internal dashboards or
 * admin pages can opt out when needed.
 */
const AppWithBookingNotifications = ({ children, enabled = true }) => (
  <>
    {children}
    {enabled && <BookingNotification />}
  </>
);

export default AppWithBookingNotifications;
