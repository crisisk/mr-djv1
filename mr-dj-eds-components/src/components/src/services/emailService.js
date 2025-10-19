// src/services/emailService.js
import nodemailer from 'nodemailer';
import BookingConfirmation from '../emails/BookingConfirmation';
import BookingReminder from '../emails/BookingReminder';
import { renderToStaticMarkup } from 'react-dom/server';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(booking) {
  try {
    const emailHtml = renderToStaticMarkup(<BookingConfirmation booking={booking} />);
    
    await transporter.sendMail({
      from: `"Mr. DJ" <${process.env.EMAIL_FROM}>`,
      to: booking.customerEmail,
      subject: `Booking Confirmation for ${booking.eventDate}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

export async function sendReminderEmail(booking) {
  try {
    const emailHtml = renderToStaticMarkup(<BookingReminder booking={booking} />);
    
    await transporter.sendMail({
      from: `"Mr. DJ" <${process.env.EMAIL_FROM}>`,
      to: booking.customerEmail,
      subject: `Reminder: Your DJ Booking for ${booking.eventDate}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
}