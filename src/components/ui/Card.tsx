'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header slot rendered above the card body */
  header?: React.ReactNode;
  /** Optional footer slot rendered below the card body */
  footer?: React.ReactNode;
  /** Enable hover lift + glow effect */
  hoverable?: boolean;
  /** Remove default padding from the body */
  noPadding?: boolean;
  /** Add a coloured top border accent */
  accent?: 'indigo' | 'green' | 'red' | 'yellow' | 'none';
}

const accentClasses: Record<NonNullable<CardProps['accent']>, string> = {
  indigo: 'border-t-indigo-500',
  green:  'border-t-emerald-500',
  red:    'border-t-red-500',
  yellow: 'border-t-yellow-500',
  none:   '',
};

// ── Component ────────────────────────────────────────────────────────────────

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      header,
      footer,
      hoverable = false,
      noPadding = false,
      accent = 'none',
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            // Glass morphism base
            'relative rounded-2xl overflow-hidden',
            'bg-white/5 backdrop-blur-md',
            'border border-white/10',
            'shadow-xl shadow-black/20',

            // Optional top accent border
            accent !== 'none' && [
              'border-t-2',
              accentClasses[accent],
            ],

            // Hover effect
            hoverable && [
              'transition-all duration-200 ease-out cursor-pointer',
              'hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30',
              'hover:border-white/20',
            ],

            className
          )
        )}
        {...rest}
      >
        {/* Header */}
        {header && (
          <div className="px-5 py-4 border-b border-white/10 bg-white/5">
            {header}
          </div>
        )}

        {/* Body */}
        <div className={clsx(!noPadding && 'p-5')}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
