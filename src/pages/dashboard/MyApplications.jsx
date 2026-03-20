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
            case 'SUBMITTED': return 'text-zinc-400 dark:text-zinc-400 bg-zinc-800 dark:bg-zinc-800 border-zinc-700 dark:border-zinc-700';
            default: return 'text-zinc-400 dark:text-zinc-400 bg-zinc-800 dark:bg-zinc-800 border-zinc-700 dark:border-zinc-700';
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header / Action Bar */}
            <div className="sticky top-0 z-20 bg-zinc-950/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 dark:border-zinc-800 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black uppercase tracking-[0.05em] text-zinc-100">My Applications</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
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
                    <div className="text-center py-20 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-red-500/20 dark:border-red-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <p className="text-[13px] text-red-500 font-black tracking-widest uppercase mb-1">Failed to load applications</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Please check your connection and try again.</p>
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-zinc-800 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 shadow-sm">
                        <div className="size-20 bg-zinc-800 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-500 border border-zinc-700 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-4xl">send</span>
                        </div>
                        <div>
                            <p className="text-[13px] text-zinc-100 font-black tracking-widest uppercase mb-1">No Applications Yet</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Your applied opportunities will appear here.</p>
                        </div>
                        <Link to="/dashboard" className="mt-4 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/90 transition-all">
                            Explore Opportunities
                        </Link>
                    </div>
                ) : (
                    <div className="bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-zinc-800 dark:border-zinc-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-zinc-950 dark:bg-zinc-950 border-b border-zinc-800 dark:border-zinc-800">
                                        <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Opportunity</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Applied Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50 dark:divide-zinc-800/50">
                                    {data?.map((application) => {
                                        const opp = application.opportunityId;
                                        const displayTitle = typeof opp?.title === 'object' ? opp.title.en : opp?.title;
                                        
                                        return (
                                            <tr key={application._id} className="hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer border-b border-zinc-800/50">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[13px] font-black tracking-wide uppercase text-zinc-100 group-hover:text-primary transition-colors">
                                                            {displayTitle || 'Unknown Opportunity'}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 font-black flex items-center gap-1 uppercase tracking-widest mt-0.5">
                                                            <span className="material-symbols-outlined text-[14px]">business</span>
                                                            {opp?.organizationName || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] text-zinc-400 font-black tracking-widest uppercase">
                                                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded text-[9px] font-black border uppercase tracking-[0.2em] ${getStatusStyles(application.status)}`}>
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
