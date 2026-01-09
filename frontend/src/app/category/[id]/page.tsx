import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumb';

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: string;
  thumbnail?: string | null;
  stock?: number;
};

async function getProductsByCategory(id: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(id)}`,
    { cache: 'no-store' },
  );

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const products = await getProductsByCategory(id);
  const heading = decodeURIComponent(id).replace(/-/g, ' ');

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: id, url: null },
  ];

  return (
    <main className="min-h-screen bg-[#FDFCFB] antialiased">
      <Breadcrumb items={breadcrumbs} />

      <section className="mx-auto max-w-[1800px] px-8 py-20 lg:px-16">
        
       
        <div className="mb-24 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-700">
            Sacred Collection
          </p>
          <h1 className="mt-8 text-5xl md:text-7xl font-serif font-bold text-slate-950 capitalize tracking-tight">
            {heading}
          </h1>
          <div className="mt-8 h-px w-24 bg-stone-200 mx-auto" />
          <p className="mt-8 text-lg font-serif italic text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Handpicked brass and copper sets for daily worship and festive rituals.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center border-t border-stone-100">
            <p className="text-sm font-serif italic text-stone-400">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-24 gap-x-12 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                
                
                <article className="flex flex-col bg-white border border-stone-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 overflow-hidden rounded-sm">
                  
                 
                  <div className="relative aspect-square w-full bg-[#F9F8F6] p-12 border-b border-stone-100">
                    {p.thumbnail ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${p.thumbnail}`}
                        alt={p.name}
                        fill
                        className="object-contain p-6"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-300 font-serif italic">Image coming soon</div>
                    )}
                    
                    <div className="absolute top-6 left-6">
                       <span className="bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-950 border border-stone-200">
                         Available
                       </span>
                    </div>
                  </div>

                 
                  <div className="flex flex-col p-8 bg-white">
                    <div className="flex justify-between items-start gap-6">
                      <h2 className="text-2xl font-serif font-bold text-slate-950 leading-tight group-hover:text-orange-900 transition-colors">
                        {p.name}
                      </h2>
                      
                     
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1.5">Amount</span>
                        <div className="bg-slate-950 px-5 py-2.5 rounded-sm shadow-md transition-colors group-hover:bg-orange-800">
                          <p className="text-2xl font-serif font-bold text-white leading-none">
                            ${p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-6 line-clamp-2 text-[15px] leading-relaxed text-stone-500 font-medium italic opacity-90">
                      {p.description}
                    </p>

                    
                    <div className="mt-10 flex items-center justify-between border-t border-stone-100 pt-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                        Authentic Ritual Gear
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        Details <span className="text-xl">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}