import Link from 'next/link';
import { CategoryActions } from './CategoryActions';
import ProductActions from './ProductActions';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  currency?: string;
};

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getProducts(slug: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  return res.json();
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts(slug),
  ]);

  if (!category) {
    return (
      <main className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-serif text-red-600 mb-6">Sanctuary category not found.</p>
          <Link
            href="/admin"
            className="px-6 py-3 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] px-4 pt-24 pb-20 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP NAVIGATION BREADCRUMB */}
        <Link 
          href="/admin"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors mb-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Categories
        </Link>

        {/* CATEGORY HEADER CARD */}
        <header className="relative group mb-12">
          <div className="absolute inset-0 bg-stone-200 translate-x-2 translate-y-2 rounded-[2.5rem] -z-10" />
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full mb-3">
                <span className="w-1 h-1 rounded-full bg-amber-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">Category Details</span>
              </div>
              <h1 className="text-4xl font-serif text-[#0f172a] mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-stone-500 italic font-serif max-w-xl">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/category/${category.slug}/edit`}
                className="flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-stone-50 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Edit Category
              </Link>
              <CategoryActions id={category.id} />
            </div>
          </div>
        </header>

        {/* PRODUCTS SECTION HEADER */}
        <section className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif text-[#0f172a]">Associated Products</h2>
            <span className="px-2.5 py-0.5 bg-stone-100 text-stone-500 rounded-full text-[10px] font-bold">
              {products.length}
            </span>
          </div>
          <Link
            href={`/admin/category/${category.slug}/products/new`}
            className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-600 transition-all shadow-lg shadow-stone-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Product
          </Link>
        </section>

        {/* PRODUCTS LIST */}
        {products.length === 0 ? (
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-stone-100 p-20 text-center">
             <p className="font-serif text-stone-400 italic">No sacred items found in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-[1.5rem] border border-stone-200 bg-white px-6 py-4 hover:border-amber-200 transition-all hover:shadow-md"
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <p className="font-serif text-lg text-[#0f172a] group-hover:text-amber-700 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {(p.currency === 'USD' ? '$' : '₹') + p.price}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-200" />
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                      Stock: <span className={p.stock < 5 ? 'text-red-500' : 'text-stone-600'}>{p.stock}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-100 transition-all"
                  >
                    View Live
                  </Link>

                  <Link
                    href={`/admin/product/${p.slug}/edit`}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-700 hover:bg-amber-50 hover:border-amber-200 transition-all"
                  >
                    Edit
                  </Link>

                  <ProductActions productId={p.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <p className="mt-16 text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">
          Inventory Control • Sri Lakshmi Durga Pooja Store
        </p>
      </div>
    </main>
  );
}