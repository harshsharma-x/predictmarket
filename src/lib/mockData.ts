import { Category, type Market, type MarketStatus } from './types';
import { generatePriceHistory } from './utils';

// ── Helper ────────────────────────────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function market(
  id: string,
  question: string,
  description: string,
  category: Category,
  yesPrice: number,
  volume: number,
  liquidity: number,
  endDays: number,
  createdDaysAgo: number,
  tags: string[],
  resolutionSource: string,
  status: MarketStatus = 'active',
  featured = false,
  resolution: 'yes' | 'no' | null = null
): Market {
  const noPrice = parseFloat((1 - yesPrice).toFixed(4));
  return {
    id,
    question,
    description,
    category,
    yesPrice,
    noPrice,
    volume,
    liquidity,
    endDate: endDays >= 0 ? daysFromNow(endDays) : daysAgo(Math.abs(endDays)),
    createdAt: daysAgo(createdDaysAgo),
    status,
    resolution,
    resolutionSource,
    tags,
    priceHistory: generatePriceHistory(yesPrice, Math.max(createdDaysAgo, 14)),
    featured,
    openInterest: Math.floor(volume * 0.35),
    volumeChange24h: parseFloat(((Math.random() - 0.45) * 30).toFixed(1)),
  };
}

// ── Mock Markets (25+) ────────────────────────────────────────────────────────

export const MOCK_MARKETS: Market[] = [
  // ── Politics ──────────────────────────────────────────────────────────────
  market(
    'pol-001',
    'Will the US Federal Reserve cut interest rates in Q3 2025?',
    'Resolves YES if the Federal Reserve announces at least one rate cut during the July–September 2025 FOMC meetings. Resolution source: official FOMC press release.',
    Category.Politics,
    0.62,
    1_840_000,
    520_000,
    72,
    45,
    ['fed', 'interest-rates', 'monetary-policy', 'usa'],
    'Federal Reserve official press release (federalreserve.gov)',
    'active',
    true
  ),

  market(
    'pol-002',
    'Will the EU pass the AI Liability Directive before end of 2025?',
    'Resolves YES if the European Parliament formally adopts the AI Liability Directive and it is published in the Official Journal of the EU by December 31, 2025.',
    Category.Politics,
    0.38,
    620_000,
    210_000,
    190,
    30,
    ['eu', 'ai-regulation', 'legislation', 'europe'],
    'Official Journal of the European Union',
    'active'
  ),

  market(
    'pol-003',
    'Will Narendra Modi win the 2024 Indian general election?',
    'Resolves YES if the BJP-led NDA coalition secures a majority in the 2024 Lok Sabha election and Narendra Modi is sworn in as Prime Minister.',
    Category.Politics,
    0.92,
    3_200_000,
    890_000,
    -10,
    60,
    ['india', 'election', 'modi', 'bjp'],
    'Election Commission of India (eci.gov.in)',
    'resolved',
    true,
    'yes'
  ),

  market(
    'pol-004',
    'Will there be a snap election in the UK before October 2025?',
    'Resolves YES if the UK Prime Minister calls a general election and polling day is scheduled before October 1, 2025.',
    Category.Politics,
    0.15,
    290_000,
    98_000,
    120,
    22,
    ['uk', 'election', 'parliament', 'britain'],
    'UK Electoral Commission announcement'
  ),

  // ── Crypto ────────────────────────────────────────────────────────────────
  market(
    'cry-001',
    'Will Bitcoin reach $120,000 before December 31, 2025?',
    'Resolves YES if BTC/USD trades at or above $120,000 on any major exchange (Coinbase, Binance, or Kraken) for at least 1 minute before the end of 2025.',
    Category.Crypto,
    0.71,
    5_600_000,
    1_800_000,
    210,
    55,
    ['bitcoin', 'btc', 'price', 'all-time-high'],
    'CoinGecko BTC/USD price feed (coingecko.com)',
    'active',
    true
  ),

  market(
    'cry-002',
    'Will Ethereum ETF see over $1B net inflows in its first month?',
    'Resolves YES if the cumulative net inflows into US-listed Ethereum spot ETFs exceed $1 billion within 30 calendar days of the first product launching.',
    Category.Crypto,
    0.58,
    2_100_000,
    760_000,
    45,
    18,
    ['ethereum', 'eth', 'etf', 'institutional'],
    'Bloomberg ETF data / SEC filings',
    'active',
    true
  ),

  market(
    'cry-003',
    'Will Solana flip Ethereum by market cap in 2025?',
    'Resolves YES if SOL market cap exceeds ETH market cap on CoinGecko for 24+ consecutive hours any time before December 31, 2025.',
    Category.Crypto,
    0.12,
    980_000,
    340_000,
    250,
    40,
    ['solana', 'sol', 'ethereum', 'eth', 'market-cap', 'flippening'],
    'CoinGecko market cap rankings'
  ),

  market(
    'cry-004',
    'Will XRP win its SEC lawsuit definitively by mid-2025?',
    'Resolves YES if a US federal court issues a final judgment fully in favour of Ripple/XRP holders with no material securities violation finding before July 1, 2025.',
    Category.Crypto,
    0.45,
    1_450_000,
    490_000,
    30,
    90,
    ['xrp', 'ripple', 'sec', 'lawsuit', 'regulation'],
    'Official US District Court SDNY docket'
  ),

  market(
    'cry-005',
    'Will a new layer-1 blockchain enter the top 10 by market cap in 2025?',
    'Resolves YES if any blockchain project not currently in the top 10 by market cap (as of Jan 1, 2025) enters the top 10 on CoinGecko and sustains that position for 7+ days.',
    Category.Crypto,
    0.33,
    410_000,
    155_000,
    230,
    28,
    ['layer1', 'altcoin', 'market-cap', 'crypto'],
    'CoinGecko top-10 rankings'
  ),

  // ── Sports ────────────────────────────────────────────────────────────────
  market(
    'spt-001',
    'Will Manchester City win the UEFA Champions League 2024/25?',
    'Resolves YES if Manchester City FC lifts the UEFA Champions League trophy in the 2024/25 season final.',
    Category.Sports,
    0.22,
    1_100_000,
    380_000,
    60,
    35,
    ['man-city', 'champions-league', 'football', 'soccer', 'uefa'],
    'UEFA official results (uefa.com)',
    'active',
    true
  ),

  market(
    'spt-002',
    'Will the Golden State Warriors make the 2025 NBA Playoffs?',
    'Resolves YES if the Golden State Warriors qualify for the 2024-25 NBA Playoffs (either via play-in or direct seed).',
    Category.Sports,
    0.55,
    680_000,
    220_000,
    90,
    25,
    ['nba', 'warriors', 'basketball', 'playoffs'],
    'NBA official standings (nba.com)'
  ),

  market(
    'spt-003',
    'Will Novak Djokovic win Wimbledon 2025?',
    'Resolves YES if Novak Djokovic wins the 2025 Wimbledon Championships Men\'s Singles title.',
    Category.Sports,
    0.41,
    740_000,
    260_000,
    100,
    15,
    ['djokovic', 'wimbledon', 'tennis', 'grand-slam'],
    'Wimbledon official results (wimbledon.com)'
  ),

  market(
    'spt-004',
    'Will Formula 1 have a new World Champion in 2025?',
    'Resolves YES if anyone other than Max Verstappen wins the 2025 FIA Formula 1 World Drivers\' Championship.',
    Category.Sports,
    0.47,
    890_000,
    310_000,
    270,
    50,
    ['f1', 'formula1', 'verstappen', 'world-champion'],
    'FIA official F1 results (fia.com)'
  ),

  // ── Technology ────────────────────────────────────────────────────────────
  market(
    'tec-001',
    'Will OpenAI release GPT-5 publicly before July 2025?',
    'Resolves YES if OpenAI releases a model publicly branded as "GPT-5" (not GPT-4 turbo or variants) with a public API or product access before July 1, 2025.',
    Category.Technology,
    0.54,
    2_800_000,
    940_000,
    55,
    42,
    ['openai', 'gpt5', 'ai', 'llm', 'chatgpt'],
    'OpenAI official blog (openai.com)',
    'active',
    true
  ),

  market(
    'tec-002',
    'Will Apple release an AI-native iPhone model in 2025?',
    'Resolves YES if Apple announces at its annual September event an iPhone model with dedicated on-device AI neural processing marketed as a primary feature.',
    Category.Technology,
    0.78,
    1_600_000,
    560_000,
    150,
    38,
    ['apple', 'iphone', 'ai', 'hardware', 'mobile'],
    'Apple official press release (apple.com/newsroom)'
  ),

  market(
    'tec-003',
    'Will Google DeepMind achieve AGI milestone announcement in 2025?',
    'Resolves YES if Google DeepMind publicly announces achieving a broadly accepted AGI (Artificial General Intelligence) milestone as evaluated by independent AI safety researchers.',
    Category.Technology,
    0.08,
    340_000,
    120_000,
    280,
    20,
    ['google', 'deepmind', 'agi', 'ai-safety'],
    'Peer-reviewed publication or Google DeepMind official announcement'
  ),

  market(
    'tec-004',
    'Will a major US tech company go private (buyout) in 2025?',
    'Resolves YES if any company currently in the NASDAQ-100 announces and closes a take-private leveraged buyout deal in calendar year 2025.',
    Category.Technology,
    0.19,
    520_000,
    175_000,
    240,
    32,
    ['tech', 'private-equity', 'buyout', 'nasdaq'],
    'SEC M&A filings / Bloomberg financial news'
  ),

  // ── Entertainment ─────────────────────────────────────────────────────────
  market(
    'ent-001',
    'Will "Dune: Part Three" be officially greenlit by end of 2025?',
    'Resolves YES if Legendary Entertainment and Warner Bros. officially announce Dune: Part Three with a confirmed production start date by December 31, 2025.',
    Category.Entertainment,
    0.67,
    420_000,
    145_000,
    200,
    12,
    ['dune', 'film', 'warner-bros', 'sci-fi'],
    'Official Legendary/WB press announcement or Variety/Deadline report'
  ),

  market(
    'ent-002',
    'Will the 2025 Oscars Best Picture go to a streaming-first film?',
    'Resolves YES if the 97th Academy Awards Best Picture winner was primarily released on a streaming platform (Netflix, Amazon, Apple TV+) before theatrical.',
    Category.Entertainment,
    0.36,
    310_000,
    105_000,
    20,
    65,
    ['oscars', 'academy-awards', 'streaming', 'film'],
    'Academy of Motion Picture Arts and Sciences official results'
  ),

  market(
    'ent-003',
    'Will Taylor Swift\'s Eras Tour gross over $2B total?',
    'Resolves YES if Taylor Swift\'s The Eras Tour is confirmed by Billboard Boxscore or Pollstar to have grossed over $2 billion USD in total ticket sales.',
    Category.Entertainment,
    0.88,
    750_000,
    280_000,
    80,
    80,
    ['taylor-swift', 'eras-tour', 'concert', 'music'],
    'Billboard Boxscore / Pollstar official tour grossing data',
    'active',
    true
  ),

  // ── Science ───────────────────────────────────────────────────────────────
  market(
    'sci-001',
    'Will SpaceX successfully land humans on the Moon before 2027?',
    'Resolves YES if SpaceX\'s Starship HLS completes a crewed lunar landing mission with NASA astronauts touching the lunar surface before January 1, 2027.',
    Category.Science,
    0.29,
    1_200_000,
    410_000,
    560,
    75,
    ['spacex', 'nasa', 'moon', 'artemis', 'starship'],
    'NASA official mission status report (nasa.gov)',
    'active',
    true
  ),

  market(
    'sci-002',
    'Will a fusion energy company produce net energy gain commercially in 2025?',
    'Resolves YES if any private fusion company (Commonwealth Fusion, TAE, Helion, etc.) publicly demonstrates sustained net energy gain in a commercially relevant reactor.',
    Category.Science,
    0.06,
    280_000,
    95_000,
    310,
    18,
    ['fusion', 'energy', 'climate', 'science'],
    'Peer-reviewed publication in Nature / Science journal'
  ),

  market(
    'sci-003',
    'Will NASA\'s Europa Clipper detect signs of life on Europa?',
    'Resolves YES if NASA announces peer-reviewed findings from Europa Clipper indicating probable biosignatures or confirmed organic chemistry consistent with life on Jupiter\'s moon Europa.',
    Category.Science,
    0.04,
    190_000,
    68_000,
    1000,
    10,
    ['nasa', 'europa', 'astrobiology', 'space', 'jupiter'],
    'NASA official scientific publication'
  ),

  // ── World Events ──────────────────────────────────────────────────────────
  market(
    'wld-001',
    'Will there be a formal ceasefire agreement in Ukraine before end of 2025?',
    'Resolves YES if Ukraine and Russia sign a formal, internationally recognised ceasefire agreement (not unilateral pause) before December 31, 2025.',
    Category.WorldEvents,
    0.24,
    2_900_000,
    870_000,
    200,
    120,
    ['ukraine', 'russia', 'war', 'ceasefire', 'peace'],
    'United Nations Security Council official documentation',
    'active',
    true
  ),

  market(
    'wld-002',
    'Will global average temperature in 2025 set a new record?',
    'Resolves YES if the Copernicus Climate Change Service reports 2025 as the warmest year on record globally, exceeding the 2023 record.',
    Category.WorldEvents,
    0.73,
    680_000,
    235_000,
    300,
    88,
    ['climate', 'temperature', 'record', 'global-warming'],
    'Copernicus Climate Change Service annual report (climate.copernicus.eu)'
  ),

  market(
    'wld-003',
    'Will BRICS expand to include Saudi Arabia as full member in 2025?',
    'Resolves YES if Saudi Arabia officially ratifies full BRICS membership (not observer status) and participates in the 2025 BRICS summit as a full member.',
    Category.WorldEvents,
    0.61,
    390_000,
    138_000,
    180,
    45,
    ['brics', 'saudi-arabia', 'geopolitics', 'emerging-markets'],
    'BRICS official summit declaration / Saudi government announcement'
  ),

  // ── Finance ───────────────────────────────────────────────────────────────
  market(
    'fin-001',
    'Will the S&P 500 reach 6,500 before end of 2025?',
    'Resolves YES if the S&P 500 index closes at or above 6,500 points on any trading day before December 31, 2025.',
    Category.Finance,
    0.65,
    1_750_000,
    590_000,
    200,
    55,
    ['sp500', 'stocks', 'equities', 'usa', 'market'],
    'NYSE / Bloomberg official closing price data',
    'active',
    true
  ),

  market(
    'fin-002',
    'Will US CPI inflation drop below 2.5% year-over-year by Q4 2025?',
    'Resolves YES if the US Bureau of Labor Statistics reports a CPI year-over-year reading below 2.5% for any month in Q4 2025 (Oct/Nov/Dec).',
    Category.Finance,
    0.48,
    920_000,
    320_000,
    270,
    60,
    ['inflation', 'cpi', 'fed', 'economics', 'usa'],
    'US Bureau of Labor Statistics CPI release (bls.gov)'
  ),

  // ── Culture ───────────────────────────────────────────────────────────────
  market(
    'cul-001',
    'Will a video game adaptation win an Emmy in 2025?',
    'Resolves YES if a television or streaming show adapted from a video game IP wins a Primetime Emmy Award at the 2025 Emmy ceremony.',
    Category.Culture,
    0.52,
    210_000,
    78_000,
    250,
    22,
    ['emmys', 'video-games', 'tv', 'entertainment', 'hbo'],
    'Television Academy official Emmy results (emmys.com)'
  ),

  market(
    'cul-002',
    'Will the 2026 FIFA World Cup set a new global viewership record?',
    'Resolves YES if FIFA officially announces that the 2026 World Cup (USA/Canada/Mexico) achieved higher cumulative global viewership than the 2022 Qatar World Cup (5.0 billion viewers).',
    Category.Culture,
    0.81,
    560_000,
    195_000,
    430,
    30,
    ['fifa', 'world-cup', 'football', 'soccer', '2026'],
    'FIFA official media report'
  ),
];

// ── Featured Markets ──────────────────────────────────────────────────────────

export const FEATURED_MARKET_IDS = MOCK_MARKETS
  .filter((m) => m.featured)
  .map((m) => m.id);

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getMarketById(id: string): Market | undefined {
  return MOCK_MARKETS.find((m) => m.id === id);
}

export function getMarketsByCategory(category: Category): Market[] {
  return MOCK_MARKETS.filter((m) => m.category === category);
}

export function getActiveMarkets(): Market[] {
  return MOCK_MARKETS.filter((m) => m.status === 'active');
}

export function getFeaturedMarkets(): Market[] {
  return MOCK_MARKETS.filter((m) => m.featured && m.status === 'active');
}
