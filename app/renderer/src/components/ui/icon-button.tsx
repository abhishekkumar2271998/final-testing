import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconButtonVariants = cva(
  // No default `[&_svg]:size-*` here on purpose: lucide icons set width/height
  // as attributes, which a CSS class would silently override — call sites size
  // their own glyphs.
  'inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-fast ease-steno focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        ghost:
          'text-[color:var(--fg-1)] hover:bg-[color:var(--surface-hover)]',
        subtle:
          'text-[color:var(--fg-2)] hover:bg-[color:var(--surface-hover)]',
        danger:
          'text-[color:var(--recording)] hover:bg-[color:var(--surface-hover)]',
      },
      size: {
        xs: 'size-5', // 20px — inside toasts and dense pills
        sm: 'size-7', // 28px — composer actions
        md: 'size-8', // 32px — dock controls
        lg: 'size-9', // 36px — matches Button size="icon"
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  }
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Accessible name for the control. Required — an icon-only button has no
   * text content, so without this it is unusable by screen readers.
   */
  label: string;
  /** Also surface `label` as a native hover tooltip. */
  tooltip?: boolean;
}

/**
 * Round, icon-only button. Defaults to `type="button"` — inheriting the
 * implicit `submit` silently posts the surrounding form (the same footgun
 * documented in `chip.tsx`); pass `type="submit"` explicitly where that is
 * the intent.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant, size, label, tooltip, title, type = 'button', ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={tooltip ? (title ?? label) : title}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
IconButton.displayName = 'IconButton';

export { iconButtonVariants };
