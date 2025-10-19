// src/controllers/whatsapp.controller.ts

import { Request, Response } from 'express';
import { WhatsAppService } from '../services/whatsapp.service';
import { validatePhoneNumber } from '../utils/validators';

export class WhatsAppController {
  private whatsappService: WhatsAppService;

  constructor() {
    this.whatsappService = new WhatsAppService();
  }

  /**
   * Send booking confirmation via WhatsApp
   */
  async sendBookingConfirmation = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, bookingDetails } = req.body;

      if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number' });
      }

      const components = [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: bookingDetails.eventDate
            },
            {
              type: 'text',
              text: bookingDetails.location
            }
          ]
        }
      ];

      await this.whatsappService.sendTemplate(
        phoneNumber,
        'booking_confirmation',
        'en',
        components
      );

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send booking confirmation' });
    }
  };

  /**
   * Send custom message to client
   */
  async sendCustomMessage = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, message } = req.body;

      if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number' });
      }

      await this.whatsappService.sendText(phoneNumber, message);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
}
