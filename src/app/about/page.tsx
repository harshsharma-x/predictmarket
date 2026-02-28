import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION, EXTERNAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${APP_NAME} — our mission, team, and technology.`,
};

const TEAM = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former quant trader at Two Sigma. Passionate about decentralizing information markets.',
    avatar: 'AC',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Maria Santos',
    role: 'CTO',
    bio: 'Ex-Ethereum core contributor. 8 years building DeFi protocols and smart contract infrastructure.',
    avatar: 'MS',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Jordan Lee',
    role: 'Head of Product',
    bio: 'Previously at Polymarket and Augur. Expert in prediction market UX and mechanism design.',
    avatar: 'JL',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    name: 'Priya Patel',
    role: 'Lead Engineer',
    bio: 'Full-stack engineer specializing in Web3 integrations, smart contract auditing, and scalable systems.',
    avatar: 'PP',
    gradient: 'from-pink-500 to-rose-600',
  },
];

const TECH_STACK = [
  { name: 'Next.js 15', description: 'React framework with App Router', emoji: '⚛️' },
  { name: 'Solidity', description: 'Smart contract language', emoji: '📜' },
  { name: 'Polygon', description: 'Fast, low-cost EVM chain', emoji: '🔷' },
  { name: 'Hardhat', description: 'Ethereum dev environment', emoji: '🔨' },
  { name: 'wagmi + viem', description: 'Type-safe Ethereum hooks', emoji: '🔗' },
  { name: 'RainbowKit', description: 'Best-in-class wallet UX', emoji: '🌈' },
  { name: 'TypeScript', description: 'Type-safe JavaScript', emoji: '🦺' },
  { name: 'Tailwind CSS', description: 'Utility-first styling', emoji: '🎨' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 mb-6 text-3xl">
          🔮
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">{APP_NAME}</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">{APP_DESCRIPTION}</p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-700/30 p-8">
          <h2 className="text-xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We believe that collective intelligence — when properly incentivized — is one of the
            most powerful forecasting tools available. Our mission is to make prediction markets
            accessible to everyone, removing the gatekeepers and putting the tools of informed
            forecasting in everyone&apos;s hands.
          </p>
          <p className="text-gray-400 leading-relaxed">
            By building on Polygon, we can offer near-zero gas fees and instant settlements,
            making it practical to trade even small amounts. We&apos;re committed to transparency,
            open-source development, and decentralization.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM.map(({ name, role, bio, avatar, gradient }) => (
            <div
              key={name}
              className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {avatar}
              </div>
              <div>
                <div className="font-semibold text-white text-sm">{name}</div>
                <div className="text-xs text-indigo-400 mb-2">{role}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECH_STACK.map(({ name, description, emoji }) => (
            <div
              key={name}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="text-sm font-medium text-white mb-0.5">{name}</div>
              <div className="text-xs text-gray-600">{description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Built on Polygon */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-purple-900/20 border border-purple-700/30">
          <div className="text-5xl shrink-0">🔷</div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-bold text-white">Built on Polygon</h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                PoS Mainnet
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              We chose Polygon for its EVM compatibility, near-instant finality, and sub-cent
              gas fees. This makes it possible to trade prediction markets with amounts as small
              as $1 while keeping the full security guarantees of Ethereum&apos;s consensus layer.
            </p>
          </div>
        </div>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Get Involved</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 font-medium transition-colors"
          >
            <Github size={16} /> View on GitHub
          </a>
          <a
            href={EXTERNAL_LINKS.DOCS}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 font-medium transition-colors"
          >
            <ExternalLink size={16} /> Documentation
          </a>
          <Link
            href="/how-it-works"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            How It Works
          </Link>
        </div>
      </section>
    </div>
  );
}
