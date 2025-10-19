// src/services/sms/twilioService.ts

import twilio, { Twilio } from 'twilio';
import { config } from '../../config';

interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

class TwilioService {
  private client: Twilio;
  private defaultFrom: string;

  constructor() {
    // Initialize Twilio client with credentials from config
    this.client = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );
    this.defaultFrom = config.twilio.phoneNumber;
  }

  /**
   * Sends an SMS message using Twilio
   * @param options SMS options including recipient, message and optional sender
   * @returns Promise with message details or error
   */
  async sendSMS(options: SMSOptions): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const message = await this.client.messages.create({
        body: options.message,
        to: this.formatPhoneNumber(options.to),
        from: options.from || this.defaultFrom,
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * Formats phone number to E.164 format
   * @param phoneNumber Phone number to format
   * @returns Formatted phone number
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (!cleaned.startsWith('1')) {
      return `+1${cleaned}`;
    }
    return `+${cleaned}`;
  }

  /**
   * Extracts readable error message from Twilio error
   * @param error Error object
   * @returns Formatted error message
   */
  private getErrorMessage(error: any): string {
    if (error.code) {
      switch (error.code) {
        case 21211:
          return 'Invalid phone number';
        case 21610:
          return 'Message cannot be empty';
        case 21614:
          return 'Invalid sender phone number';
        default:
          return error.message || 'Unknown error occurred';
      }
    }
    return 'Failed to send SMS';
  }
}

export const twilioService = new TwilioService();
