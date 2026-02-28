import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'How It Works',
  description: `Learn how ${APP_NAME} prediction markets work — from buying shares to collecting winnings.`,
};

const STEPS = [
  {
    icon: '🔍',
    title: 'Browse Markets',
    description:
      'Explore hundreds of markets across politics, crypto, sports, technology, and more. Each market asks a binary YES/NO question about a future event.',
  },
  {
    icon: '🔗',
    title: 'Connect Your Wallet',
    description:
      'Connect your Web3 wallet (MetaMask, Rainbow, Coinbase Wallet, etc.) and ensure you have USDC on Polygon. We support all major wallets via WalletConnect.',
  },
  {
    icon: '💰',
    title: 'Buy YES or NO Shares',
    description:
      'Choose your position. Each share costs between $0.01 and $0.99 — reflecting the market\'s current probability. Buy YES shares if you think the event will happen, NO shares if you think it won\'t.',
  },
  {
    icon: '📈',
    title: 'Watch the Market Move',
    description:
      'As more traders take positions and new information emerges, prices update in real time. You can sell your shares at any time to lock in gains or cut losses.',
  },
  {
    icon: '🏆',
    title: 'Collect Your Winnings',
    description:
      'When the market resolves, each winning share pays out exactly $1 USDC. If you bought YES at $0.62 and YES resolves, you collect $1 per share — a 61% return.',
  },
];

const FAQS = [
  {
    q: 'What is a prediction market?',
    a: 'A prediction market is a platform where participants buy and sell shares based on the likelihood of future events. Share prices reflect collective probability estimates.',
  },
  {
    q: 'How are markets resolved?',
    a: 'Each market specifies a resolution source (e.g., Reuters, official government websites). Once the event occurs, an oracle or market creator verifies the outcome and resolves the contract.',
  },
  {
    q: 'What is the trading fee?',
    a: 'We charge a 2% fee on each trade. This fee is deducted from your USDC before shares are calculated. The fee funds platform operations and liquidity providers.',
  },
  {
    q: 'Is this real money?',
    a: 'Yes — this platform uses USDC stablecoin on the Polygon network. All trades involve real funds. Only trade what you can afford to lose.',
  },
  {
    q: 'How is the price determined?',
    a: 'Prices are determined by an Automated Market Maker (AMM) using a Logarithmic Market Scoring Rule (LMSR). Prices always sum to $1 across YES and NO outcomes.',
  },
  {
    q: 'Can I sell my shares before resolution?',
    a: 'Yes. You can sell your shares at the current market price at any time before the market resolves, subject to available liquidity.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-white mb-4">How It Works</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {APP_NAME} is a decentralized prediction market. Here&apos;s everything you need to
          know to start trading and earning from your knowledge.
        </p>
      </div>

      {/* What are prediction markets */}
      <section className="mb-16">
        <div className="rounded-2xl bg-indigo-900/20 border border-indigo-700/30 p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            What are Prediction Markets?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Prediction markets are exchange-traded markets created for the purpose of trading the
            outcome of events. The market prices can indicate what the crowd thinks the probability
            of an event is.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Research consistently shows that prediction markets are among the most accurate
            forecasting tools available — more accurate than polls, expert panels, or individual
            analysts. By putting real money on the line, traders are incentivised to research and
            share genuine beliefs.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Step-by-Step Guide
        </h2>
        <div className="space-y-4">
          {STEPS.map(({ icon, title, description }, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
            >
              <div className="text-3xl shrink-0">{icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-900/30 border border-indigo-700/30 px-2 py-0.5 rounded-full">
                    Step {i + 1}
                  </span>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example walkthrough */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Example Walkthrough</h2>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <div className="text-2xl">₿</div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Will Bitcoin reach $120,000 before December 31, 2025?
              </h3>
              <div className="text-xs text-gray-500 mt-0.5">Current YES price: $0.71</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-indigo-900/20 border border-indigo-700/20">
              <div className="text-lg font-bold text-white mb-1">You invest</div>
              <div className="text-2xl font-black text-indigo-400">$100</div>
              <div className="text-xs text-gray-500 mt-1">USDC</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-lg font-bold text-white mb-1">You receive</div>
              <div className="text-2xl font-black text-gray-300">~138</div>
              <div className="text-xs text-gray-500 mt-1">YES shares @ $0.71</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/20">
              <div className="text-lg font-bold text-white mb-1">If correct</div>
              <div className="text-2xl font-black text-emerald-400">$138</div>
              <div className="text-xs text-gray-500 mt-1">+38% return</div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-4 text-center">
            * Assumes 2% platform fee. Past examples do not guarantee future returns.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <details
              key={i}
              className="group rounded-xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium text-gray-200">{q}</span>
                <ChevronDown
                  size={16}
                  className="text-gray-500 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-700/30 p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to start?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Put your knowledge to work and earn from accurate predictions.
          </p>
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-900/40"
          >
            Browse Markets <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
