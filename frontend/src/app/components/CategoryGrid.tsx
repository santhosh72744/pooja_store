'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) setCategories(data);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading && categories.length === 0) {
    return <div className="h-96 w-full flex items-center justify-center text-slate-500 font-serif italic">Loading Collections...</div>;
  }

  return (
    <section className="relative w-full bg-[#FDFCFB] py-24 lg:py-32">
      <div className="relative max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-orange-800 mb-4 block">
            Sacred Collections
          </span>
          <h2 className="text-5xl md:text-6xl font-serif text-slate-900">
            Curated for your <span className="italic font-light">Daily Rituals</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative flex flex-col items-center justify-center text-center p-12 min-h-[400px] 
                         bg-white border border-stone-100 rounded-[1.5rem] 
                         /* THE BLOCK SHADOW: Multi-layered for depth */
                         shadow-[0_10px_20px_rgba(0,0,0,0.02),0_30px_60px_rgba(0,0,0,0.05)]
                         transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_90px_rgba(0,0,0,0.1)]"
            >
           
              <span className="absolute top-12 text-8xl font-serif italic text-stone-50 group-hover:text-orange-50/50 transition-colors pointer-events-none">
                0{idx + 1}
              </span>

              <div className="relative z-10 flex flex-col items-center w-full">
              
                <h3 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-orange-900 
                               transition-colors duration-300 mb-6 leading-tight">
                  {cat.name}
                </h3>
                
                
                <p className="text-[16px] text-slate-500 font-medium leading-relaxed max-w-[260px]">
                  {cat.description}
                </p>

                <div className="mt-12 flex flex-col items-center gap-4">
                  
                  <div className="w-10 h-[2px] bg-orange-200 group-hover:w-20 group-hover:bg-orange-600 transition-all duration-500" />
                  
                 
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-slate-900 transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>

              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}