import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const circleVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full leading-none',
  {
    variants: {
      variant: {
        raised: 'bg-[color:var(--surface-raised)] text-[color:var(--fg-1)]',
        sunken: 'bg-[color:var(--surface-sunken)] text-[color:var(--fg-1)]',
        muted: 'bg-muted text-foreground',
        accent:
          'bg-[color:hsl(var(--accent-primary))] text-[color:var(--primary-fg)]',
        recording: 'bg-[color:var(--recording)] text-white',
        // Secondary ink — for bullets and inert dots.
        ink: 'bg-[color:var(--fg-2)]',
        outline:
          'border border-[color:var(--border-subtle)] text-[color:var(--fg-1)]',
        none: '',
      },
    },
    defaultVariants: { variant: 'raised' },
  }
);

// Named steps map to Tailwind size utilities (rem-based, so they scale with the
// root font size) rather than px, keeping them in step with the rest of the UI.
const NAMED_SIZES = {
  xs: 'size-1', // 4px  — list bullets
  sm: 'size-1.5', // 6px  — status dots
  md: 'size-[22px]', // inline avatars
  lg: 'size-10', // 40px — icon wells
  xl: 'size-12', // 48px — profile avatars
} as const;

export type CircleSize = keyof typeof NAMED_SIZES;

export interface CircleProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof circleVariants> {
  /** A step from the named scale, or an exact pixel diameter. */
  size?: CircleSize | number;
}

/**
 * A fixed-diameter circle: a bare dot when empty, a centered well when given
 * children (an icon, initials, a count). Colours come from the brand tokens —
 * pass `variant="none"` and a `className` for anything outside the palette.
 */
export const Circle = React.forwardRef<HTMLSpanElement, CircleProps>(
  ({ className, variant, size = 'md', style, ...props }, ref) => {
    const exact = typeof size === 'number';
    return (
      <span
        ref={ref}
        className={cn(
          circleVariants({ variant }),
          !exact && NAMED_SIZES[size],
          className
        )}
        style={exact ? { width: size, height: size, ...style } : style}
        {...props}
      />
    );
  }
);
Circle.displayName = 'Circle';

export { circleVariants };
