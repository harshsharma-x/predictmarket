'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatShares } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { EXTERNAL_LINKS } from '@/lib/constants';
import type { Trade } from '@/lib/types';

interface TradeHistoryProps {
  trades: Trade[];
  className?: string;
}

export function TradeHistory({ trades, className }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm text-gray-400 font-medium">No trades yet</p>
        <p className="text-xs text-gray-600 mt-1">Your trade history will appear here</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      {/* Desktop table */}
      <table className="hidden md:table w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
            <th className="pb-3 text-left font-medium pl-1">Market</th>
            <th className="pb-3 text-left font-medium">Type</th>
            <th className="pb-3 text-right font-medium">Amount</th>
            <th className="pb-3 text-right font-medium">Price</th>
            <th className="pb-3 text-right font-medium">Shares</th>
            <th className="pb-3 text-right font-medium">Date</th>
            <th className="pb-3 text-center font-medium">Status</th>
            <th className="pb-3 text-right font-medium pr-1">Tx</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-white/3 transition-colors">
              <td className="py-3 pl-1 max-w-[200px]">
                <p className="text-gray-200 truncate text-xs">
                  {trade.marketQuestion ?? `Market ${trade.marketId}`}
                </p>
              </td>
              <td className="py-3">
                <Badge variant={trade.type} size="sm">
                  {trade.type.toUpperCase()}
                </Badge>
              </td>
              <td className="py-3 text-right text-gray-300">
                {formatCurrency(trade.amount)}
              </td>
              <td className="py-3 text-right text-gray-300">
                {(trade.price * 100).toFixed(1)}¢
              </td>
              <td className="py-3 text-right text-gray-300">
                {formatShares(trade.shares)}
              </td>
              <td className="py-3 text-right text-gray-500 text-xs">
                {formatDate(new Date(trade.timestamp).toISOString())}
              </td>
              <td className="py-3 text-center">
                <Badge
                  variant={
                    trade.status === 'confirmed' ? 'active'
                    : trade.status === 'failed' ? 'no'
                    : 'pending'
                  }
                  size="sm"
                  dot={trade.status === 'pending'}
                >
                  {trade.status}
                </Badge>
              </td>
              <td className="py-3 text-right pr-1">
                {trade.txHash ? (
                  <a
                    href={`${EXTERNAL_LINKS.POLYGON_SCAN}/tx/${trade.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-700">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {trades.map((trade) => (
          <div key={trade.id} className="rounded-xl bg-white/3 border border-white/5 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-gray-200 font-medium line-clamp-1 flex-1">
                {trade.marketQuestion ?? `Market ${trade.marketId}`}
              </p>
              <Badge variant={trade.type} size="sm">{trade.type.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="text-gray-300">{formatCurrency(trade.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500">Shares</p>
                <p className="text-gray-300">{formatShares(trade.shares)}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="text-gray-300">{formatDate(new Date(trade.timestamp).toISOString())}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
