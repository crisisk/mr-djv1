// src/services/email.service.ts
import transporter from '../config/email.config';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export class EmailService {
  /**
   * Sends an email using the specified template
   * @param options EmailOptions containing recipient, subject, template, and context
   * @returns Promise<boolean> indicating success/failure
   */
  public static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Mr. DJ <noreply@mrdj.com>',
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  /**
   * Sends a booking confirmation email
   * @param email Recipient email
   * @param bookingDetails Booking details for the email
   */
  public static async sendBookingConfirmation(email: string, bookingDetails: any): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Booking Confirmation - Mr. DJ',
      template: 'booking-confirmation',
      context: {
        ...bookingDetails,
        year: new Date().getFullYear()
      }
    });
  }

  /**
   * Sends a welcome email to new users
   * @param email Recipient email
   * @param username Username of the new user
   */
  public static async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Mr. DJ!',
      template: 'welcome',
      context: {
        username,
        year: new Date().getFullYear()
      }
    });
  }
}
