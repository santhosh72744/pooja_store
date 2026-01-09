'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || loading) return;
    fetchOrders();
  }, [user, loading]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (!mounted || loading) return null;
  if (!user) { router.push('/login'); return null; }

  return (
    <main className="min-h-screen bg-[#F4F1EE] px-4 pt-32 pb-24 text-slate-900 selection:bg-orange-100">
      <div className="max-w-4xl mx-auto">

       
        <header className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block px-4 py-1.5 bg-[#c2410c]/10 rounded-full mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c2410c]">
              Personal Sanctuary
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#0f172a] tracking-tight leading-tight">
            My Account
          </h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-12 bg-stone-300" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c2410c]" />
            <div className="h-px w-12 bg-stone-300" />
          </div>
        </header>

        
        <section className="relative mb-16 group">
          
          <div className="absolute inset-0 bg-stone-200 translate-x-3 translate-y-3 rounded-[2.5rem] -z-10" />
          
          <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-stone-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-serif text-[#0f172a] mb-2">{user.name}</h2>
              <p className="text-lg text-stone-500 font-serif italic mb-6">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-8 border-t border-stone-50">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Rituals</p>
                  <p className="text-3xl font-serif text-[#c2410c] font-medium">{orders.length}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Member Since</p>
                  <p className="text-xl font-serif text-[#0f172a] font-medium">Jan 2026</p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-12 py-5 bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-tl-[2rem] rounded-br-[2rem] hover:bg-[#c2410c] hover:-translate-y-1 transition-all duration-500 shadow-xl shadow-slate-200"
            >
              Sign Out Account
            </button>
          </div>
        </section>

       
        <section className="space-y-10">
          <div className="flex items-center gap-6 px-4">
            <h2 className="text-3xl font-serif text-[#0f172a]">Ritual History</h2>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <div className="grid gap-8">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-500"
              >
               
                <div className="px-8 py-6 bg-stone-50/50 flex flex-wrap justify-between items-center border-b border-stone-100 gap-4">
                  <div className="flex gap-10">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Ritual ID</span>
                      <span className="text-xs font-bold font-mono text-slate-800 tracking-wider">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Reserved On</span>
                      <span className="text-sm font-serif font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Offering Total</span>
                      <span className="text-xl font-serif font-bold text-[#c2410c]">${(order.totalAmount / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{order.status}</span>
                    </div>
                  </div>
                </div>

               
                <div className="p-8">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-8 group/item py-4 first:pt-0 last:pb-0 border-b last:border-0 border-stone-50">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <img 
                          src={item.productImage} 
                          className="h-full w-full object-cover rounded-2xl shadow-sm border border-stone-100 transition-transform group-hover/item:scale-105 duration-500" 
                          alt={item.productName} 
                        />
                        <div className="absolute -top-2 -right-2 bg-[#0f172a] text-white text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center shadow-lg">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-serif text-[#0f172a] mb-1 group-hover/item:text-[#c2410c] transition-colors duration-300">
                          {item.productName}
                        </h4>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Single Unit: ${(item.price/100).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-24 text-center">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">
            Sri Lakshmi Durga Pooja Store & Sanctuary
          </p>
        </footer>
      </div>
    </main>
  );
}