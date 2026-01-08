'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/order-success`,
      },
    });

    if (error) {
      setError(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-6 text-[11px] font-bold uppercase tracking-[0.4em] rounded-tl-[2rem] rounded-br-[2rem] transition-all
          ${
            loading
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-[#0f172a] text-white hover:bg-[#c2410c] hover:shadow-xl'
          }`}
      >
        {loading ? 'Processing Payment...' : 'Pay Securely'}
      </button>
    </form>
  );
}
