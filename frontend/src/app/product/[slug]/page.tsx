'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useCartContext } from '@/app/context/CartContext';
import Breadcrumb from '@/app/components/Breadcrumb';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency?: string;
  category: string;
  thumbnail?: string | null;
  images?: string[];
  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;
  stock?: number;
  
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage(props: PageProps) {
  const { slug } = (React as any).use(props.params) as { slug: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const { addItem, loading } = useCartContext();

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(slug)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        setProduct(null);
        return;
      }
      const data: Product = await res.json();
      setProduct(data);

      const thumb = data.thumbnail
        ? `${process.env.NEXT_PUBLIC_API_URL}${data.thumbnail}`
        : null;
      const extras =
        data.images?.map(
          (img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`,
        ) ?? [];
      const all = [
        ...(thumb ? [thumb] : []),
        ...extras.filter((url) => url !== thumb),
      ];

      setActiveImage(all[0] ?? null);
      setActiveIndex(0);
    }
    load();
  }, [slug]);

  if (!product || !activeImage)
    return (
      <div className="h-screen flex items-center justify-center font-light tracking-widest uppercase italic text-stone-400">
        Restoring the sanctuary...
      </div>
    );

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: product.category, url: `/category/${product.category}` },
    { label: product.name, url: null },
  ];

  const currencySymbol = product.currency === 'USD' ? '$' : '₹';

  const bottomImages = [
    ...(product.thumbnail
      ? [`${process.env.NEXT_PUBLIC_API_URL}${product.thumbnail}`]
      : []),
    ...(product.images?.map(
      (img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`,
    ) || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const itemizedList = product.includedItems
    ? product.includedItems
        .split(/[,;]|\d+\s/)
        .filter((item) => item.trim().length > 2)
    : [];

  const handleBuyNow = () => {
  const token = localStorage.getItem('token');

 
  if (!token) {
    router.push(`/login?redirect=/checkout?product=${product?.id}`);
    return;
  }

  
  router.push(`/checkout?product=${product?.id}`);
};

  return (
    <main className="min-h-screen bg-[#FDFDFB] text-[#121212]">
  <Breadcrumb items={breadcrumbs} />

  <div className="mx-auto max-w-[1500px] px-8 pt-32 pb-24">

        <div className="grid lg:grid-cols-[1fr_450px] gap-16">
         
          <div className="space-y-8">
            <div
              className="relative aspect-square w-full bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-stone-100 group cursor-zoom-in"
              onMouseEnter={() => setIsHoveringMain(true)}
              onMouseLeave={() => setIsHoveringMain(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onClick={() => setIsOpen(true)}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />

              {isHoveringMain && (
                <div className="absolute inset-0 z-50 bg-white border-4 border-white pointer-events-none">
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundSize: '350%',
                      backgroundPosition: `${cursorPos.x}% ${cursorPos.y}%`,
                    }}
                  />
                </div>
              )}
            </div>

         
            <div className="flex gap-4">
              {bottomImages.map((url, i) => (
                <button
                  key={url}
                  onClick={() => {
                    setActiveImage(url);
                    setActiveIndex(i);
                  }}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeIndex === i
                      ? 'border-amber-500 scale-105 shadow-md'
                      : 'border-transparent opacity-40'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

      
          <div className="flex flex-col">
            <div className="sticky top-32 space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">
                  {product.category}
                </span>
                <h1 className="text-5xl font-serif leading-tight">
                  {product.name}
                </h1>
                <p className="text-stone-500 text-lg leading-relaxed font-light italic">
                  {product.shortDescription}
                </p>
              </div>

              <div className="text-5xl font-light tracking-tighter">
                {currencySymbol}
                {product.price.toFixed(2)}
              </div>

             
              <div className="space-y-4">
               <button
  onClick={() => {
    router.push(`/checkout?product=${product.slug}`);
  }}
  className="group relative w-full bg-[#121212] py-6 rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
>
  <div className="absolute inset-0 bg-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
  <span className="relative text-white text-xs font-black uppercase tracking-[0.3em]">
    Buy Now
  </span>
</button>


                <button
                  onClick={() => addItem(product.id, 1, product.price)}
                  disabled={loading}
                  className="group relative w-full border-2 border-[#121212] py-6 rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-[#121212] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative text-[#121212] group-hover:text-white text-xs font-black uppercase tracking-[0.3em]">
                    {loading ? 'Adding...' : 'Add to Collection'}
                  </span>
                </button>
              </div>

             
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Finish', value: product.finish },
                  {
                    label: 'Diameter',
                    value: product.diameterInches
                      ? `${product.diameterInches}"`
                      : null,
                  },
                  {
                    label: 'Height',
                    value: product.heightInches
                      ? `${product.heightInches}"`
                      : null,
                  },
                  {
                    label: 'Weight',
                    value: product.weightLbs
                      ? `${product.weightLbs} lbs`
                      : null,
                  },
                  {
                    label: 'Stock',
                    value: product.stock
                      ? `${product.stock} items`
                      : 'Available',
                  },
                ].map(
                  (spec, idx) =>
                    spec.value && (
                      <div
                        key={idx}
                        className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-50 text-center"
                      >
                        <p className="text-[9px] uppercase tracking-widest font-black text-stone-400 mb-1">
                          {spec.label}
                        </p>
                        <p className="text-sm font-semibold text-stone-800">
                          {spec.value}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-24 grid lg:grid-cols-12 gap-16 border-t border-stone-100 pt-20">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-stone-400">
              The Narrative
            </h2>
            <p className="text-xl leading-relaxed font-light text-stone-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-stone-400 text-center lg:text-left">
              In the Sanctuary Box
            </h2>
            <div className="flex flex-wrap gap-3">
              {itemizedList.length > 0 ? (
                itemizedList.map((item, i) => (
                  <div
                    key={i}
                    className="bg-stone-100/50 px-6 py-3 rounded-full border border-stone-200 text-xs font-bold text-stone-600 tracking-wide hover:bg-white hover:shadow-md transition-all cursor-default"
                  >
                    {item.trim()}
                  </div>
                ))
              ) : (
                <p className="text-stone-400 italic text-sm">
                  Every essential piece included.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
