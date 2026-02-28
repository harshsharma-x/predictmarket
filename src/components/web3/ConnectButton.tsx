'use client';

import React from 'react';
import Image from 'next/image';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className }: ConnectButtonProps) {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain: rainbowChain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && rainbowChain;

        return (
          <div
            className={cn(!ready && 'opacity-0 pointer-events-none select-none', className)}
            aria-hidden={!ready}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/30"
              >
                Connect Wallet
              </button>
            ) : rainbowChain.unsupported ? (
              <button
                onClick={openChainModal}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-all"
              >
                <WifiOff size={14} />
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Network button */}
                <button
                  onClick={openChainModal}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  {rainbowChain.hasIcon && rainbowChain.iconUrl && (
                    <Image
                      alt={rainbowChain.name ?? 'Chain'}
                      src={rainbowChain.iconUrl}
                      width={14}
                      height={14}
                      className="rounded-full"
                    />
                  )}
                  <Wifi size={11} className="text-emerald-400" />
                </button>

                {/* Account button */}
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  {/* Avatar */}
                  {account.hasPendingTransactions ? (
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-600/50 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
                      {account.displayName?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  )}
                  <span className="hidden xs:block">{account.displayName}</span>
                  {account.displayBalance && (
                    <span className="hidden md:block text-xs text-gray-500">
                      {account.displayBalance}
                    </span>
                  )}
                  <ChevronDown size={12} className="text-gray-500" />
                </button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
