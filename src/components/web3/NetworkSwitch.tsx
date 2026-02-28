'use client';

import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_CHAIN_ID } from '@/lib/constants';

interface NetworkSwitchProps {
  className?: string;
}

const CHAIN_NAMES: Record<number, string> = {
  137: 'Polygon Mainnet',
  80001: 'Polygon Mumbai',
  31337: 'Hardhat Local',
};

export function NetworkSwitch({ className }: NetworkSwitchProps) {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const isWrongNetwork = isConnected && chain?.id !== DEFAULT_CHAIN_ID;

  if (!isWrongNetwork) return null;

  const targetName = CHAIN_NAMES[DEFAULT_CHAIN_ID] ?? `Chain ${DEFAULT_CHAIN_ID}`;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-amber-600/30 bg-amber-600/10 px-4 py-3',
        className
      )}
    >
      <AlertTriangle size={16} className="text-amber-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-300">Wrong Network</p>
        <p className="text-xs text-amber-400/70 mt-0.5 truncate">
          Please switch to {targetName}
        </p>
      </div>
      <button
        onClick={() => switchChain({ chainId: DEFAULT_CHAIN_ID })}
        disabled={isPending}
        className="flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold bg-amber-600/20 border border-amber-600/30 text-amber-300 hover:bg-amber-600/30 transition-all disabled:opacity-60"
      >
        <RefreshCw size={11} className={cn(isPending && 'animate-spin')} />
        {isPending ? 'Switching…' : 'Switch'}
      </button>
    </div>
  );
}
