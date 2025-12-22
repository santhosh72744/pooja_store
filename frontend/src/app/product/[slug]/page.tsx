// src/app/product/[slug]/page.tsx
import Image from 'next/image';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency?: string;
  category: string;
  thumbnail?: string | null;
  images?: string[];
  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;
  stock?: number;
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `http://localhost:3000/products/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (!res.ok) return null;
  return res.json();
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm text-slate-600">Product not found.</p>
      </main>
    );
  }

  const currencySymbol = product.currency === 'USD' ? '$' : '₹';

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
          {/* LEFT: main image + thumbnails */}
          <div className="space-y-4">
            <div className="relative h-[340px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
              {product.thumbnail && (
                <Image
                  src={`http://localhost:3000${product.thumbnail}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img) => (
                  <div
                    key={img}
                    className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-100"
                  >
                    <Image
                      src={`http://localhost:3000${img}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: title, price, buttons */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Kits
            </p>
            <h1 className="text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-slate-600">
                {product.shortDescription}
              </p>
            )}

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-semibold text-amber-700">
                  {currencySymbol}
                  {product.price.toFixed(2)}
                </p>
                {/* optional old price could go here if you add it later */}
              </div>
              {typeof product.stock === 'number' && (
                <p className="text-xs text-emerald-700">
                  In stock · Only {product.stock} left
                </p>
              )}
            </div>

            {/* Buttons row */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                Buy Now
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-950"
              >
                Add to cart
              </button>
            </div>

            {/* Shipping badges (simple version) */}
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Free standard shipping</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Express shipping available</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTIONS */}
        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          {/* Product details + specs */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">
                Product Details
              </h2>
              {product.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {product.description}
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">
                Specifications
              </h2>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs text-slate-600 md:grid-cols-2">
                {product.material && (
                  <>
                    <dt className="font-medium">Material</dt>
                    <dd>{product.material}</dd>
                  </>
                )}
                {product.finish && (
                  <>
                    <dt className="font-medium">Finish</dt>
                    <dd>{product.finish}</dd>
                  </>
                )}
                {product.heightInches && (
                  <>
                    <dt className="font-medium">Height</dt>
                    <dd>{product.heightInches}"</dd>
                  </>
                )}
                {product.diameterInches && (
                  <>
                    <dt className="font-medium">Diameter</dt>
                    <dd>{product.diameterInches}"</dd>
                  </>
                )}
                {product.weightLbs && (
                  <>
                    <dt className="font-medium">Weight</dt>
                    <dd>{product.weightLbs} lbs</dd>
                  </>
                )}
              </dl>

              {product.includedItems && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-slate-900">
                    What&apos;s in the box
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {product.includedItems}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & returns panel */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">
                Delivery and Returns
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li>Shipping: Dispatch in 1–3 business days.</li>
                <li>Returns: Eligible for return within 7 days of delivery.</li>
                <li>Delivery: Free standard delivery on all orders.</li>
              </ul>
            </div>

            <div className="grid gap-3 text-xs text-slate-700 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Secure</p>
                <p className="mt-1 text-[11px]">Payments protected.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Insured</p>
                <p className="mt-1 text-[11px]">Fully insured delivery.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Artisan</p>
                <p className="mt-1 text-[11px]">Handmade in India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
