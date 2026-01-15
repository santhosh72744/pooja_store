'use client';

import { useEffect, useState } from 'react';
import PaymentForm from '@/app/PaymentForm';
import api from '@/lib/api';
import StripePaymentForm from '../../checkout/StripPaymentForm';

export default function CartCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const initCheckout = async () => {
      // 1. Create cart order
      const orderRes = await api.post('/orders/cart');
      setOrderId(orderRes.data.id);

      // 2. Create payment intent
      const paymentRes = await api.post('/payments/create-intent', {
        orderId: orderRes.data.id,
      });

      setClientSecret(paymentRes.data.clientSecret);
    };

    initCheckout();
  }, []);

  if (!clientSecret || !orderId) return <p>Loading checkout…</p>;

  return (
    <StripePaymentForm />

  );
}
