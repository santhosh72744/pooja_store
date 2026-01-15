'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../../checkout/StripPaymentForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function CartPaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const createIntent = async () => {
      try {
        const res = await fetch(`${API_URL}/payments/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch {
        alert('Unable to initialize payment');
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [orderId, router]);

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EE]">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-[#c2410c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EE] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-stone-200">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm />
        </Elements>
      </div>
    </main>
  );
}
