import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/account/AuthLayout';
import { DashboardShell } from '@/components/account/DashboardShell';
import { useAuth } from '@/hooks/useAuth';
import { api, apiErrorMessage } from '@/lib/api';
import {
  formatPrice,
  type BuyerStats,
  type SellerStats,
} from '@/lib/marketplace';
import { navigate } from '@/lib/router';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="text-[12px] font-medium uppercase tracking-[0.04em]"
        style={{ color: 'var(--fg-muted)' }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[22px] font-medium tabular-nums"
        style={{ color: 'var(--fg-1)' }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-2.5"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <span className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
        {label}
      </span>
      <span
        className="truncate text-[13px] font-medium"
        style={{ color: 'var(--fg-1)' }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl px-5 py-5"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const [sellerStats, setSellerStats] = React.useState<SellerStats | null>(null);
  const [buyerStats, setBuyerStats] = React.useState<BuyerStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        if (user.role === 'seller') {
          const { data } = await api.get<SellerStats>('/seller/dashboard/');
          if (!cancelled) setSellerStats(data);
        } else {
          const { data } = await api.get<BuyerStats>('/buyer/dashboard/');
          if (!cancelled) setBuyerStats(data);
        }
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;
  const p = user.profile;
  const profileFields = [p.display_name, p.bio, p.phone, p.location, p.avatar_url];
  const completeness = Math.round(
    (profileFields.filter((f) => f && f.trim()).length / profileFields.length) * 100,
  );

  return (
    <DashboardShell active="/dashboard">
      <h1
        className="mb-1 text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
      >
        Welcome back, {p.display_name || user.username}
      </h1>
      <p className="mb-6 text-[14px]" style={{ color: 'var(--fg-2)' }}>
        Here's everything on your account at a glance.
      </p>

      <FormError message={error} />

      {/* Role-based activity stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {user.role === 'seller' ? (
          <>
            <StatCard label="Products" value={sellerStats?.product_count ?? '—'} />
            <StatCard label="Active" value={sellerStats?.active_product_count ?? '—'} />
            <StatCard label="Orders" value={sellerStats?.order_count ?? '—'} />
            <StatCard
              label="Revenue"
              value={sellerStats ? formatPrice(sellerStats.revenue) : '—'}
            />
          </>
        ) : (
          <>
            <StatCard label="Orders" value={buyerStats?.order_count ?? '—'} />
            <StatCard
              label="Total spent"
              value={buyerStats ? formatPrice(buyerStats.total_spent) : '—'}
            />
            <StatCard label="Profile" value={`${completeness}%`} />
            <StatCard label="Role" value={user.role} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Account */}
        <Panel title="Account">
          <InfoRow label="Username" value={user.username} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow
            label="Role"
            value={<span className="capitalize">{user.role}</span>}
          />
          <InfoRow label="User ID" value={`#${user.id}`} />
        </Panel>

        {/* Profile */}
        <Panel
          title="Profile"
          action={
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="inline-flex items-center gap-0.5 text-[12.5px] font-medium hover:underline"
              style={{ color: 'var(--fg-2)' }}
            >
              Edit
              <ChevronRight className="size-3.5" />
            </button>
          }
        >
          <InfoRow label="Display name" value={p.display_name} />
          <InfoRow label="Phone" value={p.phone} />
          <InfoRow label="Location" value={p.location} />
          <InfoRow label="Bio" value={p.bio} />
          <InfoRow label="Completeness" value={`${completeness}%`} />
        </Panel>
      </div>

      {/* Role-specific recent activity */}
      <div className="mt-4">
        {user.role === 'seller' ? (
          <Panel
            title="Low stock"
            action={
              <button
                type="button"
                onClick={() => navigate('/seller')}
                className="inline-flex items-center gap-0.5 text-[12.5px] font-medium hover:underline"
                style={{ color: 'var(--fg-2)' }}
              >
                Manage products
                <ChevronRight className="size-3.5" />
              </button>
            }
          >
            {sellerStats && sellerStats.low_stock.length > 0 ? (
              <div className="flex flex-col">
                {sellerStats.low_stock.map((prod) => (
                  <InfoRow
                    key={prod.id}
                    label={prod.name}
                    value={`${prod.stock} left · ${formatPrice(prod.price)}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
                Nothing running low.
              </p>
            )}
          </Panel>
        ) : (
          <Panel
            title="Recent orders"
            action={
              <button
                type="button"
                onClick={() => navigate('/buyer')}
                className="inline-flex items-center gap-0.5 text-[12.5px] font-medium hover:underline"
                style={{ color: 'var(--fg-2)' }}
              >
                View all
                <ChevronRight className="size-3.5" />
              </button>
            }
          >
            {buyerStats && buyerStats.recent_orders.length > 0 ? (
              <div className="flex flex-col">
                {buyerStats.recent_orders.map((o) => (
                  <InfoRow
                    key={o.id}
                    label={`${o.product_name} ×${o.quantity}`}
                    value={`${formatPrice(o.total)} · ${o.status}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
                No orders yet.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/buyer')}
                  className="font-medium hover:underline"
                  style={{ color: 'var(--fg-1)' }}
                >
                  Browse products
                </button>
              </p>
            )}
          </Panel>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <Button onClick={() => navigate('/profile')}>Edit profile</Button>
        <Button
          variant="outline"
          onClick={() => navigate(user.role === 'seller' ? '/seller' : '/buyer')}
        >
          Go to {user.role} dashboard
        </Button>
      </div>
    </DashboardShell>
  );
}
