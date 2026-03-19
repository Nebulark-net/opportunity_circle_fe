import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

const MyApplications = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['my-applications'],
        queryFn: async () => {
            const response = await api.get('/applications/my');
            return response.data.data || [];
        },
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
            case 'REJECTED': return 'text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
            case 'UNDER_REVIEW': return 'text-primary bg-primary/10 border-primary/20';
            case 'SUBMITTED': return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
            default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header / Action Bar */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">My Applications</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Track your submission status and progress in real-time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-red-500 font-bold text-lg uppercase tracking-tight">Failed to load applications</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-surface-dark rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark flex flex-col items-center justify-center gap-4 shadow-sm">
                        <div className="size-20 bg-slate-50 dark:bg-background-dark rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-border-dark">
                            <span className="material-symbols-outlined text-4xl">send</span>
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">No Applications Yet</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your applied opportunities will appear here.</p>
                        </div>
                        <Link to="/dashboard" className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-xs">
                            Explore Opportunities
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-border-dark">
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Opportunity</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Applied Date</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-border-dark/50">
                                    {data?.map((application) => {
                                        const opp = application.opportunityId;
                                        const displayTitle = typeof opp?.title === 'object' ? opp.title.en : opp?.title;
                                        
                                        return (
                                            <tr key={application._id} className="hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors group cursor-pointer">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                                                            {displayTitle || 'Unknown Opportunity'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">business</span>
                                                            {opp?.organizationName || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded text-[11px] font-bold border uppercase tracking-widest ${getStatusStyles(application.status)}`}>
                                                        {application.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
