'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { useCartContext } from '../context/CartContext';

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCartLocal, resetCartToken } = useCartContext();
  const method = params.get('method'); 
  const isZelle = method === 'zelle';

  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    setPaymentIntent(params.get('payment_intent'));
    setMounted(true);
  }, [params]);

 useEffect(() => {
  const clearCartAfterOrder = async () => {
    if (clearedRef.current) return;
    clearedRef.current = true;

    const cartToken = localStorage.getItem('cartToken');
    if (!cartToken) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/clear?cartToken=${cartToken}`,
        { method: 'DELETE' }
      );

      clearCartLocal();
      resetCartToken();
    } catch (err) {
      console.error('Failed to clear cart after order', err);
    }
  };

  if (params.get('payment_intent') && !isZelle) {
  clearCartAfterOrder();
}

}, [params, clearCartLocal, resetCartToken]);


  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F1EE] px-4 py-20 selection:bg-orange-100">
      <div className="relative w-full max-w-xl">
        
        <div className="absolute inset-0 bg-[#c2410c]/5 blur-3xl rounded-full -z-10 transform scale-75" />

        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-stone-100 animate-in fade-in zoom-in duration-700">
          
          <div className="relative mx-auto w-24 h-24 mb-10">
            <div className="absolute inset-0 bg-[#c2410c]/10 rounded-full animate-ping duration-[3s]" />
            <div className="relative flex items-center justify-center w-24 h-24 bg-[#c2410c] rounded-full shadow-2xl shadow-orange-200">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c2410c] mb-4">
  {isZelle ? 'Payment Pending' : 'Blessings Confirmed'}
</p>

<h1 className="text-4xl md:text-5xl font-serif text-[#0f172a] mb-6 leading-tight">
  {isZelle ? 'Awaiting Zelle Payment' : 'Order Received'}
</h1>


          <div className="w-12 h-px bg-stone-200 mx-auto mb-8" />

          <p className="text-stone-600 font-serif italic text-lg mb-10 leading-relaxed max-w-sm mx-auto">
  {isZelle
    ? 'Please complete your payment via Zelle. Your order will be confirmed after verification.'
    : 'Your sacred items have been reserved and are being prepared with care and devotion.'}
</p>

  {isZelle && (
  <p className="text-sm text-stone-500 mb-8">
    Send payment via Zelle to <b>parcelmybox3@gmail.com</b><br />
    Use your Order ID as the payment note.
  </p>
)}


          <div className="bg-stone-50 rounded-2xl p-6 mb-10 text-left border border-stone-100">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">
              What happens next:
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-slate-700">
                <span className="text-[#c2410c] font-bold">01.</span>
                Confirmation email sent.
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <span className="text-[#c2410c] font-bold">02.</span>
                Items hand-packaged.
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <span className="text-[#c2410c] font-bold">03.</span>
                Tracking via SMS.
              </li>
            </ul>
          </div>

          {paymentIntent && (
            <div className="mb-10">
              <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest block mb-1">
                Payment Reference
              </span>
              <code className="text-[10px] bg-stone-100 px-3 py-1 rounded-full text-stone-500 font-mono">
                {paymentIntent.slice(0, 15)}...
              </code>
            </div>
          )}

          <button
            onClick={() => router.push('/')}
            className="group relative w-full overflow-hidden"
          >
            <div className="relative z-10 w-full py-6 bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-tl-[2rem] rounded-br-[2rem] transition-all duration-500 group-hover:bg-[#c2410c] flex items-center justify-center gap-3">
              Continue Shopping
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-tl-[2rem] rounded-br-[2rem] -z-10" />
          </button>

          <p className="mt-12 text-[9px] text-stone-400 uppercase tracking-widest font-bold">
            Sri Lakshmi Durga Pooja Store & Sanctuary
          </p>
        </div>
      </div>
    </main>
  );
}
