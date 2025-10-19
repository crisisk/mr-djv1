// Example usage in a controller or service
import { EmailService } from '../services/email.service';

// In your booking controller
async function confirmBooking(req, res) {
  try {
    // ... booking logic ...

    // Send confirmation email
    const bookingDetails = {
      name: 'John Doe',
      bookingDate: '2024-01-20',
      bookingTime: '18:00',
      eventType: 'Wedding',
      duration: 4,
      venue: 'Grand Hotel',
      amount: 599
    };

    await EmailService.sendBookingConfirmation(
      'john@example.com',
      bookingDetails
    );

    res.status(200).json({ message: 'Booking confirmed and email sent' });
  } catch (error) {
    console.error('Booking confirmation failed:', error);
    res.status(500).json({ error: 'Booking confirmation failed' });
  }
}

// In your auth controller
async function registerUser(req, res) {
  try {
    // ... user registration logic ...

    // Send welcome email
    await EmailService.sendWelcomeEmail(
      'jane@example.com',
      'Jane'
    );

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}
