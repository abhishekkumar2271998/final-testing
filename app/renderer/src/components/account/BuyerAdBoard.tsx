import * as React from 'react';
import { Check, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input, Textarea } from '@/components/ui/input';
import { FormError } from '@/components/account/AuthLayout';
import { api, apiErrorMessage } from '@/lib/api';
import {
  formatPrice,
  type BuyerAd,
  type BuyerAdDraft,
  type BuyerAdStatus,
} from '@/lib/marketplace';

type Filter = 'all' | BuyerAdStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'closed', label: 'Closed' },
];

const EMPTY_DRAFT: BuyerAdDraft = {
  title: '',
  description: '',
  category: '',
  budget_max: '',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function AdCard({
  ad,
  busy,
  onSetStatus,
  onDelete,
}: {
  ad: BuyerAd;
  busy: boolean;
  onSetStatus: (ad: BuyerAd, status: BuyerAdStatus) => void;
  onDelete: (ad: BuyerAd) => void;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl px-4 py-3.5"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
        opacity: ad.status === 'open' ? 1 : 0.72,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
            {ad.title}
          </h3>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--fg-muted)' }}>
            {[ad.category, formatDate(ad.created_at)].filter(Boolean).join(' · ')}
          </p>
        </div>
        <Chip variant={ad.status === 'open' ? 'default' : 'muted'} className="shrink-0 capitalize">
          {ad.status}
        </Chip>
      </div>

      {ad.description && (
        <p className="text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg-2)' }}>
          {ad.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] tabular-nums" style={{ color: 'var(--fg-2)' }}>
          {ad.budget_max ? `Up to ${formatPrice(ad.budget_max)}` : 'No budget set'}
        </span>
        <div className="flex items-center gap-1">
          {ad.status === 'open' ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5"
                disabled={busy}
                onClick={() => onSetStatus(ad, 'fulfilled')}
                title="Mark this ad as fulfilled"
              >
                <Check className="size-3.5" />
                Fulfilled
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => onSetStatus(ad, 'closed')}
                title="Close this ad"
              >
                Close
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              disabled={busy}
              onClick={() => onSetStatus(ad, 'open')}
              title="Reopen this ad"
            >
              <RotateCcw className="size-3.5" />
              Reopen
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            disabled={busy}
            onClick={() => onDelete(ad)}
            aria-label={`Delete ad ${ad.title}`}
            title="Delete"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** The buyer's ad board: post "wanted" ads and manage their lifecycle.
 *  Sellers see the open ones through the public /ads/ board. */
export function BuyerAdBoard({ onChange }: { onChange?: () => void }) {
  const [ads, setAds] = React.useState<BuyerAd[]>([]);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [draft, setDraft] = React.useState<BuyerAdDraft>(EMPTY_DRAFT);
  const [composing, setComposing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [busyId, setBusyId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const { data } = await api.get<BuyerAd[]>('/buyer/ads/');
      setAds(data);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) {
      setError('Give the ad a title.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const budget = (draft.budget_max ?? '').trim();
      await api.post('/buyer/ads/', {
        title,
        description: (draft.description ?? '').trim(),
        category: (draft.category ?? '').trim(),
        budget_max: budget === '' ? null : budget,
      });
      setDraft(EMPTY_DRAFT);
      setComposing(false);
      await load();
      onChange?.();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onSetStatus = async (ad: BuyerAd, status: BuyerAdStatus) => {
    setError(null);
    setBusyId(ad.id);
    try {
      await api.patch(`/buyer/ads/${ad.id}/`, { status });
      await load();
      onChange?.();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (ad: BuyerAd) => {
    setError(null);
    setBusyId(ad.id);
    try {
      await api.delete(`/buyer/ads/${ad.id}/`);
      await load();
      onChange?.();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const visible = filter === 'all' ? ads : ads.filter((a) => a.status === filter);
  const openCount = ads.filter((a) => a.status === 'open').length;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[14px] font-medium" style={{ color: 'var(--fg-1)' }}>
          Ad board
          <span className="ml-2 text-[12.5px] font-normal" style={{ color: 'var(--fg-muted)' }}>
            {openCount} open
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" role="group" aria-label="Filter ads by status">
            {FILTERS.map((f) => (
              <Chip
                key={f.value}
                asButton
                variant={filter === f.value ? 'default' : 'muted'}
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Chip>
            ))}
          </div>
          <Button
            size="sm"
            variant={composing ? 'ghost' : 'default'}
            className="gap-1.5"
            onClick={() => {
              setComposing((v) => !v);
              setError(null);
            }}
            aria-expanded={composing}
          >
            {composing ? (
              'Cancel'
            ) : (
              <>
                <Plus className="size-3.5" />
                Post an ad
              </>
            )}
          </Button>
        </div>
      </div>

      <FormError message={error} />

      {composing && (
        <form
          onSubmit={(e) => void onSubmit(e)}
          className="mb-4 flex flex-col gap-2.5 rounded-xl px-4 py-4"
          style={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <label
              htmlFor="ad-title"
              className="mb-1.5 block text-[13px] font-medium"
              style={{ color: 'var(--fg-1)' }}
            >
              What are you looking for?
            </label>
            <Input
              id="ad-title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Second-hand road bike, 56cm"
              maxLength={200}
              autoFocus
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="ad-category"
                className="mb-1.5 block text-[13px] font-medium"
                style={{ color: 'var(--fg-1)' }}
              >
                Category
              </label>
              <Input
                id="ad-category"
                value={draft.category ?? ''}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="Optional"
                maxLength={60}
              />
            </div>
            <div>
              <label
                htmlFor="ad-budget"
                className="mb-1.5 block text-[13px] font-medium"
                style={{ color: 'var(--fg-1)' }}
              >
                Budget cap
              </label>
              <Input
                id="ad-budget"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={draft.budget_max ?? ''}
                onChange={(e) => setDraft({ ...draft, budget_max: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="ad-description"
              className="mb-1.5 block text-[13px] font-medium"
              style={{ color: 'var(--fg-1)' }}
            >
              Details
            </label>
            <Textarea
              id="ad-description"
              rows={3}
              value={draft.description ?? ''}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Condition, timing, anything a seller should know."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post ad'}
            </Button>
          </div>
        </form>
      )}

      {visible.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
          {ads.length === 0
            ? "You haven't posted any ads yet. Post one to tell sellers what you're after."
            : `No ${filter} ads.`}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {visible.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              busy={busyId === ad.id}
              onSetStatus={(a, s) => void onSetStatus(a, s)}
              onDelete={(a) => void onDelete(a)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
