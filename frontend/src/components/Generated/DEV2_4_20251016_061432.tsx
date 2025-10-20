import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../../api/paymentService';
import './Payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onSuccess, onFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { clientSecret } = await createPaymentIntent(amount);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onFailure(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      onFailure(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-amount">
        Deposit Amount: €{(amount / 100).toFixed(2)}
      </div>
      <CardElement className="card-element" />
      {error && <div className="payment-error">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? 'Processing...' : 'Pay Deposit'}
      </button>
    </form>
  );
};

const StripePayment = ({ amount }) => {
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSuccess = (paymentIntent) => {
    setPaymentStatus('success');
    setStatusMessage(`Payment confirmed. Reference: ${paymentIntent.id}`);
  };

  const handleFailure = (errorMessage) => {
    setPaymentStatus('failed');
    setStatusMessage(errorMessage);
  };

  return (
    <div className="payment-container">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      </Elements>
      {paymentStatus !== 'idle' && (
        <div
          className={`payment-status payment-status--${paymentStatus}`}
          role={paymentStatus === 'failed' ? 'alert' : 'status'}
          aria-live={paymentStatus === 'failed' ? 'assertive' : 'polite'}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default StripePayment;
