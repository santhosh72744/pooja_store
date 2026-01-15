'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`);
        if (!res.ok) throw new Error('Failed to load category');
        const data: Category = await res.json();

        setCategory(data);
        setName(data.name);
        setNewSlug(data.slug);
        setDescription(data.description ?? '');
      } catch (e) {
        alert('Error loading category');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: newSlug, description }),
      });

      if (!res.ok) throw new Error('Failed to update');
      router.push(`/admin`); // Redirecting to admin dashboard is usually better for workflow
      router.refresh();
    } catch (e) {
      alert('Error saving changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!category) return;
    const ok = confirm('Delete this category? This cannot be undone.');
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin');
      router.refresh();
    } catch (e) {
      alert('Error deleting category');
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !category) {
    return (
      <main className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 py-12 text-slate-900 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* BREADCRUMB / NAVIGATION */}
        <button 
          onClick={() => router.push('/admin')}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-stone-100 pb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-2">Category Management</p>
            <h1 className="text-4xl font-serif text-[#0f172a]">Edit: {category.name}</h1>
          </div>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            {deleting ? 'Deleting...' : 'Delete Category'}
          </button>
        </div>

        {/* FORM CARD */}
        <div className="relative group">
          <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
          
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 shadow-sm space-y-8">
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                  Category Name
                </label>
                <input
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                  value={name}
                  placeholder="e.g. Incense Sticks"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* SLUG */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                  URL Slug
                </label>
                <input
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                  value={newSlug}
                  placeholder="incense-sticks"
                  onChange={(e) => setNewSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Description
              </label>
              <textarea
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none resize-none"
                rows={4}
                value={description}
                placeholder="Describe this sacred collection..."
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 px-10 py-4 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-stone-200 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                )}
                {saving ? 'Processing...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <p className="mt-12 text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">
          Admin Portal • Sanctuary Management
        </p>
      </div>
    </main>
  );
}