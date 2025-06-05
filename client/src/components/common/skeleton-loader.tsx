import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type Variant = 'card' | 'table' | 'text-block';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SkeletonCard = () => (
  <div className="p-4 rounded-2xl border shadow-sm space-y-3 bg-background">
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-8 w-24 rounded-xl mt-3" />
  </div>
);

const SkeletonTable = () => (
  <div className="p-4 border rounded-xl overflow-hidden bg-background">
    {[...Array(getRandomInt(4, 6))].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 mb-3 last:mb-0">
        <Skeleton className="h-4 w-1/6 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </div>
    ))}
  </div>
);

export const SkeletonLoader = () => {
  // Fixed layout: One big table, three cards on side
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row gap-6 p-6 bg-muted">
      {/* Left side: Big table (~70% width) */}
      <div className="flex-1 lg:w-7/12">
        <SkeletonTable />
      </div>

      {/* Right side: 3 smaller cards stacked (~30% width) */}
      <div className="lg:w-5/12 flex flex-col gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};
