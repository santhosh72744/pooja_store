'use client';

import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, Youtube, ArrowUp, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white border-t border-stone-200">
      
      

      <div className="mx-auto w-full max-w-[1800px] px-8 pt-28 pb-12 lg:px-20">
        <div className="grid grid-cols-1 gap-24 md:grid-cols-12 lg:gap-32">
          
         
          <div className="md:col-span-6 lg:col-span-5 space-y-12">
            <div className="flex flex-col gap-6">
              <div className="h-16 w-16 bg-[#0f172a] flex items-center justify-center rounded-sm shadow-xl">
                <span className="text-white font-serif text-3xl font-bold">L</span>
              </div>
              <div>
                <h3 className="text-3xl font-serif font-black text-slate-950 tracking-tight">
                  Sri Lakshmi Durga
                </h3>
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-700 mt-4">
                  Pooja Store & Sanctuary
                </p>
              </div>
            </div>
            
            <p className="text-[17px] leading-relaxed text-stone-600 max-w-md font-medium italic opacity-90">
              "Bringing the sanctity of traditional Vedic rituals to modern homes across the United States with directly sourced, premium artifacts."
            </p>

            <div className="flex items-center gap-8">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="text-stone-400 hover:text-slate-950 transition-all scale-110">
                  <Icon size={22} strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>

          
          <div className="md:col-span-6 lg:col-span-4 space-y-12">
            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950">Support & Contact</h4>
            <div className="space-y-12">
              <div className="group">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">Call or WhatsApp</p>
                <Link href="tel:+15107146946" className="text-2xl font-serif font-bold text-slate-950 group-hover:text-orange-700 transition-colors">
                  +1 (510) 714-6946
                </Link>
              </div>
              <div className="group">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">Email Inquiry</p>
                <Link href="mailto:parcelmybox3@gmail.com" className="text-xl font-serif italic text-slate-950 group-hover:text-orange-700 transition-colors border-b border-stone-200 pb-1">
                  parcelmybox3@gmail.com
                </Link>
              </div>
            </div>
          </div>

         
          <div className="md:col-span-12 lg:col-span-3">
            <div className="bg-stone-50 p-12 border border-stone-100 shadow-sm">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 mb-10">Sanctuary Standards</h4>
              <div className="space-y-10">
                {[
                  { t: 'Authentic Quality', d: 'Sourced from Vedic artisans.' },
                  { t: 'Express US Shipping', d: 'Fast, secure local delivery.' }
                ].map((p, i) => (
                  <div key={i} className="flex gap-5">
                    <CheckCircle2 size={20} className="text-orange-700 shrink-0 mt-1" strokeWidth={2.5} />
                    <div>
                      <p className="text-[13px] font-black text-slate-950 uppercase tracking-widest">{p.t}</p>
                      <p className="text-xs text-stone-500 mt-2 font-medium italic">{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-32 pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-[11px] text-stone-400 uppercase tracking-[0.4em] font-black">
              © {year} Lakshmi Durga
            </p>
            <div className="flex gap-8 text-[9px] text-stone-400 uppercase tracking-widest font-bold">
               <span>Secure Payments</span>
               <span className="w-1 h-1 bg-stone-300 rounded-full my-auto" />
               <span>Nationwide US Delivery</span>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-950 transition-colors"
          >
            <ArrowUp size={24} strokeWidth={1} className="group-hover:-translate-y-3 transition-transform duration-700" />
            Top
          </button>

          <div className="flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-950">
            <Link href="/privacy" className="hover:text-orange-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-700 transition-colors">Terms</Link>
            <Link href="/shipping" className="hover:text-orange-700 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}