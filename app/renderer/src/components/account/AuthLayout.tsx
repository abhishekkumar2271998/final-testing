import * as React from 'react';
import { AppIcon } from '@/components/ui/app-icon';

/** Centered card used by the sign-in and sign-up screens. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ background: 'var(--surface)' }}
    >
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <AppIcon size={44} />
          <div>
            <h1
              className="text-[26px] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-[14px]" style={{ color: 'var(--fg-2)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-xl px-6 py-6"
          style={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            className="mt-5 text-center text-[13px]"
            style={{ color: 'var(--fg-2)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Small inline error banner for form submission failures. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="mb-4 whitespace-pre-line rounded-md px-3 py-2 text-[13px]"
      style={{
        background: 'color-mix(in srgb, var(--destructive, #b42318) 12%, transparent)',
        color: 'var(--destructive, #b42318)',
      }}
      role="alert"
    >
      {message}
    </div>
  );
}

/** Labeled field wrapper. */
export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-medium"
        style={{ color: 'var(--fg-1)' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
