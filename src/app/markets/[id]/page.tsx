import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Droplets, Users } from 'lucide-react';
import { MarketChart } from '@/components/markets/MarketChart';
import { TradingPanel } from '@/components/markets/TradingPanel';
import { OrderBook } from '@/components/markets/OrderBook';
import { MarketCard } from '@/components/markets/MarketCard';
import { Badge } from '@/components/ui/Badge';
import { getMarketById, MOCK_MARKETS } from '@/lib/mockData';
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatTimeRemaining,
  getCategoryColors,
} from '@/lib/utils';
import { EXTERNAL_LINKS } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const market = getMarketById(id);
  if (!market) return { title: 'Market Not Found' };
  return {
    title: market.question,
    description: market.description,
  };
}

export function generateStaticParams() {
  return MOCK_MARKETS.map((m) => ({ id: m.id }));
}

const MOCK_COMMENTS = [
  {
    user: '0x1a2b...3c4d',
    text: 'Strong signals from the latest FOMC minutes suggest a cut is coming.',
    time: '2h ago',
  },
  {
    user: '0x9e8f...7a6b',
    text: "Inflation still sticky at 3.2%. I'm voting NO on this one.",
    time: '4h ago',
  },
  {
    user: '0x3c4d...5e6f',
    text: 'Historical data shows rates rarely cut this early. Staying bearish.',
    time: '6h ago',
  },
];

export default async function MarketPage({ params }: PageProps) {
  const { id } = await params;
  const market = getMarketById(id);

  if (!market) notFound();

  const categoryColors = getCategoryColors(market.category);
  const related = MOCK_MARKETS.filter(
    (m) => m.category === market.category && m.id !== market.id
  ).slice(0, 3);

  const detailItems = [
    {
      label: 'Resolution Date',
      value: formatDate(market.endDate),
      icon: <Calendar size={14} />,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(market.volume, { compact: true }),
      icon: <DollarSign size={14} />,
    },
    {
      label: 'Liquidity',
      value: formatCurrency(market.liquidity, { compact: true }),
      icon: <Droplets size={14} />,
    },
    {
      label: 'Open Interest',
      value: formatCurrency(market.openInterest ?? 0, { compact: true }),
      icon: <Users size={14} />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back */}
      <Link
        href="/markets"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left (2/3) ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market header */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                className={`${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border text-xs`}
              >
                {market.category}
              </Badge>
              <Badge
                variant={market.status as 'active' | 'pending' | 'resolved' | 'cancelled' | 'default'}
                className="text-xs"
              >
                {market.status}
              </Badge>
              {market.featured && (
                <Badge variant="default" className="text-xs">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6">
              {market.question}
            </h1>

            {/* YES / NO probability */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-emerald-900/20 border border-emerald-700/30 p-4 text-center">
                <div className="text-3xl font-black text-emerald-400">
                  {formatPercent(market.yesPrice, 0)}
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">YES chance</div>
              </div>
              <div className="rounded-xl bg-red-900/20 border border-red-700/30 p-4 text-center">
                <div className="text-3xl font-black text-red-400">
                  {formatPercent(market.noPrice, 0)}
                </div>
                <div className="text-xs text-red-600 mt-1 font-medium">NO chance</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-red-800/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${market.yesPrice * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1.5">
              <span>YES {formatPercent(market.yesPrice, 0)}</span>
              <span>NO {formatPercent(market.noPrice, 0)}</span>
            </div>
          </div>

          {/* Chart */}
          <MarketChart priceHistory={market.priceHistory} />

          {/* Order Book */}
          <OrderBook />

          {/* Description */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">About this Market</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{market.description}</p>

            {market.resolutionSource && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400 font-medium">Resolution source: </span>
                  {market.resolutionSource}
                </p>
              </div>
            )}

            {market.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                {market.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Discussion</h3>
            <div className="space-y-4">
              {MOCK_COMMENTS.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-600/30 shrink-0 flex items-center justify-center text-xs text-indigo-400 font-bold">
                    {c.user.slice(2, 4).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-indigo-400">{c.user}</span>
                      <span className="text-xs text-gray-600">{c.time}</span>
                    </div>
                    <p className="text-sm text-gray-400">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-white/5">
              Connect your wallet to join the discussion.
            </p>
          </div>

          {/* Related markets */}
          {related.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Related Markets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((m) => (
                  <MarketCard key={m.id} market={m} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right sidebar (1/3) ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Trading Panel */}
          <TradingPanel market={market} />

          {/* Market Details */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Market Details</h3>
            <div className="space-y-3">
              {detailItems.map(({ label, value, icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    {icon}
                    <span className="text-xs">{label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">{value}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Time Remaining</span>
                  <span className="text-xs font-medium text-gray-300">
                    {formatTimeRemaining(market.endDate)}
                  </span>
                </div>
              </div>

              {market.contractAddress && (
                <a
                  href={`${EXTERNAL_LINKS.POLYGON_SCAN}/address/${market.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-2"
                >
                  View on Polygonscan <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
