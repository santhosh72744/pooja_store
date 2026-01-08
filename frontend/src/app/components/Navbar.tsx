'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import { useAuth } from '@/context/AuthContext';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalQuantity } = useCart();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsMenuOpen(false);
  };

  const DesktopNavLink = ({ label, path }: { label: string; path: string }) => {
    const active = pathname === path;
    return (
      <div
        onClick={() => router.push(path)}
        className="relative group cursor-pointer px-4 py-2"
      >
        <span
          className={`text-[15px] font-bold uppercase tracking-[0.15em] transition-colors
          ${active ? 'text-[#c2410c]' : 'text-slate-800 group-hover:text-[#c2410c]'}`}
        >
          {label}
        </span>
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#c2410c] transition-all
          ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}
        />
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      {/* Top accent */}
      <div className="h-[5px] w-full bg-gradient-to-r from-[#9a3412] via-[#c2410c] to-[#9a3412]" />

      <nav className="bg-white/95 backdrop-blur-2xl border-b border-stone-200 shadow-lg px-2 md:px-8 lg:px-16">

        {/* ================= ROW 1 ================= */}
        <div className="flex items-center justify-between h-16 md:h-28 gap-4">

          {/* LOGO */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 md:gap-5 cursor-pointer"
          >
            <div className="h-9 w-9 md:h-16 md:w-16 bg-[#0f172a] flex items-center justify-center rounded-sm md:rounded-xl shadow-2xl">
              <span className="text-white font-serif text-xl md:text-4xl">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] md:text-2xl font-black uppercase tracking-wide text-slate-950">
                Sri Lakshmi Durga
              </span>
              <span className="text-[7px] md:text-xs font-bold text-[#c2410c] uppercase tracking-widest">
                Pooja Store & Sanctuary
              </span>
            </div>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSubmit} className="relative w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sacred essentials..."
                className="w-full bg-stone-100/80 border border-stone-200 rounded-full py-4 pl-8 pr-16 text-base italic outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
              <button
                type="submit"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#c2410c]"
              >
                🔍
              </button>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-10">

            {/* DESKTOP LINKS */}
<div className="hidden lg:flex items-center gap-4">
  <DesktopNavLink label="Home" path="/" />

  {/* AUTH BUTTON (DESKTOP) */}
{/* AUTH BUTTON (NO HYDRATION ERROR) */}
{mounted && (
  user ? (
    <div
      onClick={() => router.push('/account')}
      className="relative cursor-pointer px-4 py-2 font-bold uppercase tracking-[0.15em] text-slate-800 hover:text-[#c2410c]"
    >
      My Account
    </div>
  ) : (
    <div
      onClick={() => router.push('/login')}
      className="relative cursor-pointer px-4 py-2 font-bold uppercase tracking-[0.15em] text-slate-800 hover:text-[#c2410c]"
    >
      Login / Signup
    </div>
  )
)}
</div>



            {/* CART */}
            <div
              onClick={() => router.push('/cart')}
              className="flex items-center gap-2 bg-slate-950 text-white px-3 md:px-8 py-2 md:py-5 rounded-lg md:rounded-2xl shadow-2xl cursor-pointer"
            >
              <span className="inline text-[10px] md:text-sm font-black uppercase tracking-widest">
  Cart
</span>

              <span className="text-orange-400 font-serif italic text-sm md:text-2xl">
                {mounted ? totalQuantity : 0}
              </span>
            </div>
          </div>
        </div>

        {/* ================= ROW 2 (MOBILE) ================= */}
        <div className="md:hidden flex items-center gap-2 px-2 pb-3">

          {/* DROPDOWN */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-stone-100 text-slate-900"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {/* SEARCH */}
          <form onSubmit={handleSubmit} className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sacred essentials..."
              className="w-full bg-stone-100 border border-stone-200 rounded-full py-2 pl-4 pr-10 text-sm italic outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              🔍
            </button>
          </form>
        </div>

       {/* ================= MOBILE MENU ================= */}
<div
  className={`md:hidden overflow-hidden transition-all duration-300 ${
    isMenuOpen ? 'max-h-80 border-t border-stone-100' : 'max-h-0'
  }`}
>
  <div className="flex flex-col">
    {/* Home */}
    <div
      onClick={() => {
        router.push('/');
        setIsMenuOpen(false);
      }}
      className="px-6 py-3 font-bold"
    >
      Home
    </div>

    {user ? (
      <>
        {/* Orders */}
        <div
          onClick={() => {
            router.push('/orders');
            setIsMenuOpen(false);
          }}
          className="px-6 py-3 font-bold"
        >
          Orders
        </div>

        {/* Account */}
        <div
          onClick={() => {
            router.push('/account');
            setIsMenuOpen(false);
          }}
          className="px-6 py-3 font-bold"
        >
          Account
        </div>

        {/* Logout */}
        <div
          onClick={() => {
            logout();
            setIsMenuOpen(false);
          }}
          className="px-6 py-3 font-bold text-red-600"
        >
          Logout
        </div>
      </>
    ) : (
      <>
        {/* Login / Signup (SINGLE BUTTON) */}
        <div
          onClick={() => {
            router.push('/login');
            setIsMenuOpen(false);
          }}
          className="px-6 py-3 font-bold text-slate-900"
        >
          Login / Signup
        </div>
      </>
    )}
  </div>
</div>



      </nav>
    </header>
  );
}
