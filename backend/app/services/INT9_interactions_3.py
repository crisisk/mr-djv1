// Example of sending a booking confirmation
const bookingData = {
  phoneNumber: "31612345678",
  bookingDetails: {
    eventDate: "2024-01-15 20:00",
    location: "Amsterdam Arena"
  }
};

// API call
await fetch('/api/whatsapp/booking-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify(bookingData)
});

// Example of sending a custom message
const messageData = {
  phoneNumber: "31612345678",
  message: "Hi! Your DJ set will start in 1 hour. Please arrive 30 minutes early."
};

await fetch('/api/whatsapp/custom-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify(messageData)
});
