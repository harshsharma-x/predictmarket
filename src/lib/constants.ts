import { Category } from './types';

// ── App Meta ─────────────────────────────────────────────────────────────────

export const APP_NAME = 'PredictMarket';
export const APP_DESCRIPTION = 'Decentralized prediction markets on Polygon';
export const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000';

// ── Chain IDs ─────────────────────────────────────────────────────────────────

export const CHAIN_IDS = {
  POLYGON: 137,
  MUMBAI: 80001,
  HARDHAT: 31337,
} as const;

export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === 'production' ? CHAIN_IDS.POLYGON : CHAIN_IDS.MUMBAI;

// ── Contract Addresses ────────────────────────────────────────────────────────

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.POLYGON]: {
    MARKET_FACTORY: process.env['NEXT_PUBLIC_MARKET_FACTORY_ADDRESS'] ?? '0x0000000000000000000000000000000000000000',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    CONDITIONAL_TOKENS: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
  },
  [CHAIN_IDS.MUMBAI]: {
    MARKET_FACTORY: process.env['NEXT_PUBLIC_MARKET_FACTORY_ADDRESS'] ?? '0x0000000000000000000000000000000000000000',
    USDC: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23',
    CONDITIONAL_TOKENS: '0x0000000000000000000000000000000000000000',
  },
} as const;

// ── Trading Constants ─────────────────────────────────────────────────────────

/** Minimum USDC amount for a trade */
export const MIN_TRADE_AMOUNT = 1;
/** Maximum USDC amount for a single trade */
export const MAX_TRADE_AMOUNT = 100_000;
/** Platform fee in basis points (e.g. 200 = 2%) */
export const FEE_BPS = 200;
/** Fee as a decimal fraction */
export const FEE_RATE = FEE_BPS / 10_000;
/** USDC decimals on Polygon */
export const USDC_DECIMALS = 6;
/** Default slippage tolerance (1%) */
export const DEFAULT_SLIPPAGE_BPS = 100;

// ── Pagination ────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// ── Chart ─────────────────────────────────────────────────────────────────────

export const CHART_PERIODS = ['1D', '1W', '1M', 'ALL'] as const;

export const CHART_COLORS = {
  YES: '#3fb950',
  NO: '#f85149',
  VOLUME: '#3b82f6',
  GRID: '#21262d',
  TOOLTIP_BG: '#1c2128',
} as const;

// ── Categories ────────────────────────────────────────────────────────────────

export const CATEGORIES: Array<{ label: string; value: Category | 'All'; emoji: string }> = [
  { label: 'All Markets', value: 'All', emoji: '🌐' },
  { label: 'Politics',    value: Category.Politics,      emoji: '🏛️' },
  { label: 'Crypto',      value: Category.Crypto,        emoji: '₿' },
  { label: 'Sports',      value: Category.Sports,        emoji: '⚽' },
  { label: 'Technology',  value: Category.Technology,    emoji: '💻' },
  { label: 'Entertainment', value: Category.Entertainment, emoji: '🎬' },
  { label: 'Science',     value: Category.Science,       emoji: '🔬' },
  { label: 'World Events', value: Category.WorldEvents,  emoji: '🌍' },
  { label: 'Finance',     value: Category.Finance,       emoji: '📈' },
  { label: 'Culture',     value: Category.Culture,       emoji: '🎭' },
];

// ── Category Badge Colors ─────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  [Category.Politics]:      { bg: 'bg-red-900/30',    text: 'text-red-400',    border: 'border-red-800/40' },
  [Category.Crypto]:        { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-800/40' },
  [Category.Sports]:        { bg: 'bg-green-900/30',  text: 'text-green-400',  border: 'border-green-800/40' },
  [Category.Technology]:    { bg: 'bg-blue-900/30',   text: 'text-blue-400',   border: 'border-blue-800/40' },
  [Category.Entertainment]: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-800/40' },
  [Category.Science]:       { bg: 'bg-cyan-900/30',   text: 'text-cyan-400',   border: 'border-cyan-800/40' },
  [Category.WorldEvents]:   { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-800/40' },
  [Category.Finance]:       { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  [Category.Culture]:       { bg: 'bg-pink-900/30',   text: 'text-pink-400',   border: 'border-pink-800/40' },
};

// ── Sort Options ──────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { label: 'Highest Volume',  value: 'volume-desc' },
  { label: 'Most Liquidity',  value: 'liquidity-desc' },
  { label: 'Ending Soonest',  value: 'endDate-asc' },
  { label: 'Newest First',    value: 'createdAt-desc' },
  { label: 'Highest YES',     value: 'yesPrice-desc' },
  { label: 'Lowest YES',      value: 'yesPrice-asc' },
] as const;

// ── Navigation ────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Markets',    href: '/markets' },
  { label: 'Portfolio',  href: '/portfolio' },
  { label: 'Activity',   href: '/activity' },
  { label: 'Leaderboard', href: '/leaderboard' },
] as const;

// ── External Links ────────────────────────────────────────────────────────────

export const EXTERNAL_LINKS = {
  POLYGON_SCAN: 'https://polygonscan.com',
  MUMBAI_SCAN: 'https://mumbai.polygonscan.com',
  DOCS: 'https://docs.predictmarket.xyz',
  DISCORD: 'https://discord.gg/predictmarket',
  TWITTER: 'https://twitter.com/predictmarket',
  GITHUB: 'https://github.com/predictmarket',
} as const;

// ── Mock Wallet ───────────────────────────────────────────────────────────────

/** Default mock USDC balance for demo purposes */
export const MOCK_USDC_BALANCE = 10_000;
