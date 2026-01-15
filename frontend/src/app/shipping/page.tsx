'use client';

import React from 'react';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-32 pb-24 text-slate-900 selection:bg-orange-100 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2410c]">
              Service & Logistics
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#0f172a] mb-4">
            Shipping Policy
          </h1>
          <p className="text-stone-400 font-serif italic text-lg mb-6">Ensuring your sacred items arrive with care</p>
          <div className="h-px w-16 bg-stone-200 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
            Last updated: January 2026
          </p>
        </div>

        {/* ================= MAIN CONTENT CARD ================= */}
        <div className="relative group">
          {/* Decorative Brand Shadow */}
          <div className="absolute inset-0 bg-stone-200 translate-x-3 translate-y-3 rounded-[3rem] -z-10 transition-transform" />
          
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-stone-200 shadow-sm overflow-hidden relative">
            <div className="relative z-10 space-y-12">
              
              {/* SECTION 1: COVERAGE */}
              <section className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-3">Shipping Coverage</h2>
                  <p className="text-stone-500 leading-relaxed font-medium">
                    Our sanctuary currently extends its reach across the <span className="text-[#0f172a] font-bold">United States</span>. 
                    Every package is handled with the utmost respect to ensure the spiritual integrity of your items remains intact during transit.
                  </p>
                </div>
              </section>

              {/* SECTION 2: TIMES */}
              <div className="grid md:grid-cols-2 gap-12 pt-4">
                <section className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#0f172a] mb-2">Processing Time</h2>
                    <p className="text-stone-500 text-sm leading-relaxed font-medium">
                      Orders are carefully prepared and processed within <span className="text-[#c2410c] font-bold text-base">1–2 business days</span>.
                    </p>
                  </div>
                </section>

                <section className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#0f172a] mb-2">Delivery Time</h2>
                    <p className="text-stone-500 text-sm leading-relaxed font-medium">
                      Standard delivery typically takes <span className="text-[#c2410c] font-bold text-base">3–7 business days</span> depending on your location.
                    </p>
                  </div>
                </section>
              </div>

              {/* SECTION 3: CHARGES */}
              <div className="bg-stone-50/50 rounded-[2rem] p-8 border border-stone-100 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h2 className="text-xl font-serif text-[#0f172a] mb-1">Shipping Charges</h2>
                    <p className="text-stone-400 text-[9px] font-black uppercase tracking-widest">Calculated Live at Checkout</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-stone-500 text-sm italic max-w-xs font-medium">
                      Rates are determined based on weight and destination to provide the most fair and accurate pricing.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SUPPORT */}
              <section className="pt-8 border-t border-stone-100 flex flex-col items-center text-center">
                <h2 className="text-2xl font-serif text-[#0f172a] mb-6">Need Assistance?</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="tel:+15107146946"
                    className="flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-[#c2410c] transition-all shadow-xl shadow-slate-200"
                  >
                    +1 (510) 714-6946
                  </a>
                  <a 
                    href="https://wa.me/15107146946"
                    target="_blank"
                    className="flex items-center gap-3 px-8 py-4 border-2 border-stone-100 text-[#0f172a] font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:border-[#c2410c] hover:text-[#c2410c] transition-all"
                  >
                    WhatsApp Support
                  </a>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <p className="mt-20 text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
          Sri Lakshmi Durga Pooja Store & Sanctuary
        </p>
      </div>
    </main>
  );
}