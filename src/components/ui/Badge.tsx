'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

// ── Variant definitions ──────────────────────────────────────────────────────

type BadgeVariant =
  | 'yes'
  | 'no'
  | 'active'
  | 'pending'
  | 'resolved'
  | 'cancelled'
  | 'default'
  | { category: Category };

const fixedVariantClasses: Record<
  Exclude<BadgeVariant, { category: Category }>,
  string
> = {
  yes:       'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40',
  no:        'bg-red-900/40 text-red-400 border border-red-700/40',
  active:    'bg-indigo-900/40 text-indigo-300 border border-indigo-700/40',
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-700/40',
  resolved:  'bg-gray-800 text-gray-400 border border-gray-700',
  cancelled: 'bg-gray-800 text-gray-500 border border-gray-700',
  default:   'bg-white/5 text-gray-400 border border-white/10',
};

// ── Size definitions ─────────────────────────────────────────────────────────

type BadgeSize = 'sm' | 'md';

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  // Resolve class string
  let variantClass: string;
  if (typeof variant === 'object' && 'category' in variant) {
    const c = CATEGORY_COLORS[variant.category];
    variantClass = `${c.bg} ${c.text} border ${c.border}`;
  } else {
    variantClass = fixedVariantClasses[variant as Exclude<BadgeVariant, { category: Category }>];
  }

  // Dot colour
  const dotColor =
    typeof variant === 'object'
      ? 'bg-current'
      : variant === 'yes'
      ? 'bg-emerald-400'
      : variant === 'no'
      ? 'bg-red-400'
      : variant === 'active'
      ? 'bg-indigo-400'
      : variant === 'pending'
      ? 'bg-yellow-400'
      : 'bg-gray-500';

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium',
          variantClass,
          sizeClasses[size],
          className
        )
      )}
      {...rest}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColor)}
        />
      )}
      {children}
    </span>
  );
}
