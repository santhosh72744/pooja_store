'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartCheckoutPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const [loading, setLoading] = useState(false);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] =
  useState<'STRIPE' | 'ZELLE'>('STRIPE');

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

 
  useEffect(() => {
    const token = localStorage.getItem('cartToken');
    if (!token) {
      router.push('/cart');
      return;
    }
    setCartToken(token);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async () => {
  const token = cartToken ?? localStorage.getItem('cartToken');
  if (!token) {
    alert('Cart not ready. Please try again.');
    return;
  }

  const authToken = localStorage.getItem('token');
  if (!authToken) {
    router.push('/login');
    return;
  }

  setLoading(true);

  try {
    
    if (paymentMethod === 'STRIPE') {
      const res = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartToken: token,
          address,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const order = await res.json();
      router.push(`/cart/payment?orderId=${order.id}`);
      return;
    }

    
    await fetch(`${API_URL}/orders/zelle`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartToken: token,
        shippingAddress: address,
        // backend will resolve cart items + total from cartToken
      }),
    });

    router.push('/order-success?method=zelle');

  } catch {
    alert('Unable to proceed');
  } finally {
    setLoading(false);
  }
};



  return (
    <main className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-10 border border-stone-200">
        <h1 className="text-2xl font-serif mb-8">Shipping Details</h1>

        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First name" onChange={handleChange} className="input" />
          <input name="lastName" placeholder="Last name" onChange={handleChange} className="input" />
          <input name="email" placeholder="Email address" onChange={handleChange} className="input col-span-2" />
          <input name="phone" placeholder="Phone number" onChange={handleChange} className="input col-span-2" />
          <input name="street" placeholder="Street address" onChange={handleChange} className="input col-span-2" />
          <input name="city" placeholder="City" onChange={handleChange} className="input" />
          <input name="state" placeholder="State / Province" onChange={handleChange} className="input" />
          <input name="zip" placeholder="ZIP Code" onChange={handleChange} className="input" />
          <select name="country" onChange={handleChange} className="input">
            <option>USA</option>
          </select>
        </div>

        <div className="mt-8 space-y-4">
  <p className="text-sm font-black uppercase tracking-widest text-stone-500">
    Payment Method
  </p>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="paymentMethod"
      checked={paymentMethod === 'STRIPE'}
      onChange={() => setPaymentMethod('STRIPE')}
    />
    Pay with Card (Stripe)
  </label>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="paymentMethod"
      checked={paymentMethod === 'ZELLE'}
      onChange={() => setPaymentMethod('ZELLE')}
    />
    Pay with Zelle
  </label>
</div>


        <button
          onClick={handleSubmit}
          disabled={loading || !cartToken}
          className="mt-8 w-full bg-stone-900 text-white py-4 rounded-xl font-black uppercase tracking-widest"
        >
          {loading ? 'Processing…' : 'Continue to Payment'}
        </button>
      </div>

      <style jsx>{`
        .input {
          border: 1px solid #e5e5e5;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
