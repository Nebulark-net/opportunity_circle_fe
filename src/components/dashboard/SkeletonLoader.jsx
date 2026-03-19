import React from 'react';
import Skeleton from '../loaders/Skeleton';

export const OpportunityCardSkeleton = () => (
  <div className="bg-surface-dark border border-border-dark rounded-xl p-5 relative overflow-hidden">
    <div className="flex gap-6">
      <Skeleton className="size-16 rounded-xl shrink-0" />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-surface-dark border border-border-dark p-6 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="size-10 rounded-lg" />
      <Skeleton className="h-4 w-12" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);
