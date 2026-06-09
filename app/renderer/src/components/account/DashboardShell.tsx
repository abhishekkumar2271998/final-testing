import * as React from 'react';
import { LogOut } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/lib/router';

interface NavItem {
  label: string;
  path: string;
}

/** Authenticated chrome for the profile / seller / buyer pages. Redirects to
 *  sign-in when there's no session, and renders a header with role-aware nav. */
export function DashboardShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) navigate('/signin');
  }, [loading, user]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-[14px]"
        style={{ background: 'var(--surface)', color: 'var(--fg-2)' }}
      >
        Loading…
      </div>
    );
  }
  if (!user) return null;

  const nav: NavItem[] = [
    { label: 'Profile', path: '/profile' },
    user.role === 'seller'
      ? { label: 'Seller', path: '/seller' }
      : { label: 'Buyer', path: '/buyer' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
            style={{ color: 'var(--fg-1)' }}
          >
            <AppIcon size={22} />
            <span className="text-[14px] font-medium">Marketplace</span>
          </button>
          <nav className="flex items-center gap-1">
            {nav.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors hover:bg-[color:var(--surface-hover)]"
                style={{
                  color: active === item.path ? 'var(--fg-1)' : 'var(--fg-2)',
                  background:
                    active === item.path ? 'var(--surface-sunken)' : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
            {user.username}
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-[10.5px] font-medium capitalize"
              style={{ background: 'var(--surface-sunken)', color: 'var(--fg-1)' }}
            >
              {user.role}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate('/signin');
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] transition-colors hover:bg-[color:var(--surface-hover)]"
            style={{ color: 'var(--fg-2)' }}
            title="Sign out"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
