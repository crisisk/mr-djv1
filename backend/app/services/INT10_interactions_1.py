// services/MollieService.ts
import { createMollieClient, PaymentStatus } from '@mollie/api-client';
import { PaymentRequest, PaymentResponse } from '../types';

export class MollieService {
  private client;

  constructor(apiKey: string) {
    this.client = createMollieClient({ apiKey });
  }

  /**
   * Create a new payment
   * @param paymentRequest Payment details
   * @returns Payment response with checkout URL
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payment = await this.client.payments.create({
        amount: paymentRequest.amount,
        description: paymentRequest.description,
        redirectUrl: paymentRequest.redirectUrl,
        webhookUrl: paymentRequest.webhookUrl,
        metadata: paymentRequest.metadata,
      });

      return {
        id: payment.id,
        status: payment.status,
        checkoutUrl: payment._links.checkout.href,
      };
    } catch (error) {
      console.error('Error creating Mollie payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  /**
   * Verify payment status
   * @param paymentId Payment ID to verify
   * @returns Payment status details
   */
  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    try {
      const payment = await this.client.payments.get(paymentId);
      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        metadata: payment.metadata,
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Failed to verify payment');
    }
  }
}
