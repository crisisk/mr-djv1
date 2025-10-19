// src/controllers/notificationController.ts

import { Request, Response } from 'express';
import { twilioService } from '../services/sms/twilioService';

export class NotificationController {
  /**
   * Sends event notification to DJ
   */
  async sendEventNotification(req: Request, res: Response) {
    const { phoneNumber, eventDetails } = req.body;

    try {
      const result = await twilioService.sendSMS({
        to: phoneNumber,
        message: `New event booking: ${eventDetails.name} on ${eventDetails.date}. Please confirm your availability.`,
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          messageId: result.messageId,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to send notification',
      });
    }
  }
}
