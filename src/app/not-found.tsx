import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 select-none">🔮</div>
      <h1 className="text-6xl font-black text-white mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-300 mb-3">Page Not Found</h2>
      <p className="text-gray-500 text-sm max-w-sm mb-10">
        This page doesn&apos;t exist or has been moved. Head back home to find the market
        you&apos;re looking for.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-900/40"
        >
          <Home size={16} /> Back to Home
        </Link>
        <Link
          href="/markets"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-sm transition-colors"
        >
          <Search size={16} /> Browse Markets
        </Link>
      </div>
    </div>
  );
}
