// src/services/emailScheduler.js
import cron from 'node-cron';
import { getUpcomingBookings } from './bookingService';
import { sendReminderEmail } from './emailService';

// Run daily at 9am
export function startEmailScheduler() {
  cron.schedule('0 9 * * *', async () => {
    try {
      const upcomingBookings = await getUpcomingBookings();
      
      // Send reminders 7 days and 1 day before event
      upcomingBookings.forEach(booking => {
        const daysUntilEvent = calculateDaysUntil(booking.eventDate);
        
        if (daysUntilEvent === 7 || daysUntilEvent === 1) {
          sendReminderEmail(booking);
        }
      });
    } catch (error) {
      console.error('Error in email scheduler:', error);
    }
  });
}

function calculateDaysUntil(eventDate) {
  const today = new Date();
  const event = new Date(eventDate);
  return Math.floor((event - today) / (1000 * 60 * 60 * 24));
}