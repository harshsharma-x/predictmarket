'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCurrency, formatPercent, formatShares, formatPnl } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Position } from '@/lib/types';

interface PositionCardProps {
  position: Position;
  onSell?: (position: Position) => void;
  onClaim?: (position: Position) => void;
  resolved?: boolean;
  className?: string;
}

export function PositionCard({
  position,
  onSell,
  onClaim,
  resolved = false,
  className,
}: PositionCardProps) {
  const { marketQuestion, yesShares, noShares, cost, currentValue, pnl, pnlPercent } = position;
  const pnlPositive = pnl > 0;
  const pnlNeutral = pnl === 0;

  const PnlIcon = pnlNeutral ? Minus : pnlPositive ? TrendingUp : TrendingDown;
  const pnlColor = pnlNeutral
    ? 'text-gray-400'
    : pnlPositive
    ? 'text-emerald-400'
    : 'text-red-400';

  return (
    <div
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3',
        'transition-all hover:border-white/20',
        className
      )}
    >
      {/* Market question */}
      <p className="text-sm font-medium text-gray-200 leading-snug line-clamp-2">
        {marketQuestion ?? `Market ${position.marketId}`}
      </p>

      {/* Shares */}
      <div className="flex items-center gap-3">
        {yesShares > 0 && (
          <Badge variant="yes">
            YES {formatShares(yesShares)} shares
          </Badge>
        )}
        {noShares > 0 && (
          <Badge variant="no">
            NO {formatShares(noShares)} shares
          </Badge>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-gray-500 mb-0.5">Cost</p>
          <p className="text-gray-200 font-medium">{formatCurrency(cost)}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-0.5">Value</p>
          <p className="text-gray-200 font-medium">{formatCurrency(currentValue)}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-0.5">P&amp;L</p>
          <p className={cn('font-semibold flex items-center gap-0.5', pnlColor)}>
            <PnlIcon size={11} />
            {formatPnl(pnl)}
            <span className="text-[10px] opacity-70">({formatPercent(Math.abs(pnlPercent / 100))})</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {resolved ? (
          <button
            onClick={() => onClaim?.(position)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-emerald-600/20 border border-emerald-600/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
          >
            Claim Winnings
          </button>
        ) : (
          <>
            <button
              onClick={() => onSell?.(position)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Sell
            </button>
            <Link
              href={`/markets/${position.marketId}`}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-center bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
            >
              View Market
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
