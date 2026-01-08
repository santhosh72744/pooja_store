'use client';

import Image from 'next/image';
import { useCartContext } from '../context/CartContext';

export default function CartPage() {
  const { cart, totalQuantity, totalPrice, loading, reload } = useCartContext();

  if (loading && !cart) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-32 text-center bg-white">
        <p className="text-xl font-bold uppercase tracking-widest text-slate-900 animate-pulse">
          RECALLING YOUR SANCTUARY...
        </p>
      </main>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-32 text-center bg-white">
        <p className="text-xl font-black uppercase tracking-[0.4em] text-stone-300">
          Your collection is empty.
        </p>
      </main>
    );
  }

  const handleIncrease = async (itemId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}/increase`, {
      method: 'PATCH',
    });
    await reload();
  };

  const handleDecrease = async (itemId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}/decrease`, {
      method: 'PATCH',
    });
    await reload();
  };

  return (
    <main className="min-h-screen bg-white selection:bg-orange-100 antialiased">
      <div className="mx-auto max-w-[1440px] px-8 py-16 lg:px-24">
        <header className="mb-12 border-b-2 border-slate-950 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 md:text-6xl">
            Shopping Collection
          </h1>
          <p className="mt-4 text-[12px] font-black uppercase tracking-[0.5em] text-orange-800">
            {totalQuantity} Items Curated
          </p>
        </header>

        <div className="grid gap-20 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          
          <section className="space-y-10">
            {cart.items.map((item: any) => {
              const product = item.product;
              const thumbUrl = product?.thumbnail
                ? `${process.env.NEXT_PUBLIC_API_URL}${product.thumbnail}`
                : null;

              return (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-8 border-b border-stone-100 pb-10 last:border-0"
                >
                  <div className="h-40 w-40 flex-shrink-0 overflow-hidden border border-stone-200 bg-white p-4 shadow-sm">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={product?.name || 'Product image'}
                        width={160}
                        height={160}
                        className="h-full w-full object-contain transition-transform duration-700 hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-stone-300">
                        No Artifact
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950">
                        {product?.name || 'Product'}
                      </h2>
                      <p className="mt-1 text-[11px] font-black uppercase tracking-widest text-emerald-700">
                        Available for Shipment
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-6">
                      <div className="flex items-center border-2 border-slate-950 bg-white">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          className="flex h-10 w-10 items-center justify-center text-lg font-bold transition hover:bg-slate-100 active:bg-stone-200"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-black text-slate-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item.id)}
                          className="flex h-10 w-10 items-center justify-center text-lg font-bold transition hover:bg-slate-100 active:bg-stone-200"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Quantity</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between py-2 text-right">
                    <p className="text-2xl font-black text-slate-950">
                      ₹{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                      ₹{Number(item.unitPrice).toLocaleString()} / Unit
                    </p>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="sticky top-12 h-fit space-y-8 bg-stone-50 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100">
            <div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-stone-400 mb-6">Order Summary</h3>
              <div className="flex justify-between items-end border-b border-stone-200 pb-6 mb-6">
                <span className="text-[13px] font-black uppercase tracking-widest text-slate-600">Subtotal</span>
                <span className="text-2xl font-black text-slate-950">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 leading-relaxed">
                Taxes, insurance, and artisanal shipping fees calculated at final checkout.
              </p>
            </div>

            <button
              type="button"
              className="w-full bg-orange-800 py-6 text-[13px] font-black uppercase tracking-[0.4em] text-white shadow-xl transition hover:bg-orange-900 active:scale-[0.98]"
            >
              Proceed to Buy
            </button>

            <div className="space-y-4 pt-4">
               <div className="flex items-center gap-3">
                  <span className="text-xl">🛡️</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Secure Checkout Guarantee</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Artisan Authenticity</p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}