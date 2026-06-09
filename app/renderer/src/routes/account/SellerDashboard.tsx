import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Field, FormError } from '@/components/account/AuthLayout';
import { DashboardShell } from '@/components/account/DashboardShell';
import { api, apiErrorMessage } from '@/lib/api';
import {
  formatPrice,
  type Order,
  type Product,
  type SellerStats,
} from '@/lib/marketplace';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="text-[12px] font-medium uppercase tracking-[0.04em]" style={{ color: 'var(--fg-muted)' }}>
        {label}
      </div>
      <div className="mt-1 text-[22px] font-medium tabular-nums" style={{ color: 'var(--fg-1)' }}>
        {value}
      </div>
    </div>
  );
}

export function SellerDashboard() {
  const [stats, setStats] = React.useState<SellerStats | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [draft, setDraft] = React.useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });

  const load = React.useCallback(async () => {
    try {
      const [s, p, o] = await Promise.all([
        api.get<SellerStats>('/seller/dashboard/'),
        api.get<Product[]>('/seller/products/'),
        api.get<Order[]>('/seller/orders/'),
      ]);
      setStats(s.data);
      setProducts(p.data);
      setOrders(o.data);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.post('/seller/products/', {
        name: draft.name.trim(),
        price: draft.price,
        stock: Number(draft.stock) || 0,
        description: draft.description,
      });
      setDraft({ name: '', price: '', stock: '', description: '' });
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/seller/products/${id}/`);
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <DashboardShell active="/seller">
      <h1
        className="mb-6 text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
      >
        Seller dashboard
      </h1>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Products" value={stats?.product_count ?? '—'} />
        <StatCard label="Active" value={stats?.active_product_count ?? '—'} />
        <StatCard label="Orders" value={stats?.order_count ?? '—'} />
        <StatCard label="Revenue" value={stats ? formatPrice(stats.revenue) : '—'} />
      </div>

      <FormError message={error} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-3 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
            Your products
          </h2>
          {products.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
              No products yet. Add your first one.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-lg px-4 py-3"
                  style={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
                      {p.name}
                    </div>
                    <div className="text-[12.5px]" style={{ color: 'var(--fg-2)' }}>
                      {formatPrice(p.price)} · {p.stock} in stock
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-[color:var(--surface-hover)]"
                    style={{ color: 'var(--fg-2)' }}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
            Add a product
          </h2>
          <form
            onSubmit={onCreate}
            className="rounded-xl px-4 py-4"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Field label="Name" htmlFor="p-name">
              <Input
                id="p-name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price" htmlFor="p-price">
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  required
                />
              </Field>
              <Field label="Stock" htmlFor="p-stock">
                <Input
                  id="p-stock"
                  type="number"
                  min="0"
                  value={draft.stock}
                  onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))}
                  required
                />
              </Field>
            </div>
            <Field label="Description" htmlFor="p-desc">
              <Textarea
                id="p-desc"
                rows={2}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </Field>
            <Button type="submit" className="w-full gap-2" disabled={busy}>
              <Plus className="size-4" />
              {busy ? 'Adding…' : 'Add product'}
            </Button>
          </form>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          Incoming orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
            No orders on your products yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-4 rounded-lg px-4 py-3"
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
                    {o.product_name}
                  </div>
                  <div className="text-[12.5px]" style={{ color: 'var(--fg-2)' }}>
                    {o.buyer_name} · Qty {o.quantity} · {formatPrice(o.total)}
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
                  style={{ background: 'var(--surface-sunken)', color: 'var(--fg-1)' }}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
