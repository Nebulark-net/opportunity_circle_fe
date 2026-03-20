import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Link } from 'react-router-dom';
import OpportunityCard from '../../components/dashboard/OpportunityCard';

const SavedOpportunities = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['saved-opportunities'],
        queryFn: async () => {
            const response = await api.get('/seekers/saved-items');
            return response.data.data || [];
        },
    });

    return (
        <div className="w-full h-full flex flex-col">
            {/* Action Bar */}
            <div className="sticky top-0 z-20 bg-zinc-950/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 dark:border-zinc-800 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black text-zinc-100 uppercase tracking-[0.05em]">Saved Opportunities</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                            Manage your bookmarked scholarships, internships, and events.
                        </p>
                    </div>
                     <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                        {isLoading ? '...' : data?.length || 0} items
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-red-500/20 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-[13px] text-red-500 font-black uppercase tracking-widest mb-1">Failed to load saved items</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Please check your connection and try again.</p>
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-zinc-800 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 shadow-sm">
                        <div className="size-20 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-500 border border-zinc-700 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-4xl">bookmark_border</span>
                        </div>
                        <div>
                            <p className="text-[13px] text-zinc-100 font-black uppercase tracking-widest mb-1">Your Bookmark is Empty</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Opportunities you save will appear here for quick access.</p>
                        </div>
                        <Link to="/dashboard" className="mt-4 px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-lg hover:bg-primary/90 transition-all uppercase tracking-[0.2em]">
                            Browse Feed
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {data?.map((opportunity) => (
                            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedOpportunities;
