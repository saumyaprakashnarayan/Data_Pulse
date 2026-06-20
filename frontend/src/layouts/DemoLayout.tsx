import { useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const demoNav = [
  { to: '/demo', label: 'Home' },
  { to: '/demo/products', label: 'Products' },
  { to: '/demo/pricing', label: 'Pricing' },
];

const DemoTracker = () => {
  useEffect(() => {
    if (document.getElementById('casualfunnel-tracker')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'casualfunnel-tracker';
    script.src = '/tracker.js';
    script.defer = true;
    script.dataset.endpoint =
      import.meta.env.VITE_TRACKING_ENDPOINT ?? 'http://localhost:4000/api/events';
    script.dataset.trackPathPrefix = '/demo';
    document.head.appendChild(script);
  }, []);

  return null;
};

export const DemoLayout = () => (
  <div className="min-h-screen bg-zinc-50 text-zinc-950">
    <DemoTracker />
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/demo" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold">Data Pulse Demo</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex rounded-md bg-zinc-100 p-1">
            {demoNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/demo'}
                className={({ isActive }) =>
                  [
                    'rounded px-3 py-1.5 text-sm font-medium transition',
                    isActive ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/sessions"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
);
