// components/PaymentButton.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface PaymentButtonProps {
  amount: number;
  description: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, description }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/payment/create', {
        amount,
        description,
        metadata: {
          orderId: 'ORDER-123',
        },
      });

      // Redirect to Mollie checkout
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};
