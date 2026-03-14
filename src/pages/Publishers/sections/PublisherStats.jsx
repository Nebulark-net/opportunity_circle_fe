import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { TrendingUp, CheckCircle2, ListChecks, Loader2 } from 'lucide-react';
import MaxContainer from '../../../components/layout/MaxContainer';

const fetchStats = async () => {
  const { data } = await api.get('/publisher/stats');
  return data.data;
};

const PublisherStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publisherStats'],
    queryFn: fetchStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const stats = [
    {
      icon: <TrendingUp className="text-emerald-500" />,
      label: "Engagement Rate",
      value: data?.engagementRate || "+124%",
      loading: isLoading
    },
    {
      icon: <CheckCircle2 className="text-primary" />,
      label: "Verified Programs",
      value: data?.verifiedPrograms?.toLocaleString() || "500",
      loading: isLoading
    },
    {
      icon: <ListChecks className="text-accent-teal" />,
      label: "Active Listings",
      value: data?.activeListings?.toLocaleString() || "1,200",
      loading: isLoading
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-surface-dark/30">
      <MaxContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-8 flex items-center gap-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
              <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
                {stat.loading ? (
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                ) : (
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </MaxContainer>
    </section>
  );
};

export default PublisherStats;
