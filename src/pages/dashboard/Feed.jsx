import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import OpportunityCard from '../../components/dashboard/OpportunityCard';
import useOpportunitySearch from '../../hooks/useOpportunitySearch';
import api from '../../lib/api';

const Feed = ({ type = '' }) => {
  const [savedIds, setSavedIds] = useState(new Set());

  const { data: opportunitiesData, isLoading, error } = useQuery({
    queryKey: ['opportunities', type],
    queryFn: async () => {
      const response = await api.get('/opportunities', {
        params: { type: type !== 'all' ? type : undefined }
      });
      return response.data.data.opportunities;
    }
  });

  const { data: savedItemsData } = useQuery({
    queryKey: ['saved-items'],
    queryFn: async () => {
      const response = await api.get('/seekers/saved-items', {
        params: { itemType: 'OPPORTUNITY' }
      });
      return response.data.data;
    }
  });

  useEffect(() => {
    if (savedItemsData) {
      setSavedIds(new Set(savedItemsData.map(item => item.opportunityId?._id)));
    }
  }, [savedItemsData]);

  const { searchQuery, setSearchQuery, filteredOpportunities } = useOpportunitySearch(opportunitiesData || []);

  const handleToggleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
      Failed to load opportunities. Please try again later.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar">
      {/* Search and Action Bar */}
      <div className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md border-b border-border-dark px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {type === 'all' || !type ? 'Opportunity Feed' : `${type.charAt(0) + type.slice(1).toLowerCase()}s`}
              </h1>
              <p className="text-slate-400 text-sm">
                {filteredOpportunities.length} active opportunities for your profile
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input 
                className="w-full bg-border-dark border-none rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="Search by keywords, companies, or titles..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-4">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <OpportunityCard 
              key={opp._id} 
              opportunity={opp} 
              isSaved={savedIds.has(opp._id)}
              onToggleSave={handleToggleSave}
            />
          ))
        ) : (
          <div className="p-12 text-center bg-surface-dark border border-border-dark rounded-xl">
            <span className="material-symbols-outlined text-5xl text-slate-500 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
