'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Base skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tailwind width class, e.g. "w-32" */
  width?: string;
  /** Tailwind height class, e.g. "h-4" */
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const roundedClasses: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  '2xl':'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'lg',
  className,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-white/8 shrink-0',
          width,
          height,
          roundedClasses[rounded],
          className
        )
      )}
      {...rest}
    />
  );
}

// ── Composed skeletons ────────────────────────────────────────────────────────

/** Full market card placeholder */
export function MarketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton width="w-20" height="h-5" rounded="full" />
        <Skeleton width="w-16" height="h-5" rounded="full" />
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Skeleton height="h-5" />
        <Skeleton height="h-5" width="w-3/4" />
      </div>

      {/* Price bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Skeleton width="w-12" height="h-3.5" />
          <Skeleton width="w-12" height="h-3.5" />
        </div>
        <Skeleton height="h-2" rounded="full" />
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <Skeleton width="w-24" height="h-4" />
        <Skeleton width="w-24" height="h-4" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-1">
        <Skeleton height="h-9" rounded="xl" />
        <Skeleton height="h-9" rounded="xl" />
      </div>
    </div>
  );
}

/** Table row placeholder */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width="w-full" height="h-4" />
      ))}
    </div>
  );
}

/** Stat card placeholder */
export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
      <Skeleton width="w-24" height="h-3.5" />
      <Skeleton width="w-32" height="h-7" rounded="xl" />
      <Skeleton width="w-20" height="h-3" />
    </div>
  );
}

/** Inline text-level skeleton */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? 'w-2/3' : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  );
}
