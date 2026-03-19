import React from 'react';
import { useQuery } from '@tanstack/react-query';
import OpportunityCard from '../../components/dashboard/OpportunityCard';
import api from '../../lib/api';
import useOpportunitySearch from '../../hooks/useOpportunitySearch';
import Skeleton from '../../components/loaders/Skeleton';

const FeedSkeleton = () => (
    <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 animate-pulse">
                <div className="flex gap-6">
                    <Skeleton className="size-16 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-4">
                            <div className="space-y-2 w-1/2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="size-10 rounded-lg" />
                                <Skeleton className="h-10 w-20 rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex gap-3">
                            <Skeleton className="h-6 w-24 rounded" />
                            <Skeleton className="h-6 w-24 rounded" />
                            <Skeleton className="h-6 w-24 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const Feed = ({ type = '' }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['opportunities', type],
        queryFn: () => api.get('/opportunities', { params: { type: type !== 'all' ? type : undefined } }).then(res => res.data.data.opportunities)
    });

    const { searchQuery, setSearchQuery, filteredOpportunities } = useOpportunitySearch(data);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Search and Action Bar */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {type === 'all' || !type ? 'Opportunity Feed' : `${type}s`}
                            </h1>
                            {isLoading ? (
                                <Skeleton className="h-4 w-48 mt-1" />
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    {filteredOpportunities?.length || 0} active opportunities for your profile
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">Sort by:</label>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-border-dark px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-border-dark/80 transition-colors">
                                <span className="text-xs font-semibold text-slate-700 dark:text-white">Newest First</span>
                                <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-slate-100 dark:bg-border-dark border-none rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                placeholder="Search by keywords, companies, or titles..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 bg-slate-100 dark:bg-border-dark px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">location_on</span>
                                <span className="hidden sm:inline">Location</span>
                            </button>
                            <button className="flex items-center gap-2 bg-slate-100 dark:bg-border-dark px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                <span className="hidden sm:inline">Advanced Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Content */}
            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-4">
                {isLoading ? (
                    <FeedSkeleton />
                ) : error ? (
                    <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-red-500 font-bold text-lg uppercase tracking-tight">Failed to load opportunities</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                ) : filteredOpportunities?.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark flex flex-col items-center justify-center gap-4 shadow-sm">
                         <div className="size-20 bg-slate-50 dark:bg-background-dark rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-border-dark">
                            <span className="material-symbols-outlined text-4xl">search_off</span>
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">No results found</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredOpportunities?.map((opp) => (
                                <OpportunityCard key={opp._id} opportunity={opp} />
                            ))}
                        </div>
                        
                        {/* Loading / Pagination Indicator */}
                        {filteredOpportunities?.length > 0 && (
                            <div className="flex justify-center py-6 mt-4">
                                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-500 transition-all text-sm font-bold bg-white dark:bg-transparent shadow-sm dark:shadow-none">
                                    <span className="material-symbols-outlined text-[20px]">sync</span>
                                    Load More Opportunities
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Feed;
