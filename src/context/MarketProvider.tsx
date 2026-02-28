'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_MARKETS } from '@/lib/mockData';
import { calculateShares } from '@/lib/utils';
import { FEE_RATE } from '@/lib/constants';
import type { Market, MarketFilters, Trade, TradeType } from '@/lib/types';

interface MarketContextValue {
  markets: Market[];
  filters: MarketFilters;
  setFilters: (filters: MarketFilters) => void;
  getMarketById: (id: string) => Market | undefined;
  buyShares: (marketId: string, type: TradeType, amount: number) => Trade | null;
  loading: boolean;
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function useMarketContext(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarketContext must be used within MarketProvider');
  return ctx;
}

interface MarketProviderProps {
  children: React.ReactNode;
}

export function MarketProvider({ children }: MarketProviderProps) {
  const [markets, setMarkets] = useState<Market[]>(MOCK_MARKETS);
  const [filters, setFilters] = useState<MarketFilters>({});

  // Simulate live price updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => {
          if (m.status !== 'active') return m;
          const drift = (Math.random() - 0.5) * 0.01;
          const newYes = Math.min(0.99, Math.max(0.01, m.yesPrice + drift));
          return {
            ...m,
            yesPrice: parseFloat(newYes.toFixed(4)),
            noPrice: parseFloat((1 - newYes).toFixed(4)),
          };
        })
      );
    }, 15_000);

    return () => clearInterval(interval);
  }, []);

  const getMarketById = useCallback(
    (id: string) => markets.find((m) => m.id === id),
    [markets]
  );

  const buyShares = useCallback(
    (marketId: string, type: TradeType, amount: number): Trade | null => {
      const market = markets.find((m) => m.id === marketId);
      if (!market || market.status !== 'active') return null;

      const price = type === 'yes' ? market.yesPrice : market.noPrice;
      const { shares } = calculateShares(amount, price, FEE_RATE);

      const trade: Trade = {
        id: `trade-${Date.now()}`,
        marketId,
        marketQuestion: market.question,
        type,
        amount,
        shares,
        price,
        timestamp: Date.now(),
        status: 'confirmed',
      };

      // Optimistically update market volume
      setMarkets((prev) =>
        prev.map((m) =>
          m.id === marketId ? { ...m, volume: m.volume + amount } : m
        )
      );

      return trade;
    },
    [markets]
  );

  const value = useMemo<MarketContextValue>(
    () => ({ markets, filters, setFilters, getMarketById, buyShares, loading: false }),
    [markets, filters, getMarketById, buyShares]
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
