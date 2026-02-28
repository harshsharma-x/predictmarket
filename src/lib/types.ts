// ── Category Enum ────────────────────────────────────────────────────────────

export enum Category {
  Politics = 'Politics',
  Crypto = 'Crypto',
  Sports = 'Sports',
  Technology = 'Technology',
  Entertainment = 'Entertainment',
  Science = 'Science',
  WorldEvents = 'World Events',
  Finance = 'Finance',
  Culture = 'Culture',
}

// ── Market Status ────────────────────────────────────────────────────────────

export type MarketStatus = 'active' | 'pending' | 'resolved' | 'cancelled';

export type ResolutionOutcome = 'yes' | 'no' | null;

// ── Price History ────────────────────────────────────────────────────────────

export interface PricePoint {
  timestamp: number; // Unix ms
  price: number;     // 0–1 (probability)
  volume?: number;
}

// ── Market ───────────────────────────────────────────────────────────────────

export interface Market {
  id: string;
  question: string;
  description: string;
  category: Category;
  /** Probability of YES outcome, 0–1 */
  yesPrice: number;
  /** Probability of NO outcome, 0–1 */
  noPrice: number;
  /** Total USDC traded */
  volume: number;
  /** Available USDC in the AMM pool */
  liquidity: number;
  /** ISO date string */
  endDate: string;
  /** ISO date string */
  createdAt: string;
  status: MarketStatus;
  resolution: ResolutionOutcome;
  resolutionSource: string;
  tags: string[];
  priceHistory: PricePoint[];
  /** Creator wallet address */
  creator?: string;
  /** On-chain contract address (populated after deployment) */
  contractAddress?: string;
  /** Total number of open positions */
  openInterest?: number;
  /** 24-hour volume change percentage */
  volumeChange24h?: number;
  /** Whether this is a featured/highlighted market */
  featured?: boolean;
}

// ── Trade ────────────────────────────────────────────────────────────────────

export type TradeType = 'yes' | 'no';

export type TradeStatus = 'pending' | 'confirmed' | 'failed';

export interface Trade {
  id: string;
  marketId: string;
  /** Snapshot of market question at trade time */
  marketQuestion?: string;
  type: TradeType;
  /** USDC amount spent */
  amount: number;
  /** Shares received */
  shares: number;
  /** Price per share at execution */
  price: number;
  /** Unix ms */
  timestamp: number;
  status: TradeStatus;
  txHash?: string;
}

// ── Position ─────────────────────────────────────────────────────────────────

export interface Position {
  marketId: string;
  marketQuestion?: string;
  yesShares: number;
  noShares: number;
  /** Total USDC invested */
  cost: number;
  /** Current mark-to-market value in USDC */
  currentValue: number;
  /** Unrealised P&L */
  pnl: number;
  /** P&L as percentage of cost */
  pnlPercent: number;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface User {
  address: string;
  /** USDC balance */
  balance: number;
  positions: Position[];
  trades: Trade[];
  /** Total P&L across all positions */
  totalPnl?: number;
  /** Total volume traded */
  totalVolume?: number;
  /** Number of markets participated in */
  marketsTraded?: number;
}

// ── Order Book ───────────────────────────────────────────────────────────────

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[]; // YES buyers
  asks: OrderBookEntry[]; // NO buyers (YES sellers)
}

// ── Filter & Sort ────────────────────────────────────────────────────────────

export type SortField = 'volume' | 'liquidity' | 'endDate' | 'createdAt' | 'yesPrice';

export type SortDirection = 'asc' | 'desc';

export interface MarketFilters {
  category?: Category | 'All';
  status?: MarketStatus | 'All';
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  featured?: boolean;
}

// ── Notification ─────────────────────────────────────────────────────────────

export type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  variant: NotificationVariant;
  title: string;
  message?: string;
  txHash?: string;
  duration?: number;
}

// ── Web3 / Transaction ───────────────────────────────────────────────────────

export interface TxState {
  status: 'idle' | 'signing' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

// ── Chart ────────────────────────────────────────────────────────────────────

export type ChartPeriod = '1D' | '1W' | '1M' | 'ALL';

export interface ChartConfig {
  period: ChartPeriod;
  showVolume: boolean;
}

// ── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
