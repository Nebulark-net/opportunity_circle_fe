import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const Feed = ({ type = 'all' }) => {
    const queryClient = useQueryClient();
    const [educationLevel, setEducationLevel] = React.useState('all');
    const [fundingFilter, setFundingFilter] = React.useState('all');
    const [page, setPage] = React.useState(1);
    const limit = 10;

    // Fetch Opportunities
    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ['opportunities', type, educationLevel, fundingFilter, page],
        queryFn: () => api.get('/opportunities', { 
            params: { 
                type: type !== 'all' ? type : undefined,
                educationLevel: educationLevel !== 'all' ? educationLevel : undefined,
                fundingType: fundingFilter !== 'all' ? fundingFilter : undefined,
                page,
                limit
            } 
        }).then(res => res.data.data)
    });

    const opportunities = responseData?.opportunities || [];
    const totalPages = responseData?.totalPages || 0;

    // Reset page when filters change
    React.useEffect(() => {
        setPage(1);
    }, [type, educationLevel, fundingFilter]);

    // Fetch User Context (Saved & Applied)
    const { data: savedItems } = useQuery({
        queryKey: ['saved-opportunities'],
        queryFn: () => api.get('/seekers/saved-items').then(res => res.data.data || [])
    });

    const { data: applications } = useQuery({
        queryKey: ['my-applications'],
        queryFn: () => api.get('/seekers/applications').then(res => res.data.data || [])
    });

    // Save Toggle Mutation
    const toggleSaveMutation = useMutation({
        mutationFn: (opportunityId) => api.post('/seekers/toggle-save', { itemId: opportunityId, itemType: 'OPPORTUNITY' }),
        onMutate: async (opportunityId) => {
            await queryClient.cancelQueries(['saved-opportunities']);
            const previousSaved = queryClient.getQueryData(['saved-opportunities']);
            
            queryClient.setQueryData(['saved-opportunities'], (old = []) => {
                const exists = old.find(item => item._id === opportunityId);
                if (exists) return old.filter(item => item._id !== opportunityId);
                return [...old, { _id: opportunityId }]; // Optimistic add
            });
            
            return { previousSaved };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['saved-opportunities'], context.previousSaved);
        },
        onSettled: () => {
            queryClient.invalidateQueries(['saved-opportunities']);
        }
    });

    const { searchQuery, setSearchQuery, filteredOpportunities } = useOpportunitySearch(opportunities);

    // Filter helpers
    const savedIds = new Set(savedItems?.map(item => item._id));
    const appliedIds = new Set(applications?.map(app => app.opportunityId || app.opportunity?._id));

    const educationLevels = ['all', 'UNDERGRADUATE', 'GRADUATE', 'PHD'];
    const fundingTypes = ['all', 'FULL_FUNDING', 'PARTIAL_FUNDING', 'PAID', 'UNPAID'];

    return (
        <div className="w-full h-full flex flex-col">
            {/* Search and Action Bar */}
            <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black uppercase tracking-[0.05em] text-zinc-100 italic">
                                {type === 'all' || !type 
                                    ? 'Central Intelligence Feed' 
                                    : `${type.charAt(0) + type.slice(1).toLowerCase()} Nexus`}
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                                {isLoading ? 'Scanning Spectrum...' : `${responseData?.totalCount || 0} active nodes calibrated`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                                {['newest', 'trending'].map(sort => (
                                    <button 
                                        key={sort}
                                        className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                                            sort === 'newest' ? 'bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                    >
                                        {sort}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                placeholder="Query title, company, or keywords..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest outline-none focus:border-primary/50"
                                value={educationLevel}
                                onChange={(e) => setEducationLevel(e.target.value)}
                            >
                                <option value="all">Degree: All</option>
                                <option value="UNDERGRADUATE">Undergrad</option>
                                <option value="GRADUATE">Graduate</option>
                                <option value="PHD">PhD</option>
                            </select>
                            <select 
                                className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest outline-none focus:border-primary/50"
                                value={fundingFilter}
                                onChange={(e) => setFundingFilter(e.target.value)}
                            >
                                <option value="all">Funding: Any</option>
                                <option value="FULL_FUNDING">Full</option>
                                <option value="PAID">Paid</option>
                                <option value="STIPEND">Stipend</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Content */}
            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-4">
                {isLoading ? (
                    <FeedSkeleton />
                ) : error ? (
                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-red-500/10">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4 opacity-50">data_alert</span>
                        <p className="text-red-500/80 font-black text-xs uppercase tracking-[0.3em]">Protocol Failure</p>
                        <p className="text-zinc-600 font-black text-[9px] uppercase tracking-widest mt-2">Could not synchronize with central database.</p>
                    </div>
                ) : filteredOpportunities?.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center gap-4">
                         <div className="size-20 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-700 border border-zinc-800">
                            <span className="material-symbols-outlined text-4xl">inventory_2</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] text-zinc-100 font-black tracking-[0.2em] uppercase">Target Null</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">No matching nodes found in the current spectrum.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {filteredOpportunities?.map((opp) => (
                            <OpportunityCard 
                                key={opp._id} 
                                opportunity={opp} 
                                isSaved={savedIds.has(opp._id)}
                                isApplied={appliedIds.has(opp._id)}
                                onSaveToggle={(id) => toggleSaveMutation.mutate(id)}
                            />
                        ))}
                    </div>
                )}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-8 border-t border-zinc-800/50 mt-4">
                        <button
                            onClick={() => {
                                setPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30 hover:bg-zinc-900 text-zinc-400 transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (totalPages > 5) {
                                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - page) > 1) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-zinc-700 mx-1">...</span>;
                                        return null;
                                    }
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => {
                                            setPage(pageNum);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`size-8 rounded-lg text-[10px] font-black transition-all ${
                                            page === pageNum
                                                ? 'bg-zinc-800 text-primary border border-zinc-700'
                                                : 'text-zinc-500 hover:bg-zinc-900'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => {
                                setPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30 hover:bg-zinc-900 text-zinc-400 transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}

                {filteredOpportunities?.length > 0 && page === totalPages && (
                    <div className="flex justify-center py-8">
                        <div className="h-px bg-zinc-800 flex-1 mt-3"></div>
                        <p className="px-6 text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em]">End of Transmission</p>
                        <div className="h-px bg-zinc-800 flex-1 mt-3"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
