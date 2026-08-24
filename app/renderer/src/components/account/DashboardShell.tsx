import * as React from 'react';
import { LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { navigate } from '@/lib/router';

interface NavItem {
  label: string;
  path: string;
}

const THEME_CYCLE: Theme[] = ['light', 'dark', 'system'];

const THEME_ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const THEME_LABEL: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/** Light / dark / system switch for the dashboard header. The dashboard chrome
 *  has no Settings entry point, so this cycles all three states rather than
 *  toggling two — otherwise the system preference becomes unreachable here.
 *  Takes theme state as props: DashboardShell owns the single useTheme
 *  instance, since two instances keep independent React state. */
function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (next: Theme) => void;
}) {
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
  const Icon = THEME_ICON[theme];
  const label = `Theme: ${THEME_LABEL[theme]} — switch to ${THEME_LABEL[next].toLowerCase()}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--fg-1)]"
      style={{ color: 'var(--fg-2)' }}
    >
      <Icon className="size-4" />
    </button>
  );
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
  // Account routes render outside the main app shell, so MainToolbar — the
  // only other mount point for useTheme — never runs here. Mounting the hook
  // above the loading branch is what applies the stored light/dark preference
  // to <html> on these routes at all, toggle or no toggle.
  const { theme, setTheme } = useTheme();

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
          <ThemeToggle theme={theme} setTheme={setTheme} />
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
