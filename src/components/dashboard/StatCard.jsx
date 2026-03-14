import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-dark p-6 rounded-card border border-slate-200 dark:border-border-dark animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-dark p-6 rounded-card border border-slate-200 dark:border-border-dark transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {typeof value === 'number' && title.toLowerCase().includes('rate') ? `${value}` : value}
          </span>
        </div>
        {description && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase tracking-wider">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
