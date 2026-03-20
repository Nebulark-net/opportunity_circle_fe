import React from 'react';
import { useQuery } from '@tanstack/react-query';
import OpportunityCard from '../../components/dashboard/OpportunityCard';
import api from '../../lib/api';
import useOpportunitySearch from '../../hooks/useOpportunitySearch';
import Skeleton from '../../components/loaders/Skeleton';

const FeedSkeleton = () => (
    <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-800 rounded-xl p-5 animate-pulse">
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
            <div className="sticky top-0 z-20 bg-zinc-950/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 dark:border-zinc-800 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black uppercase tracking-[0.05em] text-zinc-100">
                                {type === 'all' || !type ? 'Opportunity Feed' : `${type}s`}
                            </h1>
                            {isLoading ? (
                                <Skeleton className="h-4 w-48 mt-1" />
                            ) : (
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                                    {filteredOpportunities?.length || 0} active nodes
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sort by:</label>
                            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors border border-zinc-800">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Newest First</span>
                                <span className="material-symbols-outlined text-[18px] text-zinc-500">expand_more</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                placeholder="Search by keywords, companies, or titles..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-100 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                <span className="hidden sm:inline">Location</span>
                            </button>
                            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-100 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                <span className="hidden sm:inline">Filters</span>
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
                    <div className="text-center py-20 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-red-500/20 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-red-500 font-bold text-lg uppercase tracking-tight">Failed to load opportunities</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                ) : filteredOpportunities?.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-zinc-800 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 shadow-sm">
                         <div className="size-20 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-500 border border-zinc-700 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-4xl">search_off</span>
                        </div>
                        <div>
                            <p className="text-[13px] text-zinc-100 font-black tracking-widest uppercase">No results found</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Try adjusting your schema.</p>
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
                                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all text-[10px] font-black bg-zinc-900 uppercase tracking-[0.2em]">
                                    <span className="material-symbols-outlined text-[18px]">sync</span>
                                    Load More
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
