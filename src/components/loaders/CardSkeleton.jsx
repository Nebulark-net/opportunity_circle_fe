import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="card flex flex-col h-full p-4 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark animate-pulse">
      <div className="aspect-[16/9] mb-4 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="flex-1 space-y-4">
        <div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-border-dark">
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const CardGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CardSkeleton;
