'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  currency?: string;
  stock: number;
  category: string;
  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;
  thumbnail?: string | null;
  images?: string[];
};

type UploadResponse = {
  thumbnail: string | null;
  images: string[];
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  // Form State
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('');

  // Specs State
  const [diameterInches, setDiameterInches] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('');
  const [includedItems, setIncludedItems] = useState('');

  // Media State
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${encodeURIComponent(slugParam)}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const p: Product = await res.json();
        setProductId(p.id);
        setSlug(p.slug);
        setName(p.name);
        setShortDescription(p.shortDescription || '');
        setDescription(p.description || '');
        setPrice(String(p.price));
        setCurrency(p.currency || 'USD');
        setStock(String(p.stock ?? 0));
        setCategory(p.category || '');
        setDiameterInches(p.diameterInches ? String(p.diameterInches) : '');
        setHeightInches(p.heightInches ? String(p.heightInches) : '');
        setWeightLbs(p.weightLbs ? String(p.weightLbs) : '');
        setMaterial(p.material || '');
        setFinish(p.finish || '');
        setIncludedItems(p.includedItems || '');
        setExistingThumbnail(p.thumbnail || null);
        setExistingImages(p.images || []);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slugParam]);

  function resolveImageUrl(path?: string | null) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId) return;
    if (!slug || !name || !price) {
      alert('Slug, name and price are required');
      return;
    }
    setSubmitting(true);

    try {
      let thumbnailPath: string | undefined = existingThumbnail || undefined;
      let imagesPaths: string[] | undefined = existingImages;

      if (thumbnailFile || (galleryFiles && galleryFiles.length > 0)) {
        const formData = new FormData();
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
        if (galleryFiles) {
          Array.from(galleryFiles).forEach((file) => formData.append('gallery', file));
        }

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/product-images`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const data: UploadResponse = await uploadRes.json();
        
        if (data.thumbnail) thumbnailPath = data.thumbnail;
        if (data.images && data.images.length > 0) {
          // If the original logic replaces existing gallery with new ones:
          imagesPaths = data.images; 
        }
      }

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          shortDescription: shortDescription || null,
          description: description || null,
          price: Number(price),
          currency,
          stock: Number(stock) || 0,
          category,
          diameterInches: diameterInches ? Number(diameterInches) : null,
          heightInches: heightInches ? Number(heightInches) : null,
          weightLbs: weightLbs ? Number(weightLbs) : null,
          material: material || null,
          finish: finish || null,
          includedItems: includedItems || null,
          thumbnail: thumbnailPath,
          images: imagesPaths,
        }),
      });

      if (!updateRes.ok) throw new Error('Updating product failed');

      router.push(`/admin/category/${category}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Something went wrong while updating product');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-amber-600/20 border-t-amber-600" />
          <p className="mt-4 font-serif italic text-stone-500">Fetching product details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] pb-24">
      <div className="mx-auto max-w-4xl px-4 pt-16">
        
        {/* HEADER */}
        <div className="mb-10 flex items-end justify-between border-b border-stone-100 pb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Editor Mode</p>
            <h1 className="mt-2 text-4xl font-serif text-slate-900">Edit Product</h1>
            <p className="mt-2 text-sm italic font-serif text-slate-500">Currently modifying: <span className="text-slate-800">{name}</span></p>
          </div>
          <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600">Back</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* CORE INFO */}
          <section className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            <div className="space-y-6 rounded-[2.5rem] bg-white p-8 md:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-serif text-slate-800 border-b border-stone-50 pb-4">Core Identity</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
                  <input
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug</label>
                  <input
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm font-mono focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Description</label>
                <input
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Description</label>
                <textarea
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* LOGISTICS */}
          <section className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="space-y-6 rounded-[2.5rem] bg-white p-8 md:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-serif text-slate-800 border-b border-stone-50 pb-4">Logistics & Pricing</h2>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Currency</label>
                  <select
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white appearance-none cursor-pointer focus:outline-none transition-all"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Slug</label>
                  <input
                    className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SPECIFICATIONS */}
          <section className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="space-y-6 rounded-[2.5rem] bg-white p-8 md:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-serif text-slate-800 border-b border-stone-50 pb-4">Physical Specifications</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Diameter (in)</label>
                  <input type="number" step="0.1" className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={diameterInches} onChange={(e) => setDiameterInches(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Height (in)</label>
                  <input type="number" step="0.1" className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Weight (lbs)</label>
                  <input type="number" step="0.01" className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Material</label>
                  <input className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={material} onChange={(e) => setMaterial(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Finish</label>
                  <input className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={finish} onChange={(e) => setFinish(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Included Items</label>
                  <input className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm focus:bg-white focus:outline-none transition-all" value={includedItems} onChange={(e) => setIncludedItems(e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* MEDIA ASSETS */}
          <section className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="space-y-8 rounded-[2.5rem] bg-white p-8 md:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-serif text-slate-800 border-b border-stone-50 pb-4">Media Assets</h2>
              
              <div className="grid gap-10 md:grid-cols-2">
                {/* THUMBNAIL */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Thumbnail</label>
                  
                  {existingThumbnail && (
                    <div className="relative w-32 group/thumb">
                      <img src={resolveImageUrl(existingThumbnail)} alt="Thumbnail" className="h-32 w-32 rounded-2xl object-cover border border-stone-100 shadow-md" />
                      <button 
                        type="button"
                        onClick={() => { setExistingThumbnail(null); setThumbnailFile(null); }}
                        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-xl opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('thumbnail-input')?.click()}
                      className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-stone-50 transition-all"
                    >
                      {thumbnailFile ? `Selected: ${thumbnailFile.name}` : (existingThumbnail ? 'Replace Thumbnail' : 'Upload Thumbnail')}
                    </button>
                  </div>
                </div>

                {/* GALLERY */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gallery Collection</label>
                  
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img) => (
                        <div key={img} className="relative group/gal">
                          <img src={resolveImageUrl(img)} className="h-16 w-16 rounded-xl object-cover border border-stone-100" />
                          <button
                            type="button"
                            onClick={() => setExistingImages(prev => prev.filter(x => x !== img))}
                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 group-hover/gal:opacity-100"
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <input
                      id="gallery-input"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setGalleryFiles(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('gallery-input')?.click()}
                      className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-stone-50 transition-all"
                    >
                      {galleryFiles ? `${galleryFiles.length} new files ready` : 'Add Gallery Images'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-6 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 rounded-2xl bg-[#0f172a] px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-amber-600 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              )}
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}