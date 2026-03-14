import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const SavedOpportunities = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['saved-opportunities'],
    queryFn: async () => {
      const response = await api.get('/seekers/saved');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load saved opportunities. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Saved Opportunities</h1>
        <p className="text-slate-500 dark:text-accent-muted">Your curated list of upcoming milestones.</p>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-200 dark:border-border-dark">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">bookmark_border</span>
          <p className="text-slate-500 dark:text-accent-muted font-medium">You haven't saved any opportunities yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.map((opportunity) => (
            <div key={opportunity._id} className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{opportunity.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{opportunity.organizationName}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase">
                  {opportunity.type}
                </span>
                <span className="text-xs text-slate-400">Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedOpportunities;
