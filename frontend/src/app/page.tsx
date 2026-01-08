'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import Navbar from './components/Navbar';
import CategoryGrid from './components/CategoryGrid';


const OffersCarousel = dynamic(
  () => import('./components/OffersCarousel'),
  { ssr: false }
);

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
