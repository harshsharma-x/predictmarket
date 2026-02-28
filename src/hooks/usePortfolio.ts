'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMarketById } from '@/lib/mockData';
import type { Position, Trade, User } from '@/lib/types';

const STORAGE_KEY_TRADES = 'pm_trades';
const STORAGE_KEY_BALANCE = 'pm_balance';
const MOCK_INITIAL_BALANCE = 10_000;

function loadTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRADES);
    return raw ? (JSON.parse(raw) as Trade[]) : [];
  } catch {
    return [];
  }
}

function saveTrades(trades: Trade[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TRADES, JSON.stringify(trades));
}

function loadBalance(): number {
  if (typeof window === 'undefined') return MOCK_INITIAL_BALANCE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BALANCE);
    return raw ? parseFloat(raw) : MOCK_INITIAL_BALANCE;
  } catch {
    return MOCK_INITIAL_BALANCE;
  }
}

function saveBalance(balance: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_BALANCE, String(balance));
}

/** Aggregate trades into positions */
function buildPositions(trades: Trade[]): Position[] {
  const map = new Map<string, Position>();

  for (const trade of trades) {
    if (trade.status !== 'confirmed') continue;
    const market = getMarketById(trade.marketId);

    const existing = map.get(trade.marketId) ?? {
      marketId: trade.marketId,
      marketQuestion: market?.question ?? trade.marketQuestion ?? '',
      yesShares: 0,
      noShares: 0,
      cost: 0,
      currentValue: 0,
      pnl: 0,
      pnlPercent: 0,
    };

    if (trade.type === 'yes') {
      existing.yesShares += trade.shares;
    } else {
      existing.noShares += trade.shares;
    }
    existing.cost += trade.amount;
    map.set(trade.marketId, existing);
  }

  // Mark-to-market each position
  for (const pos of map.values()) {
    const market = getMarketById(pos.marketId);
    if (market) {
      pos.currentValue =
        pos.yesShares * market.yesPrice + pos.noShares * market.noPrice;
      pos.pnl = pos.currentValue - pos.cost;
      pos.pnlPercent = pos.cost > 0 ? (pos.pnl / pos.cost) * 100 : 0;
    }
  }

  return Array.from(map.values());
}

interface UsePortfolioReturn {
  user: User | null;
  positions: Position[];
  trades: Trade[];
  balance: number;
  totalPnl: number;
  claimableWinnings: number;
  addTrade: (trade: Trade) => void;
  loading: boolean;
}

export function usePortfolio(address?: string): UsePortfolioReturn {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState<number>(MOCK_INITIAL_BALANCE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTrades(loadTrades());
    setBalance(loadBalance());
    setLoading(false);
  }, []);

  const positions = buildPositions(trades);
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  // Claimable winnings from resolved markets where user holds winning shares
  const claimableWinnings = positions.reduce((sum, pos) => {
    const market = getMarketById(pos.marketId);
    if (market?.status === 'resolved') {
      if (market.resolution === 'yes') sum += pos.yesShares;
      if (market.resolution === 'no') sum += pos.noShares;
    }
    return sum;
  }, 0);

  const addTrade = useCallback((trade: Trade) => {
    setTrades((prev) => {
      const next = [...prev, trade];
      saveTrades(next);
      return next;
    });
    setBalance((prev) => {
      const next = Math.max(0, prev - trade.amount);
      saveBalance(next);
      return next;
    });
  }, []);

  const user: User | null = address
    ? {
        address,
        balance,
        positions,
        trades,
        totalPnl,
        totalVolume: trades.reduce((s, t) => s + t.amount, 0),
        marketsTraded: new Set(trades.map((t) => t.marketId)).size,
      }
    : null;

  return { user, positions, trades, balance, totalPnl, claimableWinnings, addTrade, loading };
}
