'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../PaymentForm';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

type Product = {
  category: any;
  id: string;
  slug: string;
  name: string;
  price: number;
  thumbnail?: string | null;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const rawSlug = searchParams.get('product');
  const slug = rawSlug ? decodeURIComponent(rawSlug) : null;

 const [step, setStep] = useState<
  'review' | 'address' | 'payment' | 'confirmation'
>('review');

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  const isAddressValid =
    address.firstName &&
    address.lastName &&
    address.email &&
    address.phone &&
    address.street &&
    address.city &&
    address.state &&
    address.zip;

  useEffect(() => {
    setMounted(true);
    if (!slug) return;

    const encodedSlug = encodeURIComponent(slug);

    async function loadProduct() {
      const res = await fetch(
        `${API_URL}/products/${encodedSlug}`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;
      const data = await res.json();
      setProduct(data);
    }
    loadProduct();
  }, [slug]);

  if (!mounted || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EE]">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-[#c2410c] rounded-full animate-spin" />
      </div>
    );
  }
  const productData: Product = product;
  const checkoutSteps = [
  'review',
  'address',
  'payment',
  'confirmation',
] as const;

const stepLabelMap = {
  review: 'Checkout',
  address: 'Address',
  payment: 'Payment',
  confirmation: 'Confirmation',
};

const currentStepIndex = checkoutSteps.indexOf(step);

const checkoutBreadcrumbItems = checkoutSteps
  .slice(0, currentStepIndex + 1)
  .map((s, index) => ({
    label: stepLabelMap[s],
    url: index < currentStepIndex ? 'step' : null,
    step: s,
  }));

const breadcrumbItems = [
  { label: 'Home', url: '/' },

  {
    label: productData.category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    url: `/category/${productData.category}`,
  },

  {
    label: productData.name,
    url: `/product/${encodeURIComponent(slug!)}`,
  },

  ...checkoutBreadcrumbItems,
];



  const imageUrl = product.thumbnail
    ? `${API_URL}${product.thumbnail}`
    : '/no-image.png';

  const total = product.price * qty;

  const inputClass =
    'w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-[#c2410c] focus:ring-0 outline-none transition-all placeholder:text-stone-400 placeholder:font-normal';

 const createPaymentIntent = async () => {
  if (!user) {
    router.push('/login');
    return;
  }

  setLoading(true);

  const token = localStorage.getItem('token');

  const res = await fetch(
    `${API_URL}/payments/create-intent-buy-now`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.slug,

        quantity: qty,
      }),
    }
  );

  if (!res.ok) {
    setLoading(false);
    return;
  }

  const data = await res.json();
  setClientSecret(data.clientSecret);
  setStep('payment');
  setLoading(false);
};

const createZelleBuyNowOrder = async () => {
  if (!user) {
    router.push('/login');
    return;
  }

  setLoading(true);

  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/orders/zelle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        {
          productId: product.id,
          productName: product.name,
          productImage: product.thumbnail,
          quantity: qty,
          price: product.price,
        },
      ],
      totalAmount: total,
      shippingAddress: address,
    }),
  });

  if (!res.ok) {
    setLoading(false);
    return;
  }

  setLoading(false);
  
  router.push('/order-success?method=zelle');

};

  return (
    <main className="min-h-screen bg-[#F4F1EE] px-4 pt-8 pb-24 text-slate-900 selection:bg-orange-100">
      <Breadcrumb
  items={breadcrumbItems.map(item => ({
    label: item.label,
    url: item.url === 'step' ? null : item.url,
    onClick:
      'step' in item &&
      item.step &&
      checkoutSteps.indexOf(item.step) < currentStepIndex
        ? () => setStep(item.step)
        : undefined,
  }))}
/>
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
          
          <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden">
            
            {step === 'review' && (
              <div className="p-8 md:p-12 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                  <img src={imageUrl} className="h-40 w-40 rounded-3xl object-cover shadow-sm border border-stone-100" />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-serif text-[#0f172a] mb-2">{product.name}</h2>
                    <p className="text-stone-400 font-serif italic mb-6">Temple-Grade Sacred Item</p>
                    
                    <div className="inline-flex items-center bg-stone-50 rounded-xl px-4 py-2 border border-stone-100 font-black">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:text-[#c2410c] text-xl">−</button>
                      <span className="mx-6 text-[#0f172a]">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center hover:text-[#c2410c] text-xl">+</button>
                    </div>
                  </div>
                  <div className="text-3xl font-serif text-[#0f172a] font-bold">${total.toLocaleString('en-IN')}</div>
                </div>

                <button
                  onClick={() => setStep('address')}
                  className="w-full py-6 bg-[#0f172a] text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-tl-[2rem] rounded-br-[2rem] hover:bg-[#c2410c] transition-all duration-500"
                >
                  Proceed to Shipping
                </button>
              </div>
            )}

            {step === 'address' && (
              <div className="p-8 md:p-12 animate-in fade-in duration-500 space-y-6">
                <h3 className="text-xl font-serif text-[#0f172a] mb-6 border-b border-stone-50 pb-4">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input placeholder="First name" className={inputClass} value={address.firstName} onChange={e => setAddress({ ...address, firstName: e.target.value })} />
                  <input placeholder="Last name" className={inputClass} value={address.lastName} onChange={e => setAddress({ ...address, lastName: e.target.value })} />
                  <input placeholder="Email Address" className={inputClass} value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} />
                  <input placeholder="Phone Number" className={inputClass} value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                </div>

                <input placeholder="Street address" className={inputClass} value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />

                <div className="grid grid-cols-2 gap-5">
                  <input placeholder="City" className={inputClass} value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                  <input placeholder="State / Province" className={inputClass} value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <input placeholder="ZIP Code" className={inputClass} value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} />
                  <select
                    className={inputClass}
                    value={address.country}
                    onChange={e => setAddress({ ...address, country: e.target.value })}
                  >
                    <option value="India">United States</option>
                    <option value="United States">India</option>
                  </select>
                </div> 

                <div className="mt-6 space-y-4">
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
    <span className="font-semibold text-slate-800">
      Pay with Card (Stripe)
    </span>
  </label>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="paymentMethod"
      checked={paymentMethod === 'ZELLE'}
      onChange={() => setPaymentMethod('ZELLE')}
    />
    <span className="font-semibold text-slate-800">
      Pay with Zelle
    </span>
  </label>
</div>


                <button
                  disabled={!isAddressValid || loading}
                  onClick={() => {
  if (paymentMethod === 'STRIPE') {
    createPaymentIntent();
  } else {
    createZelleBuyNowOrder();
  }
}}
                  className={`w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] rounded-tl-[2rem] rounded-br-[2rem] transition-all duration-500
                    ${isAddressValid
                      ? 'bg-[#0f172a] text-white hover:bg-[#c2410c] shadow-lg shadow-slate-200'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                >
                  {loading ? 'Consulting the Records...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 'payment' && clientSecret && (
              <div className="p-8 md:p-12 animate-in fade-in duration-500">
                <div className="mb-8 pb-8 border-b border-stone-100 flex justify-between items-center">
                   <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Final Offering</p>
                   <p className="text-2xl font-serif font-bold text-[#c2410c]">${total.toLocaleString('en-IN')}</p>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm />
                </Elements>
              </div>
            )}
    
  



          </div>
        </div>

        <p className="mt-16 text-center text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">
          Sri Lakshmi Durga Pooja Store & Sanctuary
        </p>

      </div>
    </main>
  );
} 