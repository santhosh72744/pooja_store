'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PaymentElement />

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="w-full py-6 bg-[#0f172a] text-white rounded-tl-[2.5rem] rounded-br-[2.5rem]
                   hover:bg-[#c2410c] transition-all"
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
    </div>
  );
}
