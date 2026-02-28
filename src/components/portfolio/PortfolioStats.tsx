'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Activity, Award, DollarSign } from 'lucide-react';
import { cn, formatCurrency, formatPercent, formatPnl } from '@/lib/utils';
import { StatSkeleton } from '@/components/ui/Skeleton';
import type { User } from '@/lib/types';

interface PortfolioStatsProps {
  user?: User | null;
  loading?: boolean;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  accent?: 'default' | 'green' | 'red' | 'indigo' | 'yellow';
}

function StatCard({ label, value, subtext, icon, accent = 'default' }: StatCardProps) {
  const accentBg = {
    default: 'bg-white/5',
    green:   'bg-emerald-900/20',
    red:     'bg-red-900/20',
    indigo:  'bg-indigo-900/20',
    yellow:  'bg-yellow-900/20',
  }[accent];

  const iconColor = {
    default: 'text-gray-400',
    green:   'text-emerald-400',
    red:     'text-red-400',
    indigo:  'text-indigo-400',
    yellow:  'text-yellow-400',
  }[accent];

  return (
    <div className={cn('rounded-2xl border border-white/10 p-4', accentBg)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <span className={cn('p-1.5 rounded-lg bg-white/5', iconColor)}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white leading-none mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );
}

export function PortfolioStats({ user, loading = false, className }: PortfolioStatsProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-5 gap-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-5 gap-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-center h-24">
            <p className="text-xs text-gray-600">—</p>
          </div>
        ))}
      </div>
    );
  }

  const totalValue = user.positions.reduce((s, p) => s + p.currentValue, 0) + user.balance;
  const totalPnl = user.totalPnl ?? user.positions.reduce((s, p) => s + p.pnl, 0);
  const pnlNonNegative = totalPnl >= 0;

  const resolvedTrades = user.trades.filter((t) => t.status === 'confirmed');
  const winningTrades = resolvedTrades.filter((t) => {
    // Simplified: treat positive-priced YES trades as wins if price was < 0.5
    return t.price < 0.5;
  });
  const winRate = resolvedTrades.length > 0 ? winningTrades.length / resolvedTrades.length : 0;

  const claimable = user.positions
    .filter((p) => p.pnl > 0)
    .reduce((s, p) => s + p.currentValue, 0);

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-5 gap-3', className)}>
      <StatCard
        label="Portfolio Value"
        value={formatCurrency(totalValue, { compact: true })}
        subtext={`${formatCurrency(user.balance, { compact: true })} available`}
        icon={<Wallet size={14} />}
        accent="indigo"
      />
      <StatCard
        label="Total P&L"
        value={formatPnl(totalPnl)}
        subtext={`${pnlNonNegative ? '▲' : '▼'} all time`}
        icon={pnlNonNegative ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        accent={pnlNonNegative ? 'green' : 'red'}
      />
      <StatCard
        label="Win Rate"
        value={formatPercent(winRate, 0)}
        subtext={`${resolvedTrades.length} resolved trades`}
        icon={<Award size={14} />}
        accent="yellow"
      />
      <StatCard
        label="Active Positions"
        value={String(user.positions.filter((p) => p.yesShares > 0 || p.noShares > 0).length)}
        subtext={`${user.marketsTraded ?? user.trades.length} markets traded`}
        icon={<Activity size={14} />}
      />
      <StatCard
        label="Claimable"
        value={formatCurrency(claimable, { compact: true })}
        subtext="Winning positions"
        icon={<DollarSign size={14} />}
        accent={claimable > 0 ? 'green' : 'default'}
      />
    </div>
  );
}
