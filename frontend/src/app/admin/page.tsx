import Link from 'next/link';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function AdminHomePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-white px-8 py-16 lg:px-24">
      <header className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b-2 border-slate-950 pb-10">
        <div className="space-y-2">
          <p className="text-[12px] font-black uppercase tracking-[0.5em] text-orange-800">System Control</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 md:text-6xl">
            Admin – Categories
          </h1>
          <p className="text-sm font-medium italic text-stone-500">
            Orchestrate the puja collection and product hierarchy.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center bg-slate-950 px-10 py-5 text-[12px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-black hover:shadow-2xl active:scale-[0.98]"
        >
          + Add Category
        </Link>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 py-32 text-center">
          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-stone-300">
            The archive is currently empty.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between overflow-hidden border border-stone-200 bg-white p-8 transition-all duration-500 hover:border-slate-950 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
            >
              <div>
                <div className="mb-6 flex items-start justify-between">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950 transition-colors group-hover:text-orange-800">
                    {cat.name}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">
                    Active
                  </span>
                </div>
                
                {cat.description && (
                  <p className="mb-8 text-sm font-serif italic leading-relaxed text-stone-500">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-6">
                <Link
                  href={`/admin/category/${cat.slug}`}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:text-orange-800"
                >
                  Manage Products →
                </Link>
                <Link
                  href={`/admin/category/${cat.slug}/edit`}
                  className="bg-stone-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-400 transition hover:bg-slate-950 hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}