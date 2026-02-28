'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Twitter, Github, MessageCircle } from 'lucide-react';
import { EXTERNAL_LINKS, APP_NAME } from '@/lib/constants';

const PLATFORM_LINKS = [
  { label: 'Markets', href: '/markets' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Activity', href: '/activity' },
];

const RESOURCE_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Documentation', href: EXTERNAL_LINKS.DOCS },
  { label: 'FAQ', href: '/faq' },
  { label: 'Polygon Network', href: 'https://polygon.technology', external: true },
];

const COMMUNITY_LINKS = [
  { label: 'Twitter', href: EXTERNAL_LINKS.TWITTER, icon: <Twitter size={14} />, external: true },
  { label: 'Discord', href: EXTERNAL_LINKS.DISCORD, icon: <MessageCircle size={14} />, external: true },
  { label: 'GitHub', href: EXTERNAL_LINKS.GITHUB, icon: <Github size={14} />, external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0d1117] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              Decentralized prediction markets on Polygon. Trade on real-world outcomes.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Community</h3>
            <ul className="space-y-2.5">
              {COMMUNITY_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {l.icon}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Not financial advice. Trade responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
