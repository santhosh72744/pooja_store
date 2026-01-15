'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-32 pb-24 text-slate-900 selection:bg-orange-100 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2410c]">
              Data Protection
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#0f172a] mb-4">
            Privacy Policy
          </h1>
          <p className="text-stone-400 font-serif italic text-lg mb-6">Your trust is our most sacred bond</p>
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
            
            <p className="text-stone-500 mb-12 leading-relaxed font-medium">
              <span className="text-[#0f172a] font-bold">Sri Lakshmi Durga Pooja Store & Sanctuary</span> respects your privacy and is committed to protecting your personal information. This policy outlines how we handle the data you entrust to us during your spiritual journey.
            </p>

            <div className="space-y-16">
              
              {/* SECTION 1: COLLECTION */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-4">Information We Collect</h2>
                  <ul className="space-y-4">
                    {[
                      "Identity: Name, email address, phone number, and shipping coordinates.",
                      "Transactions: Comprehensive order history and payment confirmation details.",
                      "Analytics: Basic usage data used exclusively for site optimization and experience improvement."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-stone-500 font-medium leading-relaxed">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-orange-200 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* SECTION 2: USAGE */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-4">How We Use Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Seamless order processing",
                      "Personalized customer support",
                      "Direct spiritual communication",
                      "Product refinement"
                    ].map((usage, i) => (
                      <div key={i} className="px-4 py-2 bg-stone-50 rounded-xl text-xs font-black uppercase tracking-widest text-stone-500 border border-stone-100">
                        {usage}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: SECURITY */}
              <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#0f172a] mb-3">Security & Integrity</h2>
                  <p className="text-stone-500 leading-relaxed font-medium">
                    All financial transactions are conducted through <span className="text-[#0f172a] font-bold">Stripe</span>. 
                    We maintain a strict protocol of never storing sensitive card details on our local servers. Your data is encrypted and handled with absolute confidentiality.
                  </p>
                </div>
              </section>

              {/* SECTION 4: CONTACT */}
              <section className="pt-8 border-t border-stone-100 flex flex-col items-center text-center">
                <h2 className="text-2xl font-serif text-[#0f172a] mb-6">Contact Privacy Office</h2>
                <a 
                  href="mailto:parcelmybox3@gmail.com"
                  className="flex items-center gap-3 px-10 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-[#c2410c] transition-all shadow-xl shadow-slate-200"
                >
                  parcelmybox3@gmail.com
                </a>
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