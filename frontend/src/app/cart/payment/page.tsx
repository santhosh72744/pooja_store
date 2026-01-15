import { Suspense } from 'react';
import CartPaymentClient from './CartPaymentClient';

export default function CartPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F4F1EE]">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-[#c2410c] rounded-full animate-spin" />
        </div>
      }
    >
      <CartPaymentClient />
    </Suspense>
  );
}
