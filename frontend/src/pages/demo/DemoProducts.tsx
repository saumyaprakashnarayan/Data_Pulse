import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingCart } from 'lucide-react';

const products = [
  { name: 'Transit Backpack', price: '$128', badge: 'Best seller' },
  { name: 'Aluminum Laptop Stand', price: '$74', badge: 'New' },
  { name: 'Modular Cable Kit', price: '$36', badge: 'Popular' },
  { name: 'Soft Shell Pouch', price: '$42', badge: 'Limited' },
  { name: 'Desktop Focus Mat', price: '$58', badge: 'Bundle' },
  { name: 'Travel Notebook Set', price: '$24', badge: 'Restocked' },
];

export const DemoProducts = () => (
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Products</h1>
      </div>
      <Link
        to="/demo/pricing"
        className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
      >
        Team Plans
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.name} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {product.badge}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-zinc-950">{product.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">Ships in 2 business days</p>
            </div>
            <p className="text-lg font-semibold text-zinc-950">{product.price}</p>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Cart
            </button>
            <button
              type="button"
              aria-label={`Save ${product.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
);
