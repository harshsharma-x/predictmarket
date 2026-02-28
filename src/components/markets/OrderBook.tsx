'use client';

import React, { useMemo } from 'react';
import { cn, formatPercent } from '@/lib/utils';
import type { OrderBook as OrderBookType } from '@/lib/types';

interface OrderBookProps {
  orderBook?: OrderBookType;
  className?: string;
}

/** Generate mock order book if none provided */
function generateMockOrderBook(): OrderBookType {
  const midpoint = 0.55;
  const bids = Array.from({ length: 8 }, (_, i) => {
    const price = parseFloat((midpoint - (i + 1) * 0.02).toFixed(2));
    const size = Math.floor(Math.random() * 5000 + 500);
    return { price, size, total: 0 };
  });
  const asks = Array.from({ length: 8 }, (_, i) => {
    const price = parseFloat((midpoint + (i + 1) * 0.02).toFixed(2));
    const size = Math.floor(Math.random() * 5000 + 500);
    return { price, size, total: 0 };
  });

  // cumulative totals
  let cumBid = 0;
  bids.forEach((b) => { cumBid += b.size; b.total = cumBid; });
  let cumAsk = 0;
  asks.forEach((a) => { cumAsk += a.size; a.total = cumAsk; });

  return { bids, asks };
}

export function OrderBook({ orderBook, className }: OrderBookProps) {
  const book = useMemo(() => orderBook ?? generateMockOrderBook(), [orderBook]);

  const maxTotal = Math.max(
    book.bids[book.bids.length - 1]?.total ?? 1,
    book.asks[book.asks.length - 1]?.total ?? 1
  );

  return (
    <div className={cn('rounded-2xl bg-white/5 border border-white/10 overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-gray-300">Order Book</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
        <span>Price (YES%)</span>
        <span className="text-right">Size (USDC)</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (sellers) — reversed so lowest ask is at bottom */}
      <div className="flex flex-col-reverse">
        {book.asks.slice(0, 6).map((ask, i) => (
          <div key={i} className="relative px-4 py-1">
            <div
              className="absolute inset-y-0 right-0 bg-red-900/15"
              style={{ width: `${(ask.total / maxTotal) * 100}%` }}
            />
            <div className="relative grid grid-cols-3 text-xs">
              <span className="text-red-400 font-medium">{formatPercent(ask.price, 0)}</span>
              <span className="text-right text-gray-400">{ask.size.toLocaleString()}</span>
              <span className="text-right text-gray-500">{ask.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Spread indicator */}
      <div className="flex items-center justify-center py-1.5 border-y border-white/5">
        <span className="text-[10px] text-gray-500">
          Spread: {formatPercent(
            Math.abs((book.asks[0]?.price ?? 0.56) - (book.bids[0]?.price ?? 0.54))
          )}
        </span>
      </div>

      {/* Bids (buyers) */}
      <div>
        {book.bids.slice(0, 6).map((bid, i) => (
          <div key={i} className="relative px-4 py-1">
            <div
              className="absolute inset-y-0 right-0 bg-emerald-900/15"
              style={{ width: `${(bid.total / maxTotal) * 100}%` }}
            />
            <div className="relative grid grid-cols-3 text-xs">
              <span className="text-emerald-400 font-medium">{formatPercent(bid.price, 0)}</span>
              <span className="text-right text-gray-400">{bid.size.toLocaleString()}</span>
              <span className="text-right text-gray-500">{bid.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
