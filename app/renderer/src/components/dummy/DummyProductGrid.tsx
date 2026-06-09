// Reusable dummy product-grid used by the placeholder pages under
// routes/dummy/. Self-contained: no app data hooks, brand tokens only.

export interface DummyProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
}

const NAMES = [
  'Notebook',
  'Recorder',
  'Transcriber',
  'Summarizer',
  'Vault',
  'Sync',
  'Insights',
  'Archive',
  'Pilot',
  'Studio',
];

/** Deterministically generate `count` dummy products for a given page seed. */
export function makeDummyProducts(seed: number, count = 6): DummyProduct[] {
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[(seed + i) % NAMES.length];
    return {
      id: `p-${seed}-${i}`,
      name: `${name} ${seed}.${i + 1}`,
      description: `Placeholder product ${i + 1} for dummy page ${seed}.`,
      price: `$${seed * 3 + i * 2 + 9}`,
      badge: i === 0 ? 'New' : undefined,
    };
  });
}

export function DummyProductGrid({
  title,
  products,
}: {
  title: string;
  products: DummyProduct[];
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      <h1
        className="mb-5 text-[22px] font-medium tracking-[-0.01em]"
        style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl px-4 py-4 transition-colors hover:bg-[color:var(--surface-hover)]"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-sm font-medium tracking-[-0.005em]"
                style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-sans)' }}
              >
                {p.name}
              </h3>
              {p.badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-[0.02em]"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'var(--surface-raised)',
                  }}
                >
                  {p.badge}
                </span>
              )}
            </div>
            <p
              className="flex-1 text-[12.5px] leading-[1.5]"
              style={{ color: 'var(--fg-2)' }}
            >
              {p.description}
            </p>
            <div className="flex items-center justify-between">
              <span
                className="text-[15px] font-medium tabular-nums"
                style={{ color: 'var(--fg-1)' }}
              >
                {p.price}
              </span>
              <button
                type="button"
                className="rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-[color:var(--surface-hover)]"
                style={{
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--fg-1)',
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
