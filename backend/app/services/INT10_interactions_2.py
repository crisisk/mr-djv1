// controllers/PaymentController.ts
import { Request, Response } from 'express';
import { MollieService } from '../services/MollieService';
import { config } from '../config';

export class PaymentController {
  private mollieService: MollieService;

  constructor() {
    this.mollieService = new MollieService(config.MOLLIE_API_KEY);
  }

  /**
   * Initiate payment
   */
  async initiatePayment = async (req: Request, res: Response) => {
    try {
      const { amount, description, metadata } = req.body;

      const paymentRequest = {
        amount: {
          currency: 'EUR',
          value: amount.toFixed(2),
        },
        description,
        redirectUrl: `${config.BASE_URL}/payment/return`,
        webhookUrl: `${config.BASE_URL}/payment/webhook`,
        metadata,
      };

      const payment = await this.mollieService.createPayment(paymentRequest);
      res.json({ checkoutUrl: payment.checkoutUrl, paymentId: payment.id });
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  };

  /**
   * Handle webhook notifications
   */
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const payment = await this.mollieService.verifyPayment(id);

      // Handle payment status
      if (payment.status === 'paid') {
        // Process successful payment
        // Update order status, send confirmation email, etc.
      }

      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  };

  /**
   * Handle payment return
   */
  handleReturn = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      const payment = await this.mollieService.verifyPayment(id as string);

      if (payment.status === 'paid') {
        res.redirect('/payment/success');
      } else {
        res.redirect('/payment/failure');
      }
    } catch (error) {
      console.error('Payment return error:', error);
      res.redirect('/payment/error');
    }
  };
}
