'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'Failed to create category');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        
        {/* HEADER SECTION */}
        <div className="mb-12 flex items-center justify-between border-b border-stone-100 pb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
              Taxonomy Management
            </p>
            <h1 className="mt-2 text-4xl font-serif text-slate-900">
              New Category
            </h1>
            <p className="mt-2 text-sm italic font-serif text-slate-500">
              Define a new collection for your inventory.
            </p>
          </div>
          <button 
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* MAIN CARD */}
          <section className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            <div className="space-y-8 rounded-[2.5rem] bg-white p-8 md:p-12 border border-stone-200 shadow-sm">
              
              <div className="grid gap-8 md:grid-cols-2">
                {/* NAME INPUT */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category Name
                  </label>
                  <input
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all"
                    placeholder="e.g., Idols & Statues"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* SLUG INPUT */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    URL Slug
                  </label>
                  <input
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm font-mono focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all"
                    placeholder="idols-and-statues"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  <p className="px-1 text-[10px] text-stone-400 italic">
                    Used for routing: /category/<span className="font-bold text-amber-600">{slug || 'slug'}</span>
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Collection Description
                </label>
                <textarea
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all"
                  rows={4}
                  placeholder="Describe the essence of this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-xs font-bold text-red-600 uppercase tracking-tight">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-6">
            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-[#0f172a] px-14 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-amber-600 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              )}
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}