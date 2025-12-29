'use client';
import { Suspense } from 'react';
import OffersCarousel from './components/OffersCarousel';
import CategoryGrid from './components/CategoryGrid';
import Navbar from './components/Navbar';  // Add this

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<div className="h-20 bg-white/70" />}>
        <Navbar />
      </Suspense>
      <OffersCarousel />
      <CategoryGrid />
    </main>
  );
}
