'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { PortfolioStats } from '@/components/portfolio/PortfolioStats';
import { PositionCard } from '@/components/portfolio/PositionCard';
import { TradeHistory } from '@/components/portfolio/TradeHistory';
import { usePortfolio } from '@/hooks/usePortfolio';
import { cn } from '@/lib/utils';

type Tab = 'active' | 'history' | 'resolved';

const TABS: { id: Tab; label: string }[] = [
  { id: 'active', label: 'Active Positions' },
  { id: 'history', label: 'Trade History' },
  { id: 'resolved', label: 'Resolved' },
];

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { user, positions, trades, loading } = usePortfolio(address);
  const [activeTab, setActiveTab] = useState<Tab>('active');

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto mb-6">
          <Wallet size={24} className="text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h1>
        <p className="text-gray-500 text-sm mb-8">
          Connect your wallet to view your portfolio, positions, and trade history.
        </p>
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
        >
          Browse Markets
        </Link>
      </div>
    );
  }

  const activePositions = positions.filter((p) => p.yesShares > 0 || p.noShares > 0);
  const resolvedPositions = positions.filter(
    (p) => p.currentValue === 0 && p.cost > 0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Portfolio</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your positions and track performance
        </p>
      </div>

      <PortfolioStats user={user} loading={loading} className="mb-8" />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === id
                ? 'bg-white/15 text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'active' && (
        <>
          {activePositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No active positions</h3>
              <p className="text-sm text-gray-500 mb-6">Start trading to build your portfolio.</p>
              <Link
                href="/markets"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                Browse Markets
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activePositions.map((pos) => (
                <PositionCard key={pos.marketId} position={pos} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && <TradeHistory trades={trades} />}

      {activeTab === 'resolved' && (
        <>
          {resolvedPositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No resolved positions</h3>
              <p className="text-sm text-gray-500">Resolved positions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {resolvedPositions.map((pos) => (
                <PositionCard key={pos.marketId} position={pos} resolved />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
