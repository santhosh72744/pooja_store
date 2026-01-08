type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  thumbnail?: string | null;
};

async function getProducts(q: string): Promise<Product[]> {
  if (!q) return [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?q=${encodeURIComponent(q)}`,
    { cache: 'no-store' },
  );

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const products = query ? await getProducts(query) : [];

  return (
    <main className="min-h-screen bg-[#FDFDFB] px-6 py-24">
      <div className="mx-auto max-w-[1400px]">
        
        {/* HEADER SECTION */}
        <div className="mb-12 border-b border-stone-100 pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700 mb-2">Search Results</p>
          <h1 className="text-4xl font-serif text-slate-900 italic">
            {query ? `Showing results for “${query}”` : 'Start your search'}
          </h1>

          {(!query || products.length === 0) && (
            <p className="mt-4 text-sm text-stone-500 font-light">
              {query
                ? 'No products found. Try a different keyword.'
                : 'Type something in the search bar above to explore our collection.'}
            </p>
          )}
        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 && (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.slug}`}
                className="group block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  
                  {/* IMAGE BLOCK */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-white p-6">
                    {p.thumbnail ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${p.thumbnail}`}
                        alt={p.name}
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-stone-50 text-stone-300">
                        No Image
                      </div>
                    )}
                    
                    {/* STOCK BADGE */}
                    <div className="absolute top-6 left-6">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                         p.stock > 0 
                         ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                         : 'bg-stone-50 text-stone-400 border-stone-100'
                       }`}>
                         {p.stock > 0 ? 'Available' : 'Out of Stock'}
                       </span>
                    </div>
                  </div>

                  {/* CONTENT BLOCK */}
                  <div className="flex flex-1 flex-col p-8 pt-2">
                    <h2 className="text-xl font-serif text-slate-900 group-hover:text-amber-700 transition-colors">
                      {p.name}
                    </h2>
                    
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-500 font-light italic">
                      {p.shortDescription ?? p.description}
                    </p>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-stone-50">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">
                          Price
                        </p>
                        <p className="text-xl font-light text-slate-900">
                          {(p.currency === 'USD' ? '$' : '₹')}{p.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="h-10 w-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                         <span className="text-stone-400 group-hover:text-white transition-colors">→</span>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}