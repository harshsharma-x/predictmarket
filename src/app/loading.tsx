import { MarketCardSkeleton, StatSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-xl bg-white/10" />
        <div className="h-4 w-72 rounded-lg bg-white/5" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-8 space-y-3">
        <div className="flex gap-2">
          <div className="h-9 flex-1 rounded-xl bg-white/5" />
          <div className="h-9 w-40 rounded-xl bg-white/5" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-white/5 shrink-0" />
          ))}
        </div>
      </div>

      {/* Market cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MarketCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
