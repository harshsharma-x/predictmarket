'use client';

import React, { useState } from 'react';
import { MarketFilter } from '@/components/markets/MarketFilter';
import { MarketGrid } from '@/components/markets/MarketGrid';
import { useMarkets } from '@/hooks/useMarkets';
import type { MarketFilters } from '@/lib/types';

// Note: metadata cannot be exported from a Client Component.
// Move metadata to a parent server layer if needed.

const DEFAULT_PAGE_SIZE = 12;

export default function MarketsPage() {
  const [page, setPage] = useState(1);
  const { markets, loading, filters, setFilters, totalCount } = useMarkets();

  const paginated = markets.slice(0, page * DEFAULT_PAGE_SIZE);
  const hasMore = paginated.length < markets.length;

  const handleFiltersChange = (next: MarketFilters) => {
    setFilters(next);
    setPage(1); // reset pagination on filter change
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Markets</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Browse and trade on real-world prediction markets
        </p>
      </div>

      {/* Filters */}
      <MarketFilter
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={totalCount}
        className="mb-8"
      />

      {/* Grid */}
      <MarketGrid markets={paginated} loading={loading} />

      {/* Load More */}
      {!loading && hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 font-medium transition-colors"
          >
            Load more markets
          </button>
        </div>
      )}
    </div>
  );
}
