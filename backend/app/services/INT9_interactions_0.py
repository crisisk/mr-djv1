// src/services/whatsapp.service.ts

import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';

interface WhatsAppMessage {
  to: string;
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: any[];
  };
  text?: {
    body: string;
  };
}

export class WhatsAppService {
  private client: AxiosInstance;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('WhatsAppService');
    this.client = axios.create({
      baseURL: 'https://graph.facebook.com/v17.0',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Send a template message via WhatsApp
   * @param phoneNumber - Recipient's phone number with country code
   * @param templateName - Name of the approved template
   * @param languageCode - Language code (e.g., 'en')
   * @param components - Template components/variables
   */
  async sendTemplate(
    phoneNumber: string,
    templateName: string,
    languageCode: string = 'en',
    components?: any[]
  ): Promise<boolean> {
    try {
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components
        }
      };

      const response = await this.client.post(
        `/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        message
      );

      this.logger.info(`Template message sent successfully to ${phoneNumber}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending WhatsApp template message:', error);
      throw new Error('Failed to send WhatsApp template message');
    }
  }

  /**
   * Send a text message via WhatsApp
   * @param phoneNumber - Recipient's phone number with country code
   * @param text - Message text
   */
  async sendText(phoneNumber: string, text: string): Promise<boolean> {
    try {
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        text: {
          body: text
        }
      };

      const response = await this.client.post(
        `/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        message
      );

      this.logger.info(`Text message sent successfully to ${phoneNumber}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending WhatsApp text message:', error);
      throw new Error('Failed to send WhatsApp text message');
    }
  }

  /**
   * Format phone number to WhatsApp API requirements
   * @param phoneNumber - Phone number to format
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure number starts with country code
    if (!cleaned.startsWith('31')) {
      throw new Error('Phone number must start with country code (31 for Netherlands)');
    }

    return cleaned;
  }
}
