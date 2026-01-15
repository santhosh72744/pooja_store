'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

type UploadResponse = {
  thumbnail: string | null;
  images: string[];
};

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const categorySlug = params.slug;

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [stock, setStock] = useState('0');

  const [diameterInches, setDiameterInches] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [material, setMaterial] = useState('');
  const [finishing, setFinishing] = useState('');
  const [includedItems, setIncludedItems] = useState('');

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview(null);
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) {
      setGalleryFiles([]);
      setGalleryPreviews([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug || !name || !price) {
      alert('Slug, name and price are required');
      return;
    }

    setSubmitting(true);

    try {
      let thumbnailPath: string | undefined;
      let imagesPaths: string[] | undefined;

      if (thumbnailFile || galleryFiles.length > 0) {
        const formData = new FormData();
        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile);
        }
        if (galleryFiles.length > 0) {
          galleryFiles.forEach((file) => formData.append('gallery', file));
        }

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/product-images`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!uploadRes.ok) {
          throw new Error('Image upload failed');
        }

        const data: UploadResponse = await uploadRes.json();
        if (data.thumbnail) thumbnailPath = data.thumbnail;
        if (data.images && data.images.length > 0) imagesPaths = data.images;
      }

      const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          shortDescription: shortDescription || null,
          description: description || null,
          price: Number(price),
          currency,
          stock: Number(stock) || 0,
          category: categorySlug,
          diameterInches: diameterInches ? Number(diameterInches) : null,
          heightInches: heightInches ? Number(heightInches) : null,
          weightLbs: weightLbs ? Number(weightLbs) : null,
          material: material || null,
          finish: finishing || null,
          includedItems: includedItems || null,
          thumbnail: thumbnailPath,
          images: imagesPaths,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(errText);
        throw new Error('Creating product failed');
      }

      router.push(`/admin/category/${categorySlug}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Something went wrong while saving product');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-24 pb-20 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* BREADCRUMB */}
        <button 
          onClick={() => router.push(`/admin/category/${categorySlug}`)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to {categorySlug}
        </button>

        {/* HEADER */}
        <div className="mb-12 border-b border-stone-100 pb-8 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-2">Inventory Manifest</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#0f172a]">New Sacred Item</h1>
          <p className="mt-3 text-stone-400 italic font-serif">Expanding the collection in <span className="text-stone-600 font-bold not-italic underline decoration-amber-200">{categorySlug}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. BASIC IDENTITY CARD */}
          <div className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs border border-amber-100">1</div>
                <h2 className="text-xl font-serif text-[#0f172a]">Basic Identity</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Product Name</label>
                  <input
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                    value={name}
                    placeholder="e.g. Traditional Brass Diya"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Unique Slug</label>
                  <input
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                    value={slug}
                    placeholder="brass-diya-large"
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Short Summary (Preview)</label>
                <textarea
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none resize-none"
                  rows={2}
                  placeholder="A brief essence of the item..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Full Narrative Description</label>
                <textarea
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all outline-none"
                  rows={5}
                  placeholder="The story, ritual significance, and detailed craftmanship..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. PRICING & LOGISTICS */}
          <div className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs border border-amber-100">2</div>
                <h2 className="text-xl font-serif text-[#0f172a]">Pricing & Stock</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Price</label>
                  <input
                    type="number"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:border-amber-500 transition-all outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Currency</label>
                  <select
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:border-amber-500 transition-all outline-none appearance-none cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Current Stock</label>
                  <input
                    type="number"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:border-amber-500 transition-all outline-none"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SPECIFICATIONS */}
          <div className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs border border-amber-100">3</div>
                <h2 className="text-xl font-serif text-[#0f172a]">Specifications</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Diameter (in)</label>
                  <input type="number" step="0.1" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" value={diameterInches} onChange={(e) => setDiameterInches(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Height (in)</label>
                  <input type="number" step="0.1" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Weight (lbs)</label>
                  <input type="number" step="0.01" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Material</label>
                  <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Pure Copper" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Finishing</label>
                  <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" value={finishing} onChange={(e) => setFinishing(e.target.value)} placeholder="e.g. Antique Matte" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">What's in the box?</label>
                <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white" rows={2} value={includedItems} onChange={(e) => setIncludedItems(e.target.value)} placeholder="e.g. 1x Diya, 2x Wicks..." />
              </div>
            </div>
          </div>

          {/* 4. VISUALS */}
          <div className="relative group">
            <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs border border-amber-100">4</div>
                <h2 className="text-xl font-serif text-[#0f172a]">Sacred Visuals</h2>
              </div>
              
              <div className="grid gap-12 md:grid-cols-2">
                {/* Thumbnail */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Primary Thumbnail</label>
                  <div className={`relative border-2 border-dashed rounded-[2rem] p-6 transition-all ${thumbnailPreview ? 'border-amber-200 bg-amber-50/20' : 'border-stone-100 bg-stone-50 hover:border-amber-200'}`}>
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailChange} />
                    {thumbnailPreview ? (
                      <div className="relative group/img aspect-square max-w-[160px] mx-auto">
                        <img src={thumbnailPreview} className="w-full h-full object-cover rounded-2xl shadow-lg border border-white" alt="Preview" />
                        <button type="button" onClick={clearThumbnail} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-xl ring-4 ring-white">✕</button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                        </div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Upload Main Image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Gallery Collection</label>
                  <div className="border-2 border-dashed border-stone-100 rounded-[2rem] p-6 bg-stone-50 hover:border-amber-200 transition-all relative">
                    <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGalleryChange} />
                    <div className="text-center py-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Add Additional Angles</p>
                    </div>
                  </div>
                  {galleryPreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {galleryPreviews.map((url, i) => (
                        <div key={url} className="relative group aspect-square w-16">
                          <img src={url} className="w-full h-full object-cover rounded-xl border border-stone-100 shadow-sm" alt="Gallery" />
                          <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] shadow-lg">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-6 pt-10">
            <button
              type="button"
              onClick={() => router.push(`/admin/category/${categorySlug}`)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-5 bg-[#0f172a] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 flex items-center gap-3"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              )}
              {submitting ? 'Publishing...' : 'Publish Item'}
            </button>
          </div>
        </form>

        <p className="mt-20 text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">
          Sri Lakshmi Durga Pooja Store Admin
        </p>
      </div>
    </main>
  );
}