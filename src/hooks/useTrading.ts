'use client';

import { useState, useCallback } from 'react';
import { calculateShares, estimatePriceImpact, sleep } from '@/lib/utils';
import { FEE_RATE, MIN_TRADE_AMOUNT, MAX_TRADE_AMOUNT } from '@/lib/constants';
import type { Market, TradeType, TxState, Trade } from '@/lib/types';

interface TradeParams {
  market: Market;
  type: TradeType;
  amount: number;
}

interface TradePreview {
  shares: number;
  fee: number;
  price: number;
  payout: number;
  priceImpact: number;
  newYesPrice: number;
}

interface UseTradingReturn {
  txState: TxState;
  executeTrade: (params: TradeParams) => Promise<Trade | null>;
  getTradePreview: (params: Pick<TradeParams, 'market' | 'type' | 'amount'>) => TradePreview;
  reset: () => void;
}

function generateTxHash(): string {
  const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hash}`;
}

export function useTrading(): UseTradingReturn {
  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  const getTradePreview = useCallback(
    ({ market, type, amount }: Pick<TradeParams, 'market' | 'type' | 'amount'>): TradePreview => {
      const price = type === 'yes' ? market.yesPrice : market.noPrice;
      const { shares, fee } = calculateShares(amount, price, FEE_RATE);
      const payout = shares; // 1 share = $1 on resolution
      const newYesPrice = estimatePriceImpact(market.yesPrice, amount, market.liquidity);
      const priceImpact = Math.abs(newYesPrice - market.yesPrice) / market.yesPrice;

      return { shares, fee, price, payout, priceImpact, newYesPrice };
    },
    []
  );

  const executeTrade = useCallback(
    async ({ market, type, amount }: TradeParams): Promise<Trade | null> => {
      if (amount < MIN_TRADE_AMOUNT || amount > MAX_TRADE_AMOUNT) return null;
      if (market.status !== 'active') return null;

      try {
        setTxState({ status: 'signing' });
        await sleep(1000);

        const txHash = generateTxHash();
        setTxState({ status: 'pending', hash: txHash });
        await sleep(2000);

        const price = type === 'yes' ? market.yesPrice : market.noPrice;
        const { shares, fee } = calculateShares(amount, price, FEE_RATE);

        const trade: Trade = {
          id: `trade-${Date.now()}`,
          marketId: market.id,
          marketQuestion: market.question,
          type,
          amount,
          shares,
          price,
          timestamp: Date.now(),
          status: 'confirmed',
          txHash,
        };

        setTxState({ status: 'success', hash: txHash });
        void fee; // acknowledged but not needed in return
        return trade;
      } catch {
        setTxState({ status: 'error', error: 'Transaction failed' });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => setTxState({ status: 'idle' }), []);

  return { txState, executeTrade, getTradePreview, reset };
}
