'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { LogOut, Package, User, ArrowRight } from 'lucide-react';


type OrderItem = {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const API_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', []);

  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

 
  const memberSince = useMemo(() => {
    const dateValue = (user as any)?.createdAt;
    if (!dateValue) return 'Jan 2026';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Jan 2026';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Jan 2026';
    }
  }, [user]);

  const fetchOrders = async () => {
 const token =
  typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;


  if (!token) {
    setOrders([]);
    setOrdersLoading(false);
    return;
  }

  try {
    setOrdersLoading(true);
    const response = await fetch(`${API_URL}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    setOrders(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Fetch error:', error);
    setOrders([]);
  } finally {
    setOrdersLoading(false);
  }
};


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-[#F4F1EE] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#c2410c] rounded-full animate-spin" />
      </div>
    );
  }
 if (!user) return null;

  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-32 pb-24 text-slate-900 selection:bg-orange-100">
      <div className="max-w-4xl mx-auto">
        
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2410c]">
              The Sanctuary
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#0f172a] mb-4">
            My Account
          </h1>
          <div className="h-px w-12 bg-stone-200 mx-auto" />
        </div>

    
        <div className="relative group mb-20">
          <div className="absolute inset-0 bg-stone-200 translate-x-3 translate-y-3 rounded-[3rem] -z-10 transition-transform" />
          <div className="bg-white rounded-[3rem] p-8 md:p-14 border border-stone-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-serif text-[#0f172a] mb-1">{user.name}</h2>
                <p className="text-stone-400 font-medium mb-8">{user.email}</p>
                
                <div className="flex flex-wrap gap-10 justify-center md:justify-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-300 mb-1">Total Orders</span>
                    <span className="text-3xl font-serif text-[#c2410c]">{orders.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-300 mb-1">Member Since</span>
                    <span className="text-3xl font-serif text-slate-800">{memberSince}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="group flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-[#c2410c] transition-all"
              >
                Sign Out
                <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        
        <h3 className="text-2xl font-serif text-[#0f172a] mb-10 px-4">Ritual History</h3>

        {ordersLoading ? (
          <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-stone-200 border-t-[#c2410c] rounded-full animate-spin mx-auto" /></div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-stone-200 p-16 text-center">
            <Package size={32} className="mx-auto text-stone-200 mb-4" />
            <p className="text-lg font-serif text-stone-400">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-sm">
                <div className="px-8 py-5 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-stone-400">Order ID</span>
                      <span className="font-mono text-[10px] font-bold text-stone-600">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-stone-400">Date</span>
                      <span className="text-[11px] font-bold text-stone-600">{new Date(order.createdAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-green-50 border-green-100 text-green-600">
                    {order.status}
                  </div>
                </div>
               <div className="p-8 md:p-10">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.productImage.startsWith('http') ? item.productImage : `${API_URL}${item.productImage}`}
                            alt={item.productName}
                            className="h-20 w-20 rounded-2xl object-cover border border-stone-100"
                          />
                          <div className="absolute -top-2 -right-2 bg-[#0f172a] text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-lg text-[#0f172a]">{item.productName}</h4>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-300">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-lg font-serif text-[#0f172a]">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-stone-50 flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-black uppercase text-stone-400 mb-1">Total Amount</p>
                      <p className="text-2xl font-serif text-[#0f172a]">{formatCurrency(order.totalAmount)}</p>
                    </div>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
