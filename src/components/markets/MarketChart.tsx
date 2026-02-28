'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn, filterPriceHistory, formatPercent } from '@/lib/utils';
import { CHART_COLORS, CHART_PERIODS } from '@/lib/constants';
import type { ChartPeriod, PricePoint } from '@/lib/types';
import { format } from 'date-fns';

interface MarketChartProps {
  priceHistory: PricePoint[];
  className?: string;
}

interface TooltipPayload {
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const price = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1c2128] px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-0.5">
        {label ? format(new Date(label), 'MMM d, HH:mm') : ''}
      </p>
      <p className="font-semibold text-emerald-400">YES {formatPercent(price)}</p>
      <p className="text-red-400">NO {formatPercent(1 - price)}</p>
    </div>
  );
}

export function MarketChart({ priceHistory, className }: MarketChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>('1W');

  const data = useMemo(
    () =>
      filterPriceHistory(priceHistory, period).map((p) => ({
        ts: p.timestamp,
        price: p.price,
      })),
    [priceHistory, period]
  );

  const yDomain: [number, number] = useMemo(() => {
    if (!data.length) return [0, 1];
    const prices = data.map((d) => d.price);
    const min = Math.max(0, Math.min(...prices) - 0.05);
    const max = Math.min(1, Math.max(...prices) + 0.05);
    return [min, max];
  }, [data]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">YES Probability</span>
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {CHART_PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                period === p
                  ? 'bg-white/15 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.YES} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.YES} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID}
              vertical={false}
            />
            <XAxis
              dataKey="ts"
              tickFormatter={(ts: number) => format(new Date(ts), 'MMM d')}
              tick={{ fill: '#6e7681', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
              tick={{ fill: '#6e7681', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={CHART_COLORS.YES}
              strokeWidth={2}
              fill="url(#yesGradient)"
              dot={false}
              activeDot={{ r: 3, fill: CHART_COLORS.YES, stroke: 'white', strokeWidth: 1 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
