'use client';

import React, { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketCard } from './MarketCard';
import { MarketCardSkeleton } from '@/components/ui/Skeleton';
import type { Market } from '@/lib/types';

interface MarketGridProps {
  markets: Market[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function MarketGrid({
  markets,
  loading = false,
  skeletonCount = 6,
  className,
}: MarketGridProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (!loading && markets.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No markets found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Try adjusting your filters or search query to find markets.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* View toggle */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              view === 'grid' ? 'bg-white/15 text-white' : 'text-gray-500 hover:text-gray-300'
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              view === 'list' ? 'bg-white/15 text-white' : 'text-gray-500 hover:text-gray-300'
            )}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
