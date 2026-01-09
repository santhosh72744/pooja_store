'use client';

import dynamic from 'next/dynamic';
import CategoryGrid from './components/CategoryGrid';

const OffersCarousel = dynamic(
  () => import('./components/OffersCarousel'),
  { ssr: false }
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <OffersCarousel />
      <CategoryGrid />
    </main>
  );
}
