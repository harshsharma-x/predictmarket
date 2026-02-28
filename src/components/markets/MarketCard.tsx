'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Droplets } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn, formatCurrency, formatPercent, formatTimeRemaining, isEndingSoon, hasEnded } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Market } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface MarketCardProps {
  market: Market;
  className?: string;
}

export function MarketCard({ market, className }: MarketCardProps) {
  const {
    id, question, category, yesPrice, noPrice, volume, liquidity,
    endDate, status, priceHistory,
  } = market;

  const ending = isEndingSoon(endDate);
  const ended = hasEnded(endDate);
  const categoryMeta = CATEGORIES.find((c) => c.value === category);

  const sparkData = useMemo(
    () =>
      priceHistory.slice(-24).map((p) => ({
        v: parseFloat((p.price * 100).toFixed(1)),
      })),
    [priceHistory]
  );

  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = Math.round(noPrice * 100);

  return (
    <Link href={`/markets/${id}`} className="group block">
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'bg-white/5 backdrop-blur-md border border-white/10',
          'shadow-xl shadow-black/20',
          'transition-all duration-200',
          'hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/20 hover:border-white/20',
          className
        )}
      >
        {/* Top row: category + time */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <Badge variant={{ category }}>
            {categoryMeta?.emoji} {category}
          </Badge>

          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              ended ? 'text-gray-500' : ending ? 'text-amber-400' : 'text-gray-400'
            )}
          >
            <Clock size={11} />
            <span>{ended ? 'Ended' : formatTimeRemaining(endDate)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
            {question}
          </p>
        </div>

        {/* Sparkline */}
        {sparkData.length > 2 && (
          <div className="px-4 h-10 mb-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* YES / NO price bar */}
        <div className="px-4 pb-3">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-emerald-400">YES {yesPercent}%</span>
            <span className="text-red-400">NO {noPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 px-4 pb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <TrendingUp size={11} className="text-indigo-400" />
            {formatCurrency(volume, { compact: true })}
          </span>
          <span className="flex items-center gap-1">
            <Droplets size={11} className="text-blue-400" />
            {formatCurrency(liquidity, { compact: true })}
          </span>
          {market.featured && (
            <span className="ml-auto text-yellow-400 text-xs font-medium uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* YES / NO buy buttons */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-xl py-2 text-sm font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 hover:bg-emerald-600/30 transition-colors"
          >
            Buy YES · {formatPercent(yesPrice, 0)}
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-xl py-2 text-sm font-semibold bg-red-600/20 text-red-300 border border-red-600/30 hover:bg-red-600/30 transition-colors"
          >
            Buy NO · {formatPercent(noPrice, 0)}
          </button>
        </div>

        {/* Status overlay for resolved/cancelled */}
        {(status === 'resolved' || status === 'cancelled') && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
            <Badge variant={status} size="md" dot>
              {status === 'resolved' ? 'Resolved' : 'Cancelled'}
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
}
