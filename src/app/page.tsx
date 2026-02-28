import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Zap, Globe, ChevronRight, ArrowRight } from 'lucide-react';
import { MarketCard } from '@/components/markets/MarketCard';
import { getFeaturedMarkets, MOCK_MARKETS } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} — Trade on the Future`,
  description: APP_DESCRIPTION,
};

const STATS = [
  { label: 'Total Volume', value: formatCurrency(24_800_000, { compact: true }) },
  { label: 'Active Markets', value: String(MOCK_MARKETS.filter((m) => m.status === 'active').length) },
  { label: 'Total Traders', value: '12,847' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Find a Market',
    description: 'Browse hundreds of markets across politics, crypto, sports, and more.',
    icon: '🔍',
  },
  {
    step: '02',
    title: 'Buy Shares',
    description: 'Buy YES or NO shares with USDC. Each share pays $1 if correct.',
    icon: '💰',
  },
  {
    step: '03',
    title: 'Collect Winnings',
    description: 'When the market resolves, claim your payout automatically.',
    icon: '🏆',
  },
];

const ACTIVITY = [
  { user: '0x1a2b...3c4d', action: 'Bought YES', market: 'Will Bitcoin reach $120k?', amount: '$500', time: '2m ago' },
  { user: '0x9e8f...7a6b', action: 'Bought NO', market: 'Will OpenAI release GPT-5?', amount: '$200', time: '5m ago' },
  { user: '0x3c4d...5e6f', action: 'Bought YES', market: 'Will Fed cut rates in Q3?', amount: '$1,000', time: '9m ago' },
  { user: '0x7a8b...9c0d', action: 'Bought NO', market: 'Will Man City win UCL?', amount: '$350', time: '12m ago' },
  { user: '0x2e3f...4a5b', action: 'Bought YES', market: 'Will S&P 500 hit 6,500?', amount: '$750', time: '18m ago' },
];

export default function HomePage() {
  const featured = getFeaturedMarkets().slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-indigo-950/30 via-dark-bg to-dark-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Zap size={12} />
            Powered by Polygon
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Trade on the Future,
            <br />
            Profit from Knowledge
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Decentralized prediction markets where your insights become profit. Buy YES or NO
            shares on real-world events and earn when you&apos;re right.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/markets"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-900/40"
            >
              Start Trading <ArrowRight size={16} />
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold text-sm transition-colors"
            >
              How it Works
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mx-auto max-w-4xl px-4 pb-12">
          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white/5 border border-white/10 p-6">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Markets ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Markets</h2>
            <p className="text-sm text-gray-500 mt-1">Top markets by volume and activity</p>
          </div>
          <Link
            href="/markets"
            className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {featured.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.filter((c) => c.value !== 'All').map(({ label, value, emoji }) => (
              <Link
                key={String(value)}
                href={`/markets?category=${encodeURIComponent(String(value))}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
          <p className="text-sm text-gray-500 mt-2">Start trading in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, title, description, icon }) => (
            <div
              key={step}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none">
                {step}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Learn more about prediction markets <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Recent Activity ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-2 mb-8">
            <Globe size={16} className="text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden">
            {ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center shrink-0">
                    <TrendingUp size={12} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-indigo-400">{item.user}</span>
                    <span className="text-xs text-gray-500 mx-1.5">{item.action} on</span>
                    <span className="text-xs text-gray-300 truncate">{item.market}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs font-semibold text-emerald-400">{item.amount}</span>
                  <span className="text-xs text-gray-600">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to trade?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of traders using their knowledge to profit from real-world outcomes.
          </p>
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-900/40"
          >
            Browse Markets <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
