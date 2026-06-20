import { useState } from 'react';
import { BarChart3, Flame, LayoutDashboard, LogOut, MousePointerClick } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { clearAuthSession, getStoredUser } from '../services/authStorage';

const navigation = [
  { to: '/sessions', label: 'Sessions', icon: LayoutDashboard },
  { to: '/heatmap', label: 'Heatmap', icon: Flame },
];

const titles: Record<string, string> = {
  '/sessions': 'Sessions',
  '/heatmap': 'Heatmap',
};

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const title = titles[location.pathname] ?? (location.pathname.startsWith('/sessions/') ? 'Journey' : 'Dashboard');

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch {
      // Local state must still be cleared if the network fails during logout.
    } finally {
      clearAuthSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <Link to="/sessions" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
            <MousePointerClick className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-semibold text-slate-950">Data Pulse</p>
            <p className="text-sm text-slate-500">Analytics dashboard</p>
          </div>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-4">
          <div className="mb-3 min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.email ?? 'Signed in'}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role ?? 'user'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <BarChart3 className="h-4 w-4" aria-hidden="true" />
                  Analytics dashboard
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/demo"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Demo Site
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>

            <nav className="flex gap-2 lg:hidden">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                    ].join(' ')
                  }
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
