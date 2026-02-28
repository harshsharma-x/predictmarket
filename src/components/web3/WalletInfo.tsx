'use client';

import React, { useState } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { Copy, Check, LogOut, ExternalLink } from 'lucide-react';
import { cn, formatAddress } from '@/lib/utils';
import { EXTERNAL_LINKS } from '@/lib/constants';

interface WalletInfoProps {
  className?: string;
}

export function WalletInfo({ className }: WalletInfoProps) {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  if (!address) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = chain?.blockExplorers?.default?.url
    ? `${chain.blockExplorers.default.url}/address/${address}`
    : `${EXTERNAL_LINKS.POLYGON_SCAN}/address/${address}`;

  const usdcBalance = balance
    ? parseFloat(balance.formatted).toFixed(2)
    : '—';

  return (
    <div className={cn('rounded-2xl bg-white/5 border border-white/10 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/3">
        <p className="text-xs text-gray-400 font-medium">Connected Wallet</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Address */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Address</p>
            <p className="text-sm font-mono text-gray-200">{formatAddress(address, 6)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Copy address"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="View on explorer"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Balance */}
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Balance</p>
          <p className="text-sm font-semibold text-white">
            {usdcBalance} {balance?.symbol ?? 'MATIC'}
          </p>
        </div>

        {/* Network */}
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Network</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-sm text-gray-200">{chain?.name ?? 'Unknown'}</p>
          </div>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => disconnect()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600/10 border border-red-600/20 text-sm text-red-400 hover:bg-red-600/20 transition-colors mt-1"
        >
          <LogOut size={13} />
          Disconnect
        </button>
      </div>
    </div>
  );
}
