import React from 'react';
import { useQuery } from '@tanstack/react-query';
import OpportunityCard from '../opportunities/OpportunityCard';
import api from '../../lib/api';

const SavedItems = () => {
  const { data: savedItems, isLoading } = useQuery({
    queryKey: ['saved-items'],
    queryFn: async () => {
      const response = await api.get('/seeker/saved-items');
      return response.data;
    },
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-card"></div>
    ))}
  </div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedItems?.length > 0 ? (
        savedItems.map((item) => (
          <OpportunityCard key={item.id} opportunity={item.opportunity} />
        ))
      ) : (
        <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-surface-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-card">
          <p className="text-slate-500">No bookmarked items yet.</p>
        </div>
      )}
    </div>
  );
};

export default SavedItems;
