'use client';

import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants';
import type { Category, MarketFilters, MarketStatus } from '@/lib/types';

interface MarketFilterProps {
  filters: MarketFilters;
  onChange: (filters: MarketFilters) => void;
  totalCount?: number;
  className?: string;
}

const STATUS_OPTIONS: Array<{ label: string; value: MarketStatus | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'active' },
  { label: 'Resolved', value: 'resolved' },
];

export function MarketFilter({
  filters,
  onChange,
  totalCount,
  className,
}: MarketFilterProps) {
  const set = <K extends keyof MarketFilters>(key: K, value: MarketFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const hasFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    Boolean(filters.search);

  const currentSort = `${filters.sortField ?? 'volume'}-${filters.sortDirection ?? 'desc'}`;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search + sort row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search markets…"
            value={filters.search ?? ''}
            onChange={(e) => set('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              onChange({
                ...filters,
                sortField: field as MarketFilters['sortField'],
                sortDirection: dir as MarketFilters['sortDirection'],
              });
            }}
            className="appearance-none w-full sm:w-44 pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1c2128]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(({ label, value, emoji }) => (
          <button
            key={String(value)}
            onClick={() => set('category', value as Category | 'All')}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              filters.category === value || (!filters.category && value === 'All')
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
            )}
          >
            <span>{emoji}</span>
            <span>{value === 'All' ? 'All' : label}</span>
          </button>
        ))}
      </div>

      {/* Status + count + clear row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          {STATUS_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => set('status', value as MarketStatus | 'All')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                (filters.status === value || (!filters.status && value === 'All'))
                  ? 'bg-white/15 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {typeof totalCount === 'number' && (
            <span className="text-xs text-gray-500">{totalCount} markets</span>
          )}
          {hasFilters && (
            <button
              onClick={() => onChange({})}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <X size={11} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
