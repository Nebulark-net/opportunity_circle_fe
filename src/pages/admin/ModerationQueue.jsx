import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import AdminLayout from '../../layouts/AdminLayout';
import ModerationActions from '../../components/admin/ModerationActions';

const ModerationQueue = () => {
    const { data: result, isLoading, refetch } = useQuery({
        queryKey: ['moderation-queue'],
        queryFn: async () => {
            const response = await api.get('/admin/moderation-queue');
            return response.data.data;
        },
    });

    const pendingItems = result?.opportunities || [];

    return (
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 w-full flex flex-col gap-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-off-white tracking-tighter uppercase">Admin Moderation</h1>
                    <p className="text-light-gray font-medium max-w-2xl">Review and authorize pending opportunity listings to maintain platform integrity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 bg-surface-dark border border-border-dark text-off-white text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        <span>Filters</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 bg-primary text-off-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        <span onClick={() => refetch()}>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border-dark gap-8">
                <div className="flex items-center gap-3 border-b-2 border-primary text-primary pb-4 transition-all px-2">
                    <span className="text-xs font-black uppercase tracking-widest">Pending Queue</span>
                    <span className="bg-primary/20 text-primary text-[10px] px-2.5 py-0.5 rounded-full font-black border border-primary/20">{pendingItems?.length || 0}</span>
                </div>
            </div>

            <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-background-dark/50 border-b border-border-dark">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-light-gray">Opportunity Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-light-gray">Submission</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-light-gray text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center text-light-gray font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Queue...</td>
                                </tr>
                            ) : pendingItems?.length > 0 ? (
                                pendingItems.map((item) => {
                                    const displayTitle = typeof item.title === 'object' ? item.title.en : item.title;
                                    return (
                                        <tr key={item._id} className="hover:bg-background-dark/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-base font-black text-off-white group-hover:text-primary transition-colors tracking-tight">{displayTitle}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter bg-background-dark px-2 py-0.5 rounded border border-border-dark text-light-gray">{item.type}</span>
                                                        <span className="text-[10px] font-bold text-light-gray/60">{item.organizationName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-xs font-black text-off-white uppercase tracking-tighter">
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[10px] text-light-gray font-medium opacity-60">ID: {item._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end items-center gap-3">
                                                    <Link 
                                                        to={`/opportunity/${item._id}`}
                                                        className="flex items-center justify-center gap-2 rounded-lg p-2 bg-background-dark border border-border-dark text-light-gray hover:text-primary hover:border-primary transition-all shadow-sm" 
                                                        title="View Submission"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </Link>
                                                    <ModerationActions opportunityId={item._id} onSuccess={refetch} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                                            <span className="material-symbols-outlined text-6xl">verified</span>
                                            <div>
                                                <p className="text-off-white text-lg font-black uppercase tracking-widest">Queue Clear</p>
                                                <p className="text-light-gray text-xs font-bold mt-1">All pending items have been moderated.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ModerationQueue;
