// types.ts
export interface PaymentRequest {
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  id: string;
  status: string;
  checkoutUrl: string;
}

export interface PaymentStatus {
  id: string;
  status: 'paid' | 'pending' | 'failed' | 'canceled' | 'expired';
  amount: {
    value: string;
    currency: string;
  };
  metadata?: Record<string, any>;
}
