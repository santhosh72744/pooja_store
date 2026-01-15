'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-32 pb-24 text-slate-900 selection:bg-orange-100 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2410c]">
              Legal Framework
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#0f172a] mb-4">
            Terms & Conditions
          </h1>
          <p className="text-stone-400 font-serif italic text-lg mb-6">The governing principles of our sanctuary</p>
          <div className="h-px w-16 bg-stone-200 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
            Last updated: January 2026
          </p>
        </div>

        {/* ================= MAIN CONTENT CARD ================= */}
        <div className="relative group">
          {/* Decorative Brand Shadow */}
          <div className="absolute inset-0 bg-stone-200 translate-x-3 translate-y-3 rounded-[3rem] -z-10" />
          
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-stone-200 shadow-sm relative overflow-hidden">
            
            <p className="text-stone-500 mb-12 leading-relaxed font-medium italic border-l-4 border-orange-100 pl-6">
              By accessing and using this website, you agree to the following terms and conditions. 
              These guidelines ensure a respectful and secure environment for all seekers within our community.
            </p>

            <div className="space-y-16">
              
              {/* SECTION 1: PRODUCTS */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-4">Products & Orders</h2>
                  <ul className="space-y-4">
                    {[
                      "All products are authentic pooja and Vedic items curated for spiritual use.",
                      "Orders are subject to availability and seasonal stock cycles.",
                      "Prices are subject to change without prior notice as per market fluctuations."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-stone-500 font-medium leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-200 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* SECTION 2: PAYMENTS */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-3">Payments</h2>
                  <p className="text-stone-500 leading-relaxed font-medium">
                    Payments are securely processed via <span className="text-[#0f172a] font-bold">Stripe</span>. 
                    Your spiritual journey is protected with industry-standard encryption. Orders are confirmed only after successful payment verification.
                  </p>
                </div>
              </section>

              {/* SECTION 3: RETURNS */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-3">Returns & Refunds</h2>
                  <p className="text-stone-500 leading-relaxed font-medium">
                    Returns are accepted only for <span className="text-[#c2410c] font-bold">damaged or incorrect items</span>. 
                    Discrepancies must be reported within <span className="text-[#0f172a] font-bold text-lg underline decoration-orange-200 underline-offset-4">48 hours</span> of delivery to qualify for an exchange or refund.
                  </p>
                </div>
              </section>

              {/* SECTION 4: LIABILITY */}
              <section className="flex flex-col md:flex-row gap-8 items-start pt-8 border-t border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-3">Limitation of Liability</h2>
                  <p className="text-stone-500 leading-relaxed font-medium text-sm">
                    We are not responsible for delays caused by external shipping carriers or incorrect address details provided by the customer. 
                    Please ensure your delivery coordinates are precise to avoid disruptions in service.
                  </p>
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