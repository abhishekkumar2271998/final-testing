import * as React from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'steno-theme';

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : 'system';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme;
}

function applyResolved(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  // The design-v2 token layer keys off [data-theme="dark"] in addition to
  // .dark, so mirror the class onto the attribute for both designs.
  document.documentElement.setAttribute('data-theme', resolved);
}

// Module-level store rather than per-hook useState: several components render a
// theme control at once (the toolbar toggle, the main Settings select, the
// account settings picker). With independent state each instance would keep
// showing its own stale value after another one changed the theme — the DOM
// would update but the controls would disagree.
let currentTheme: Theme = readStoredTheme();
let currentResolved: 'light' | 'dark' = resolveTheme(currentTheme);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(theme: Theme) {
  currentTheme = theme;
  currentResolved = resolveTheme(theme);
  applyResolved(currentResolved);
  emit();
}

// One shared media listener for the whole app, bound on first subscribe. It's
// intentionally never torn down — it's a singleton that lives as long as the
// renderer, and rebinding per mount risks missing changes between mounts.
let mediaBound = false;

function bindMediaListener() {
  if (mediaBound || typeof window === 'undefined') return;
  mediaBound = true;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', () => {
    // Only 'system' follows the OS; an explicit light/dark choice ignores it.
    if (currentTheme !== 'system') return;
    currentResolved = mq.matches ? 'dark' : 'light';
    applyResolved(currentResolved);
    emit();
  });
}

function subscribe(onStoreChange: () => void): () => void {
  bindMediaListener();
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function useTheme() {
  const theme = React.useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => currentTheme,
  );
  const resolved = React.useSyncExternalStore(
    subscribe,
    () => currentResolved,
    () => currentResolved,
  );

  // Push the stored preference onto <html> on mount. Routes that render
  // outside the main app shell (the marketplace account pages) have no other
  // mount point for this hook, so without this they'd render unthemed.
  React.useEffect(() => {
    applyResolved(currentResolved);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    commit(next);
  }, []);

  return { theme, setTheme, resolved };
}
