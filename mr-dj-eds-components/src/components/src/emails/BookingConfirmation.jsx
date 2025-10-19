// src/emails/BookingConfirmation.jsx
export default function BookingConfirmation({ booking }) {
  return (
    <div className="email-container">
      <h1>Your DJ Booking is Confirmed!</h1>
      <p>Hello {booking.customerName},</p>
      <p>Your booking for {booking.eventDate} has been confirmed.</p>
      <div className="booking-details">
        <h3>Booking Details:</h3>
        <p>Event: {booking.eventType}</p>
        <p>Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
        <p>Time: {booking.eventTime}</p>
        <p>Location: {booking.eventLocation}</p>
      </div>
      <p>We'll send you a reminder as your event approaches.</p>
    </div>
  );
}