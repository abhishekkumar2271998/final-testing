import * as React from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Github,
  Mail,
  Mic,
  PencilLine,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { MeetingsShell } from '@/components/MeetingsShell';
import { UpcomingCard } from '@/components/home/UpcomingCard';
import { PreviousRow } from '@/components/home/PreviousRow';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/ui/app-icon';
import { KbdKey } from '@/components/ui/kbd';
import { useMeetings } from '@/hooks/useMeetings';
import { useRecording } from '@/hooks/useRecording';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useFolders } from '@/hooks/useFolders';
import type { Meeting } from '@/lib/ipc';
import { shortcut } from '@/lib/utils';
import { navigate } from '@/lib/router';

interface HomeProps {
  mode: 'home' | 'meetings';
}

export function Home({ mode }: HomeProps) {
  const meetings = useMeetings();
  const folders = useFolders();
  const calendar = useCalendarEvents();
  const recording = useRecording();

  const emptyState = !meetings.data?.length;
  const isRecording = recording.status === 'recording' || recording.status === 'paused';
  // Empty-state CTA: idle or processing → start a new recording (auto-navigates;
  // previous note keeps processing in the background queue); recording/paused
  // → back to /recording.
  const onToggleRecording = () => {
    if (isRecording) {
      navigate('/recording');
    } else {
      void recording.startRecording();
    }
  };

  const folderName = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const f of folders.data ?? []) map.set(f.id, f.name);
    return map;
  }, [folders.data]);

  const upcoming =
    calendar.data && !calendar.data.needsAuth ? calendar.data.events.slice(0, 3) : [];

  const previous = meetings.data ?? [];

  // Search applies only to /meetings (the All meetings list). Home keeps the
  // unfiltered Previous list since it's already chronologically grouped.
  const [search, setSearch] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const filtered = React.useMemo(() => {
    if (mode !== 'meetings') return previous;
    const needle = search.trim().toLowerCase();
    if (!needle) return previous;
    return previous.filter((m) => {
      const name = m.session_info.name?.toLowerCase() ?? '';
      const summary = m.summary?.toLowerCase() ?? '';
      return name.includes(needle) || summary.includes(needle);
    });
  }, [mode, previous, search]);
  const groups = React.useMemo(() => groupPrevious(filtered), [filtered]);

  const greeting = `Ready to capture beautiful notes`;
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MeetingsShell
      activeSummaryFile={null}
      contentAlign={emptyState && mode === 'home' ? 'center' : 'top'}
    >
      {meetings.isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-[color:var(--fg-2)]">
          Loading meetings…
        </div>
      ) : emptyState ? (
        <div className="flex flex-col items-center gap-8 text-center">
          <AppIcon size={56} />
          <div className="space-y-3">
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 44,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--fg-1)',
              }}
            >
              Welcome to StenoAI.
            </h1>
            <p
              className="text-[17px] leading-[1.55]"
              style={{ color: 'var(--fg-2)' }}
            >
              Capture your first meeting — transcription and summaries happen
              locally on your Mac.
            </p>
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
              Always get consent when transcribing others.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Button
              variant={isRecording ? 'destructive' : 'default'}
              onClick={onToggleRecording}
              className="gap-2"
            >
              {isRecording ? <Square className="size-4" /> : <PencilLine className="size-4" />}
              {isRecording ? 'Stop recording' : 'New note'}
            </Button>
            <p
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span>Quick start:</span>
              <KbdKey>⌘</KbdKey>
              <KbdKey>⇧</KbdKey>
              <KbdKey>R</KbdKey>
              <span>from anywhere</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          {mode === 'home' && (
            <div className="mb-10">
              <div className="mb-1.5 flex items-end justify-between gap-6">
                <h1 className="home-hello">
                  {greeting}
                  <span className="faint">.</span>
                </h1>
                <div
                  className="pb-2 text-[13px] tabular-nums"
                  style={{ color: 'var(--fg-2)' }}
                >
                  {dateStr}
                </div>
              </div>
              <p
                className="max-w-[52ch] text-sm leading-[1.55]"
                style={{ color: 'var(--fg-2)' }}
              >
                {summaryLine(upcoming.length)}
              </p>
            </div>
          )}

          {mode === 'home' && <TipsCarousel />}

          {mode === 'home' && <Gallery />}

          {mode === 'home' && <ImageGallery />}

          {mode === 'home' && <ProductGrid />}

          {mode === 'home' && <ContactSection />}

          {upcoming.length > 0 && mode === 'home' && (
            <section className="mb-10">
              <SectionHead
                title="Upcoming"
                count={upcoming.length}
                action={
                  <button
                    type="button"
                    className="inline-flex items-center rounded p-0.5 transition-colors hover:bg-[color:var(--surface-hover)] disabled:opacity-50"
                    title="Check for new calendar events"
                    onClick={() => calendar.refetch()}
                    disabled={calendar.isFetching}
                    style={{ color: 'var(--fg-2)' }}
                  >
                    <RefreshCw className={`size-3 ${calendar.isFetching ? 'animate-spin' : ''}`} />
                  </button>
                }
              />
              <div className="flex flex-col gap-2">
                {upcoming.map((event) => (
                  <UpcomingCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHead
              title={mode === 'meetings' ? 'All notes' : 'Previous'}
              count={mode === 'meetings' ? filtered.length : previous.length}
              action={
                mode === 'meetings' ? (
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-[12px]"
                      style={{ color: 'var(--fg-muted)' }}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search notes"
                      aria-label="Search notes"
                      className="h-[26px] w-[180px] rounded-md border-0 pl-7 pr-7 text-[12.5px] outline-none transition-colors focus:shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                      style={{
                        background: 'rgba(27,27,25,0.04)',
                        color: 'var(--fg-1)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          searchInputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex size-4 items-center justify-center rounded transition-colors hover:bg-[color:var(--surface-hover)]"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        <X className="size-[11px]" />
                      </button>
                    )}
                  </div>
                ) : undefined
              }
            />
            {groups.length === 0 && mode === 'meetings' && search.trim() ? (
              <div
                className="px-6 py-12 text-center text-[13px]"
                style={{ color: 'var(--fg-2)' }}
              >
                No meetings match &ldquo;{search.trim()}&rdquo;.
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.label}>
                  <div
                    className="pb-2 pt-4 text-[11.5px] font-medium tracking-[0.02em]"
                    style={{ color: 'var(--fg-2)' }}
                  >
                    {g.label}
                  </div>
                  <div>
                    {g.items.map((m) => (
                      <PreviousRow
                        key={m.session_info.summary_file}
                        meeting={m}
                        folderName={firstFolderName(m, folderName)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </MeetingsShell>
  );
}

interface Slide {
  title: string;
  body: string;
}

const TIPS: Slide[] = [
  {
    title: 'Capture from anywhere',
    body: `Start a note instantly with ${shortcut('⌘⇧R', 'Ctrl+Shift+R')} — no need to bring StenoAI to the front first.`,
  },
  {
    title: 'Private by design',
    body: 'Transcription and summaries run locally on your Mac. Your audio never leaves the device.',
  },
  {
    title: 'Stay organized',
    body: 'Sort notes into folders and find any past meeting in seconds with search.',
  },
  {
    title: 'Ask your notes',
    body: 'Query a transcript in plain language to surface decisions, action items, and follow-ups.',
  },
];

const CAROUSEL_INTERVAL_MS = 6000;

// Self-contained auto-advancing carousel of product tips for the home view.
// Pauses while hovered/focused; dots and arrows allow manual navigation.
function TipsCarousel() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = TIPS.length;

  const go = React.useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      CAROUSEL_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  const slide = TIPS[index];

  return (
    <section
      className="mb-10"
      aria-roledescription="carousel"
      aria-label="Tips"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {TIPS.map((tip, i) => (
          <button
            key={tip.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to tip ${i + 1}`}
            aria-current={i === index}
            className="size-1.5 rounded-full transition-all"
            style={{
              background: i === index ? 'var(--accent-primary)' : 'var(--border)',
              width: i === index ? 16 : 6,
            }}
          />
        ))}
      </div>
    </section>
  );
}

interface GalleryItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const GALLERY: GalleryItem[] = [
  {
    icon: Mic,
    title: 'Record',
    body: 'Capture mic and system audio in one tap.',
  },
  {
    icon: FileText,
    title: 'Transcribe',
    body: 'Accurate, on-device transcripts via Whisper.',
  },
  {
    icon: Sparkles,
    title: 'Summarize',
    body: 'Clean summaries and action items, locally.',
  },
  {
    icon: FolderOpen,
    title: 'Organize',
    body: 'Group notes into folders you control.',
  },
  {
    icon: Calendar,
    title: 'Connect calendar',
    body: 'Pull in upcoming meetings automatically.',
  },
  {
    icon: Search,
    title: 'Search & ask',
    body: 'Find anything or query notes in plain language.',
  },
];

// Self-contained gallery section for the home view: a responsive grid of
// capability tiles. Inline here per request — no separate component file.
function Gallery() {
  return (
    <section className="mb-10">
      <SectionHead title="Gallery" count={GALLERY.length} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-xl px-4 py-4 transition-colors hover:bg-[color:var(--surface-hover)]"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg"
              style={{
                background: 'rgba(27,27,25,0.05)',
                color: 'var(--fg-1)',
              }}
            >
              <Icon className="size-4" />
            </span>
            <h3
              className="text-sm font-medium tracking-[-0.005em]"
              style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-sans)' }}
            >
              {title}
            </h3>
            <p
              className="text-[12.5px] leading-[1.5]"
              style={{ color: 'var(--fg-2)' }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface GalleryImage {
  src: string;
  alt: string;
}

// Inline SVG data-URI placeholder so the gallery renders real <img> tiles
// without any network request (keeps the local-first / CSP behavior). Replace
// these with real image imports (e.g. `import shot from '@/assets/shot.png'`)
// when artwork is available.
function placeholderImage(label: string, tone: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
    <rect width="320" height="240" fill="${tone}"/>
    <text x="160" y="128" font-family="Georgia, serif" font-size="20" fill="#FAF9F5" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const IMAGES: GalleryImage[] = [
  { src: placeholderImage('Record', '#1B1B19'), alt: 'Recording a meeting' },
  { src: placeholderImage('Transcript', '#2A2A26'), alt: 'A generated transcript' },
  { src: placeholderImage('Summary', '#3A3A33'), alt: 'An AI summary' },
  { src: placeholderImage('Folders', '#24241F'), alt: 'Notes organized in folders' },
  { src: placeholderImage('Search', '#1B1B19'), alt: 'Searching past notes' },
  { src: placeholderImage('Calendar', '#2A2A26'), alt: 'Upcoming calendar events' },
];

// Self-contained image gallery for the home view: a responsive grid of image
// tiles. Inline here per request — no separate component file.
function ImageGallery() {
  return (
    <section className="mb-10">
      <SectionHead title="Images" count={IMAGES.length} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {IMAGES.map((img) => (
          <div
            key={img.alt}
            className="overflow-hidden rounded-xl"
            style={{ border: '1px solid var(--border-subtle)' }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

interface Product {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  price: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    icon: Mic,
    name: 'StenoAI Free',
    description: 'Local recording, transcription, and summaries on your Mac.',
    price: 'Free',
  },
  {
    icon: Sparkles,
    name: 'StenoAI Pro',
    description: 'Cloud models, longer context, and priority summarization.',
    price: '$9/mo',
    badge: 'Popular',
  },
  {
    icon: Calendar,
    name: 'Team',
    description: 'Shared folders, calendar sync, and centralized billing.',
    price: '$19/mo',
  },
];

// Self-contained product grid of cards for the home view. Inline here per
// request — no separate component file.
function ProductGrid() {
  return (
    <section className="mb-10">
      <SectionHead title="Plans" count={PRODUCTS.length} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map(({ icon: Icon, name, description, price, badge }) => (
          <div
            key={name}
            className="flex flex-col gap-3 rounded-xl px-4 py-4 transition-colors hover:bg-[color:var(--surface-hover)]"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="inline-flex size-8 items-center justify-center rounded-lg"
                style={{ background: 'rgba(27,27,25,0.05)', color: 'var(--fg-1)' }}
              >
                <Icon className="size-4" />
              </span>
              {badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-[0.02em]"
                  style={{ background: 'var(--accent-primary)', color: 'var(--surface-raised)' }}
                >
                  {badge}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3
                className="mb-1 text-sm font-medium tracking-[-0.005em]"
                style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-sans)' }}
              >
                {name}
              </h3>
              <p
                className="text-[12.5px] leading-[1.5]"
                style={{ color: 'var(--fg-2)' }}
              >
                {description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-[15px] font-medium tabular-nums"
                style={{ color: 'var(--fg-1)' }}
              >
                {price}
              </span>
              <Button variant="outline" className="h-7 px-3 text-xs">
                Choose
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface ContactLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}

const CONTACTS: ContactLink[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@stenoai.app',
    href: 'mailto:support@stenoai.app',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'Report an issue',
    href: 'https://github.com/stenoai/stenoai/issues',
  },
];

// Self-contained contact section for the home view. Links open externally via
// the OS handler. Inline here per request — no separate component file.
function ContactSection() {
  return (
    <section className="mb-10">
      <SectionHead title="Contact" count={CONTACTS.length} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CONTACTS.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-[color:var(--surface-hover)]"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'rgba(27,27,25,0.05)', color: 'var(--fg-1)' }}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <div
                className="text-[11.5px] font-medium tracking-[0.02em]"
                style={{ color: 'var(--fg-muted)' }}
              >
                {label}
              </div>
              <div
                className="truncate text-sm"
                style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-sans)' }}
              >
                {value}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

interface SectionHeadProps {
  title: string;
  count: number;
  action?: React.ReactNode;
}

function SectionHead({ title, count, action }: SectionHeadProps) {
  return (
    <div
      className="mb-3.5 flex items-baseline justify-between pb-2.5"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-baseline gap-2.5">
        <h2
          className="text-sm font-medium tracking-[-0.005em]"
          style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-sans)' }}
        >
          {title}
        </h2>
        <span
          className="text-[12.5px] tabular-nums"
          style={{ color: 'var(--fg-muted)' }}
        >
          {count}
        </span>
      </div>
      {action}
    </div>
  );
}

function summaryLine(_upcomingCount: number): string {
  return `Start recording from the top-right, or from anywhere with ${shortcut('⌘⇧R', 'Ctrl+Shift+R')}.`;
}

function firstFolderName(
  m: Meeting,
  folderName: Map<string, string>,
): string | undefined {
  const id = m.folders?.[0] ?? m.session_info.folders?.[0];
  if (!id) return undefined;
  return folderName.get(id);
}

interface Group {
  label: string;
  items: Meeting[];
}

function groupPrevious(meetings: Meeting[]): Group[] {
  const groups: Record<string, Meeting[]> = {};
  const order: string[] = [];
  const now = new Date();
  const sorted = [...meetings].sort((a, b) => {
    const ta = new Date(a.session_info.processed_at ?? a.session_info.updated_at ?? 0).getTime();
    const tb = new Date(b.session_info.processed_at ?? b.session_info.updated_at ?? 0).getTime();
    return tb - ta;
  });
  for (const m of sorted) {
    const raw = m.session_info.processed_at ?? m.session_info.updated_at;
    const label = raw ? groupLabel(new Date(raw), now) : 'Earlier';
    if (!groups[label]) {
      groups[label] = [];
      order.push(label);
    }
    groups[label].push(m);
  }
  return order.map((label) => ({ label, items: groups[label] }));
}

function groupLabel(d: Date, now: Date): string {
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, now)) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return 'Yesterday';
  const age = now.getTime() - d.getTime();
  if (age < 7 * 24 * 60 * 60 * 1000) {
    return d.toLocaleDateString(undefined, { weekday: 'long' });
  }
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}
