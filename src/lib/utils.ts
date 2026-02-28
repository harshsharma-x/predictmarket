import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isPast, differenceInDays } from 'date-fns';
import type { Category, Market, PricePoint } from './types';
import { CATEGORY_COLORS, FEE_RATE } from './constants';

// ── Tailwind Merge ────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Number Formatting ─────────────────────────────────────────────────────────

/** Format a USDC / dollar amount with compact notation for large values */
export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: number; symbol?: string } = {}
): string {
  const { compact = false, decimals = 2, symbol = '$' } = options;

  if (compact && Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(1)}K`;
  }

  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Format a probability (0–1) as a percentage string */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format a share count */
export function formatShares(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

/** Format a wallet address to shortened form */
export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/** Format a number with + sign for positive values */
export function formatPnl(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
}

// ── Date Formatting ───────────────────────────────────────────────────────────

/** "3 days left" or "Ended 2 days ago" */
export function formatTimeRemaining(dateString: string): string {
  const date = new Date(dateString);
  if (isPast(date)) {
    return `Ended ${formatDistanceToNow(date, { addSuffix: false })} ago`;
  }
  return `${formatDistanceToNow(date)} left`;
}

/** "Jan 15, 2025" */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

/** "Jan 15, 2025 at 3:00 PM" */
export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
}

/** "Jan 15" */
export function formatShortDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d');
}

/** Returns true if the market ends within N days */
export function isEndingSoon(dateString: string, withinDays = 3): boolean {
  const date = new Date(dateString);
  const days = differenceInDays(date, new Date());
  return days >= 0 && days <= withinDays;
}

/** Returns true if the market has ended */
export function hasEnded(dateString: string): boolean {
  return isPast(new Date(dateString));
}

// ── Probability / Pricing ─────────────────────────────────────────────────────

/** LMSR-style price impact estimate. Returns new yesPrice after trade. */
export function estimatePriceImpact(
  currentYesPrice: number,
  tradeAmountUSDC: number,
  liquidity: number
): number {
  if (liquidity <= 0) return currentYesPrice;
  const impact = (tradeAmountUSDC / (liquidity + tradeAmountUSDC)) * 0.1;
  return Math.min(0.99, Math.max(0.01, currentYesPrice + impact));
}

/** Calculate shares received for a given USDC amount */
export function calculateShares(
  amount: number,
  price: number,
  feeRate = FEE_RATE
): { shares: number; fee: number; net: number } {
  const fee = amount * feeRate;
  const net = amount - fee;
  const shares = price > 0 ? net / price : 0;
  return { shares, fee, net };
}

/** Expected payout if prediction is correct */
export function calculatePayout(shares: number): number {
  return shares; // 1 share = $1 USDC on resolution
}

/** Return on investment percentage */
export function calculateROI(cost: number, currentValue: number): number {
  if (cost <= 0) return 0;
  return ((currentValue - cost) / cost) * 100;
}

// ── Category Helpers ──────────────────────────────────────────────────────────

export function getCategoryColors(category: Category) {
  return CATEGORY_COLORS[category] ?? {
    bg: 'bg-gray-900/30',
    text: 'text-gray-400',
    border: 'border-gray-800/40',
  };
}

// ── Market Helpers ────────────────────────────────────────────────────────────

/** Compute the market's trending score (higher = more trending) */
export function getTrendingScore(market: Market): number {
  const recencyBoost = Math.max(
    0,
    1 - differenceInDays(new Date(), new Date(market.createdAt)) / 30
  );
  return market.volume * (1 + recencyBoost) + market.liquidity * 0.5;
}

/** Filter price history to a given period */
export function filterPriceHistory(
  history: PricePoint[],
  period: '1D' | '1W' | '1M' | 'ALL'
): PricePoint[] {
  const now = Date.now();
  const cutoffs: Record<typeof period, number> = {
    '1D': now - 86_400_000,
    '1W': now - 7 * 86_400_000,
    '1M': now - 30 * 86_400_000,
    ALL: 0,
  };
  const cutoff = cutoffs[period];
  return history.filter((p) => p.timestamp >= cutoff);
}

// ── Price History Generation ──────────────────────────────────────────────────

/** Generate synthetic price history for demo markets */
export function generatePriceHistory(
  currentPrice: number,
  days = 30,
  volatility = 0.05
): PricePoint[] {
  const points: PricePoint[] = [];
  const now = Date.now();
  let price = currentPrice + (Math.random() - 0.5) * 0.3;
  price = Math.min(0.97, Math.max(0.03, price));

  const intervals = days * 6; // every 4 hours
  const step = (days * 86_400_000) / intervals;

  for (let i = 0; i <= intervals; i++) {
    const drift = (currentPrice - price) * 0.02;
    const noise = (Math.random() - 0.5) * volatility;
    price = Math.min(0.97, Math.max(0.03, price + drift + noise));

    points.push({
      timestamp: now - (intervals - i) * step,
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 50_000 + 5_000),
    });
  }

  return points;
}

// ── Validation ────────────────────────────────────────────────────────────────

export function isValidAmount(amount: number, min = 1, max = 100_000): boolean {
  return Number.isFinite(amount) && amount >= min && amount <= max;
}

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

// ── Misc ──────────────────────────────────────────────────────────────────────

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Sleep for N ms */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Generate a deterministic ID from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncate a string to maxLen with ellipsis */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}
