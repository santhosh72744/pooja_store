// src/app/page.tsx
import Navbar from './components/Navbar';
import OffersCarousel from './components/OffersCarousel';
import CategoryGrid from './components/CategoryGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <OffersCarousel />
        <CategoryGrid />
      </div>
    </main>
  );
}
