import React from 'react';
import Skeleton from '../loaders/Skeleton';

const TrendingWidget = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-transparent">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-3 w-3/4 mb-1" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Trending This Week</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-border-dark transition-colors cursor-pointer border border-transparent hover:border-border-dark">
          <div className="bg-blue-500/20 text-blue-400 rounded-lg p-2 shrink-0">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white mb-0.5">Goldman Sachs Insight Program</p>
            <p className="text-[10px] text-slate-400">2.4k students applied recently</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-border-dark transition-colors cursor-pointer border border-transparent hover:border-border-dark">
          <div className="bg-purple-500/20 text-purple-400 rounded-lg p-2 shrink-0">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white mb-0.5">NVIDIA AI Research Intern</p>
            <p className="text-[10px] text-slate-400">High match for your skill set</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingWidget;
