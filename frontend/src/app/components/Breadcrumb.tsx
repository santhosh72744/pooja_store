'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  url: string | null;
  onClick?: () => void;
};


export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="w-full py-4 px-4"
    >
      <div className="mx-auto max-w-6xl">
        <ol className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200/60 p-1.5 rounded-2xl shadow-sm">
          
          {/* Home Icon Only */}
          <li>
            <Link 
              href="/" 
              className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 group"
              aria-label="Home"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          </li>

          {items
            .filter((item) => item.label.toLowerCase() !== 'home')
            .map((item, index) => {
              const isLast = index === items.length - 2; // adjusted for removed Home

              const label = item.label
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <li key={index} className="flex items-center gap-1">
                  <ChevronRight 
                    size={14} 
                    className="text-slate-300 stroke-[3px]" 
                    aria-hidden="true" 
                  />
                  
                  {item.url && !isLast ? (
  <Link
    href={item.url}
    className="relative px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
  >
    {label}
  </Link>
) : item.onClick && !isLast ? (
  <button
    type="button"
    onClick={item.onClick}
    className="relative px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
  >
    {label}
  </button>
) : (
  <span
    className="px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-50/50 rounded-lg border border-amber-100/50"
    aria-current="page"
  >
    {label}
  </span>
)}

                </li>
              );
            })}
        </ol>
      </div>
    </nav>
  );
}
  