import * as React from 'react';
import { LogOut, Monitor, Moon, Sun, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/account/DashboardShell';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { navigate } from '@/lib/router';

/** Card wrapper matching the surface treatment used across the account pages. */
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
      <h2 className="mb-2 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
        {title}
      </h2>
      <div
        className="rounded-xl px-5 py-1"
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {children}
      </div>
    </section>
  );
}

/** Label + description on the left, control on the right. Rows after the first
 *  carry a hairline separator so a card reads as a list. */
function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-6 py-4 [&:not(:first-child)]:border-t"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium" style={{ color: 'var(--fg-1)' }}>
          {label}
        </div>
        {description && (
          <div className="mt-0.5 text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg-2)' }}>
            {description}
          </div>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/** Segmented light / dark / system picker. Radio semantics rather than three
 *  plain buttons so screen readers announce it as one grouped choice. */
function ThemePicker({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (next: Theme) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className="inline-flex gap-0.5 rounded-lg p-0.5"
      style={{ background: 'var(--surface-sunken)' }}
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[12.5px] font-medium transition-colors"
            style={{
              background: selected ? 'var(--surface-raised)' : 'transparent',
              color: selected ? 'var(--fg-1)' : 'var(--fg-2)',
              border: `1px solid ${selected ? 'var(--border-subtle)' : 'transparent'}`,
            }}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Account-area settings. Separate from the main app's /settings page, which
 *  covers recording/model/backend concerns and lives outside the marketplace
 *  auth chrome — this one only exposes what makes sense for a signed-in
 *  buyer or seller. */
export function AccountSettings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolved } = useTheme();

  const appearanceHint =
    theme === 'system'
      ? `Following your system — currently ${resolved}.`
      : `Always ${theme}, regardless of your system setting.`;

  return (
    <DashboardShell active="/account/settings">
      <h1
        className="mb-1 text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
      >
        Settings
      </h1>
      <p className="mb-6 text-[14px]" style={{ color: 'var(--fg-2)' }}>
        Preferences for your account. Appearance is stored on this device.
      </p>

      <div className="max-w-[620px]">
        <Card title="Appearance">
          <SettingRow label="Theme" description={appearanceHint}>
            <ThemePicker theme={theme} setTheme={setTheme} />
          </SettingRow>
        </Card>

        <Card title="Account">
          <SettingRow label="Username" description={user?.username ?? '—'} />
          <SettingRow label="Email" description={user?.email ?? '—'} />
          <SettingRow
            label="Role"
            description={
              user?.role === 'seller'
                ? 'Seller — you can list and manage products.'
                : 'Buyer — you can browse and order products.'
            }
          />
          <SettingRow
            label="Profile"
            description="Display name, bio, and contact details."
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/profile')}
            >
              <UserCog className="size-3.5" />
              Edit profile
            </Button>
          </SettingRow>
        </Card>

        <Card title="Session">
          <SettingRow
            label="Sign out"
            description="Ends this session on this device."
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                signOut();
                navigate('/signin');
              }}
            >
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </SettingRow>
        </Card>
      </div>
    </DashboardShell>
  );
}
