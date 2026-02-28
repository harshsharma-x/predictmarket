'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Markets',   href: '/markets',   icon: BarChart2 },
  { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Profile',   href: '/profile',   icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
            >
              <Icon
                size={20}
                className={cn(
                  'transition-colors',
                  active ? 'text-indigo-400' : 'text-gray-500'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  active ? 'text-indigo-400' : 'text-gray-500'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
