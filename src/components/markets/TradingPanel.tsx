'use client';

import React, { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { AlertCircle, Loader2, CheckCircle2, Info } from 'lucide-react';
import { cn, calculateShares, calculatePayout, formatCurrency, formatPercent, formatShares } from '@/lib/utils';
import { MIN_TRADE_AMOUNT, MAX_TRADE_AMOUNT, FEE_RATE } from '@/lib/constants';
import type { Market, TradeType, TxState } from '@/lib/types';

interface TradingPanelProps {
  market: Market;
  className?: string;
}

export function TradingPanel({ market, className }: TradingPanelProps) {
  const { isConnected } = useAccount();

  const [side, setSide] = useState<TradeType>('yes');
  const [amountStr, setAmountStr] = useState('');
  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  const amount = parseFloat(amountStr) || 0;
  const price = side === 'yes' ? market.yesPrice : market.noPrice;
  const { shares, fee } = calculateShares(amount, price);
  const payout = calculatePayout(shares);
  const validAmount = amount >= MIN_TRADE_AMOUNT && amount <= MAX_TRADE_AMOUNT;

  const handleTrade = useCallback(async () => {
    if (!validAmount) return;
    setTxState({ status: 'signing' });

    // Simulate transaction flow
    await new Promise((r) => setTimeout(r, 1200));
    setTxState({ status: 'pending', hash: '0xabcdef1234567890' });
    await new Promise((r) => setTimeout(r, 2000));
    setTxState({ status: 'success', hash: '0xabcdef1234567890' });

    setTimeout(() => {
      setTxState({ status: 'idle' });
      setAmountStr('');
    }, 3000);
  }, [validAmount]);

  const disabled =
    !isConnected ||
    !validAmount ||
    market.status !== 'active' ||
    txState.status !== 'idle';

  return (
    <div className={cn('rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4', className)}>
      <h3 className="text-sm font-semibold text-gray-300">Place Trade</h3>

      {/* YES / NO toggle */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setSide('yes')}
          className={cn(
            'py-2 rounded-lg text-sm font-semibold transition-all',
            side === 'yes'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/40'
              : 'text-gray-500 hover:text-gray-300'
          )}
        >
          Buy YES · {formatPercent(market.yesPrice, 0)}
        </button>
        <button
          onClick={() => setSide('no')}
          className={cn(
            'py-2 rounded-lg text-sm font-semibold transition-all',
            side === 'no'
              ? 'bg-red-600/30 text-red-300 border border-red-600/40'
              : 'text-gray-500 hover:text-gray-300'
          )}
        >
          Buy NO · {formatPercent(market.noPrice, 0)}
        </button>
      </div>

      {/* Amount input */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 font-medium">Amount (USDC)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min={MIN_TRADE_AMOUNT}
            max={MAX_TRADE_AMOUNT}
            step="1"
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="w-full pl-7 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">USDC</span>
        </div>
        {/* Quick amounts */}
        <div className="flex gap-1.5">
          {[10, 50, 100, 500].map((v) => (
            <button
              key={v}
              onClick={() => setAmountStr(String(v))}
              className="flex-1 py-1 rounded-lg text-xs text-gray-500 bg-white/5 hover:bg-white/10 hover:text-gray-300 transition-colors"
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Trade details */}
      {amount > 0 && (
        <div className="rounded-xl bg-white/3 border border-white/5 p-3 space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Avg Price</span>
            <span className="text-white">{formatPercent(price)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Est. Shares</span>
            <span className="text-white">{formatShares(shares)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Platform Fee ({Math.round(FEE_RATE * 100)}%)</span>
            <span className="text-white">{formatCurrency(fee)}</span>
          </div>
          <div className="border-t border-white/5 pt-2 flex justify-between font-semibold">
            <span className="text-gray-300">Max Payout</span>
            <span className={side === 'yes' ? 'text-emerald-400' : 'text-red-400'}>
              {formatCurrency(payout)}
            </span>
          </div>
        </div>
      )}

      {/* Info notice */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <Info size={12} className="mt-0.5 shrink-0" />
        <span>1 share = $1 USDC if your outcome is correct at resolution.</span>
      </div>

      {/* Action button */}
      {!isConnected ? (
        <div className="rounded-xl bg-indigo-600/10 border border-indigo-600/20 p-3 text-center text-sm text-indigo-300">
          Connect your wallet to trade
        </div>
      ) : txState.status === 'success' ? (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/10 border border-emerald-600/20 py-3 text-sm text-emerald-400">
          <CheckCircle2 size={16} />
          Trade confirmed!
        </div>
      ) : txState.status === 'error' ? (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-red-600/10 border border-red-600/20 py-3 text-sm text-red-400">
          <AlertCircle size={16} />
          {txState.error ?? 'Transaction failed'}
        </div>
      ) : (
        <button
          onClick={handleTrade}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
            side === 'yes'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          {(txState.status === 'signing' || txState.status === 'pending') && (
            <Loader2 size={14} className="animate-spin" />
          )}
          {txState.status === 'signing'
            ? 'Confirm in wallet…'
            : txState.status === 'pending'
            ? 'Processing…'
            : `Buy ${side.toUpperCase()} · ${formatCurrency(amount)}`}
        </button>
      )}
    </div>
  );
}
