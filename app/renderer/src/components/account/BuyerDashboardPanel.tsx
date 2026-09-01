import * as React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/account/AuthLayout';
import { BuyerAdBoard } from '@/components/account/BuyerAdBoard';
import { api, apiErrorMessage } from '@/lib/api';
import {
  formatPrice,
  type BuyerStats,
  type Order,
  type Product,
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

function ProductCard({
  product,
  ordering,
  onOrder,
}: {
  product: Product;
  ordering: boolean;
  onOrder: (product: Product) => void;
}) {
  const soldOut = product.stock < 1;
  return (
    <div
      className="flex flex-col gap-3 rounded-xl px-4 py-4"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex-1">
        <h3 className="text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          {product.name}
        </h3>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--fg-muted)' }}>
          by {product.seller_name}
        </p>
        {product.description && (
          <p className="mt-1.5 text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg-2)' }}>
            {product.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium tabular-nums" style={{ color: 'var(--fg-1)' }}>
          {formatPrice(product.price)}
        </span>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={soldOut || ordering}
          onClick={() => onOrder(product)}
        >
          <ShoppingCart className="size-3.5" />
          {soldOut ? 'Sold out' : ordering ? 'Ordering…' : 'Buy'}
        </Button>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg px-4 py-3"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="min-w-0">
        <div className="truncate text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          {order.product_name}
        </div>
        <div className="text-[12.5px]" style={{ color: 'var(--fg-2)' }}>
          Qty {order.quantity} · {formatPrice(order.total)}
        </div>
      </div>
      <span
        className="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
        style={{ background: 'var(--surface-sunken)', color: 'var(--fg-1)' }}
      >
        {order.status}
      </span>
    </div>
  );
}

/** Buyer-facing dashboard body: order stats, the browsable catalog, and the
 *  buyer's own orders. Owns its data fetching, so it can be dropped into any
 *  authenticated shell without extra wiring. */
export function BuyerDashboardPanel({ title = 'Buyer dashboard' }: { title?: string | null }) {
  const [stats, setStats] = React.useState<BuyerStats | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [orderingId, setOrderingId] = React.useState<number | null>(null);

  const load = React.useCallback(async () => {
    try {
      const [s, p, o] = await Promise.all([
        api.get<BuyerStats>('/buyer/dashboard/'),
        api.get<Product[]>('/products/'),
        api.get<Order[]>('/buyer/orders/'),
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

  const onOrder = async (product: Product) => {
    setError(null);
    setOrderingId(product.id);
    try {
      await api.post('/buyer/orders/', { product: product.id, quantity: 1 });
      await load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <>
      {title && (
        <h1
          className="mb-6 text-[22px] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
        >
          {title}
        </h1>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Orders" value={stats?.order_count ?? '—'} />
        <StatCard label="Total spent" value={stats ? formatPrice(stats.total_spent) : '—'} />
        <StatCard label="Available" value={products.length} />
        <StatCard label="Open ads" value={stats?.open_ad_count ?? '—'} />
      </div>

      <FormError message={error} />

      <section className="mb-8">
        <h2 className="mb-3 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          Browse products
        </h2>
        {products.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                ordering={orderingId === p.id}
                onOrder={(product) => void onOrder(product)}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mb-8">
        <BuyerAdBoard onChange={() => void load()} />
      </div>

      <section>
        <h2 className="mb-3 text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          Your orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
