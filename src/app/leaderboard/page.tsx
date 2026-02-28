'use client';

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { cn, formatCurrency, formatAddress } from '@/lib/utils';

type Period = 'all' | 'monthly' | 'weekly';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'all', label: 'All Time' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
];

interface Trader {
  rank: number;
  address: string;
  pnl: number;
  winRate: number;
  volume: number;
  trades: number;
}

function generateTraders(seed: number): Trader[] {
  const names = [
    '0x1a2b3c4d5e6f7890',
    '0x9e8f7a6b5c4d3e2f',
    '0x3c4d5e6f7a8b9c0d',
    '0x7a8b9c0d1e2f3a4b',
    '0x2e3f4a5b6c7d8e9f',
    '0x5b6c7d8e9f0a1b2c',
    '0x8e9f0a1b2c3d4e5f',
    '0x0a1b2c3d4e5f6a7b',
    '0x4e5f6a7b8c9d0e1f',
    '0x6a7b8c9d0e1f2a3b',
    '0xc3d4e5f6a7b8c9d0',
    '0xf6a7b8c9d0e1f2a3',
    '0xa9b0c1d2e3f4a5b6',
    '0xd2e3f4a5b6c7d8e9',
    '0x1f2a3b4c5d6e7f8a',
    '0x4c5d6e7f8a9b0c1d',
    '0x7f8a9b0c1d2e3f4c',
    '0xb2c3d4e5f6a7b8c9',
    '0xe5f6a7b8c9d0e1f2',
    '0x2a3b4c5d6e7f8a9b',
  ];

  return names.map((addr, i) => ({
    rank: i + 1,
    address: addr,
    pnl: Math.round((10_000 - i * 450 + (seed % 10) * 100 + Math.sin(i + seed) * 500) * 100) / 100,
    winRate: Math.round(75 - i * 1.5 + (seed % 5)),
    volume: Math.round(50_000 - i * 2_000 + seed * 500),
    trades: Math.round(200 - i * 7 + seed * 3),
  }));
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('all');

  const traders = generateTraders(period === 'all' ? 0 : period === 'monthly' ? 7 : 13);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Trophy size={20} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top traders by profit & loss</p>
        </div>
      </div>

      {/* Period filter */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6">
        {PERIODS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPeriod(id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              period === id
                ? 'bg-white/15 text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Rank</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Trader</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">P&amp;L</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">Win Rate</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">Volume</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">Trades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {traders.map((trader) => (
              <tr
                key={trader.rank}
                className={cn(
                  'hover:bg-white/5 transition-colors',
                  trader.rank <= 3 && 'bg-yellow-900/5'
                )}
              >
                <td className="px-5 py-3.5">
                  <RankBadge rank={trader.rank} />
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-300">
                  {formatAddress(trader.address)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={cn(
                      'font-semibold',
                      trader.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {trader.pnl >= 0 ? '+' : ''}
                    {formatCurrency(trader.pnl)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-gray-300">
                  {trader.winRate}%
                </td>
                <td className="px-5 py-3.5 text-right text-gray-400">
                  {formatCurrency(trader.volume, { compact: true })}
                </td>
                <td className="px-5 py-3.5 text-right text-gray-400">{trader.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-white/5">
          {traders.map((trader) => (
            <div key={trader.rank} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <RankBadge rank={trader.rank} />
                <div>
                  <div className="text-xs font-mono text-gray-300">
                    {formatAddress(trader.address)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {trader.trades} trades · {trader.winRate}% win
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  'text-sm font-semibold',
                  trader.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {trader.pnl >= 0 ? '+' : ''}
                {formatCurrency(trader.pnl)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <span className="text-lg">🥇</span>;
  if (rank === 2)
    return <span className="text-lg">🥈</span>;
  if (rank === 3)
    return <span className="text-lg">🥉</span>;
  return (
    <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white/5 text-xs text-gray-500 font-medium">
      {rank}
    </span>
  );
}
