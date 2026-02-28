'use client';

import { useState, useMemo } from 'react';
import { MOCK_MARKETS } from '@/lib/mockData';
import type { Market, MarketFilters, SortField, SortDirection } from '@/lib/types';

function applyFilters(markets: Market[], filters: MarketFilters): Market[] {
  let result = [...markets];

  if (filters.category && filters.category !== 'All') {
    result = result.filter((m) => m.category === filters.category);
  }

  if (filters.status && filters.status !== 'All') {
    result = result.filter((m) => m.status === filters.status);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.question.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.featured) {
    result = result.filter((m) => m.featured);
  }

  return result;
}

function applySort(
  markets: Market[],
  sortField: SortField = 'volume',
  sortDirection: SortDirection = 'desc'
): Market[] {
  return [...markets].sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (sortField) {
      case 'volume':
        aVal = a.volume;
        bVal = b.volume;
        break;
      case 'liquidity':
        aVal = a.liquidity;
        bVal = b.liquidity;
        break;
      case 'endDate':
        aVal = new Date(a.endDate).getTime();
        bVal = new Date(b.endDate).getTime();
        break;
      case 'createdAt':
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case 'yesPrice':
        aVal = a.yesPrice;
        bVal = b.yesPrice;
        break;
      default:
        aVal = a.volume;
        bVal = b.volume;
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

interface UseMarketsReturn {
  markets: Market[];
  loading: boolean;
  filters: MarketFilters;
  setFilters: (filters: MarketFilters) => void;
  totalCount: number;
}

export function useMarkets(initialFilters: MarketFilters = {}): UseMarketsReturn {
  const [filters, setFilters] = useState<MarketFilters>(initialFilters);

  // In a real app, this would be async. For mock data it's always ready.
  const loading = false;

  const markets = useMemo(() => {
    const filtered = applyFilters(MOCK_MARKETS, filters);
    return applySort(filtered, filters.sortField, filters.sortDirection);
  }, [filters]);

  return { markets, loading, filters, setFilters, totalCount: markets.length };
}
