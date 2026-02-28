'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { Category, MarketFilters, MarketStatus } from '@/lib/types';

interface SidebarProps {
  filters: MarketFilters;
  onChange: (filters: MarketFilters) => void;
  className?: string;
}

const STATUS_OPTIONS: Array<{ label: string; value: MarketStatus | 'All' }> = [
  { label: 'All',       value: 'All' },
  { label: 'Active',    value: 'active' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Resolved',  value: 'resolved' },
  { label: 'Cancelled', value: 'cancelled' },
];

const VOLUME_OPTIONS = [
  { label: 'Any volume',     min: 0,      max: Infinity },
  { label: '$1K+',           min: 1_000,  max: Infinity },
  { label: '$10K+',          min: 10_000, max: Infinity },
  { label: '$100K+',         min: 100_000, max: Infinity },
];

const TIME_OPTIONS = [
  { label: 'Any time',      value: 'all' },
  { label: 'Ends today',    value: '1d' },
  { label: 'Ends this week', value: '7d' },
  { label: 'Ends this month', value: '30d' },
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-medium text-gray-300 hover:text-white mb-3 transition-colors"
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export function Sidebar({ filters, onChange, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const set = <K extends keyof MarketFilters>(key: K, value: MarketFilters[K]) =>
    onChange({ ...filters, [key]: value });

  if (collapsed) {
    return (
      <div className={cn('hidden lg:flex flex-col items-center pt-4', className)}>
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2 transition-colors"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>
    );
  }

  return (
    <aside className={cn('hidden lg:block w-56 shrink-0', className)}>
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <SlidersHorizontal size={14} />
            Filters
          </span>
          <button
            onClick={() => setCollapsed(true)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Collapse
          </button>
        </div>

        <Section title="Category">
          <div className="space-y-1">
            {CATEGORIES.map(({ label, value, emoji }) => (
              <button
                key={String(value)}
                onClick={() => set('category', value as Category | 'All')}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                  filters.category === value
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <span className="text-xs">{emoji}</span>
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Status">
          <div className="space-y-1">
            {STATUS_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => set('status', value as MarketStatus | 'All')}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                  filters.status === value
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Volume" defaultOpen={false}>
          <div className="space-y-1">
            {VOLUME_OPTIONS.map(({ label }) => (
              <button
                key={label}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Time Remaining" defaultOpen={false}>
          <div className="space-y-1">
            {TIME_OPTIONS.map(({ label }) => (
              <button
                key={label}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Clear */}
        {(filters.category || filters.status) && (
          <button
            onClick={() => onChange({})}
            className="w-full mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors text-center py-1"
          >
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}
