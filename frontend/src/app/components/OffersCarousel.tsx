'use client';

import { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    title: "Pure Devotion",
    desc_top: "Hand-poured Oils &",
    desc_bottom: "Temple-Grade Incense",
    offer: "FLAT 20% OFF",
    theme: "text-amber-900",
  }
];

export default function GalleryHero() {
  return (
    <section className="relative w-full h-[80vh] md:h-[85vh] bg-[#F4F1EE] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      
      {/* 1. Organic Background Elements */}
      <div className="absolute top-[-5%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-white/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-orange-100/30 rounded-full blur-[80px] md:blur-[120px]" />
      
      {/* 2. Central Artistic Composition */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        
        {/* Floating Badge - Responsive Positioning */}
        <div className="absolute -top-16 md:-top-12 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-12 rotate-[-6deg] md:rotate-[-12deg] z-20 w-max">
          <div className="bg-white px-4 py-1.5 md:px-6 md:py-2 shadow-xl border border-stone-100">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-orange-800">
              Limited Release
            </span>
          </div>
        </div>

        {/* The Main Title Section */}
        <div className="text-center w-full">
          <p className="text-[10px] md:text-base font-serif italic text-stone-500 mb-2 tracking-[0.2em] md:tracking-widest uppercase">
            {slides[0].desc_top}
          </p>
          
          <h1 className="text-[16vw] md:text-[8vw] font-serif leading-[0.9] text-stone-900 tracking-tighter mb-4 break-words">
            {slides[0].title.split(' ')[0]} <br className="md:hidden" />
            <span className="md:inline">{slides[0].title.split(' ')[1]}</span>
          </h1>

          <p className="text-[10px] md:text-base font-serif italic text-stone-500 mb-8 md:mb-10 tracking-[0.2em] md:tracking-widest uppercase">
            {slides[0].desc_bottom}
          </p>
        </div>

        {/* The Offer - Floating Offset (Adjusted for Mobile) */}
        <div className="relative md:absolute md:-bottom-8 md:right-12 z-20 mt-4 md:mt-0">
          <div className="flex flex-col items-center md:items-end">
            <span className="hidden md:block text-6xl md:text-8xl font-serif text-orange-900/10 absolute -top-10 right-0 pointer-events-none uppercase">
              Offer
            </span>
            <p className="relative text-2xl md:text-5xl font-serif text-stone-800 tracking-tight">
              {slides[0].offer}
            </p>
            <div className="h-px w-24 md:w-full bg-stone-300 mt-1 md:mt-2" />
          </div>
        </div>

        {/* 3. The Custom "Petal" Button */}
        <button className="group relative mt-12 md:mt-16 active:scale-95 transition-transform">
          <div className="relative z-10 px-8 py-4 md:px-12 md:py-5 bg-stone-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] 
                        rounded-tl-[1.5rem] rounded-br-[1.5rem] md:rounded-tl-[2rem] md:rounded-br-[2rem] transition-all duration-500 group-hover:rounded-none group-hover:bg-orange-800">
            Explore Collection
          </div>
          {/* Shadow layer */}
          <div className="absolute inset-0 bg-stone-200 translate-x-1.5 translate-y-1.5 rounded-tl-[1.5rem] rounded-br-[1.5rem] md:rounded-tl-[2rem] md:rounded-br-[2rem] -z-10" />
        </button>

      </div>

      {/* 4. Minimalist Progress Indicator - Hidden on very small screens to avoid clutter */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex gap-6 md:gap-12 items-end opacity-50 md:opacity-100">
          <div className="flex flex-col gap-2">
            <span className="text-[8px] md:text-[10px] font-bold text-stone-400">01</span>
            <div className="w-px h-10 md:h-16 bg-stone-200 relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-stone-800" />
            </div>
            <span className="text-[8px] md:text-[10px] font-bold text-stone-400">03</span>
          </div>
          <p className="text-[8px] uppercase tracking-[0.4em] text-stone-400 [writing-mode:vertical-rl] mb-1">
            Sanctuary 2026
          </p>
      </div>

    </section>
  );
}