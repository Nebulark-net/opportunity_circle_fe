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
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Saved Opportunities</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Manage your bookmarked scholarships, internships, and events.
                        </p>
                    </div>
                     <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-border-dark text-slate-900 dark:text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm">
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
                    <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-red-500 font-bold text-lg uppercase tracking-tight">Failed to load saved items</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark flex flex-col items-center justify-center gap-4 shadow-sm">
                        <div className="size-20 bg-slate-50 dark:bg-background-dark rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-border-dark">
                            <span className="material-symbols-outlined text-4xl">bookmark_border</span>
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">Your Bookmark is Empty</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Opportunities you save will appear here for quick access.</p>
                        </div>
                        <Link to="/dashboard" className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-xs">
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
