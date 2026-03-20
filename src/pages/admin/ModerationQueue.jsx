import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import ModerationActions from '../../components/admin/ModerationActions';

const ModerationQueue = () => {
    const { data: result, isLoading, refetch } = useQuery({
        queryKey: ['moderation-queue'],
        queryFn: async () => {
            const data = await adminService.getModerationQueue();
            return data.data;
        },
    });

    const pendingItems = result?.opportunities || [];

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Vetting Authority</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Authorize and moderate platform opportunity nodes</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={() => refetch()} className="hfas-btn-ghost flex-1 md:flex-none flex items-center justify-center gap-2 px-6">
                        <span className="material-symbols-outlined text-[18px]">sync</span> Synchronize
                    </button>
                    <div className="bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-800 shadow-hfas-inner flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{pendingItems.length} Pending</span>
                    </div>
                </div>
            </div>

            {/* Tab */}
            <div className="flex items-center gap-6 border-b border-zinc-800">
                <div className="flex items-center gap-3 border-b-2 border-primary text-primary pb-4 px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Primary Queue</span>
                    <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-black">{pendingItems.length}</span>
                </div>
            </div>

            {/* Data Grid */}
            <div className="hfas-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-800/30 border-b border-zinc-800/50">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Opportunity Node</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hidden sm:table-cell">Submission</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {isLoading ? (
                                <tr><td colSpan="3" className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
                                        <span className="material-symbols-outlined text-4xl">radar</span>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Scanning Vetting Streams...</p>
                                    </div>
                                </td></tr>
                            ) : pendingItems.length > 0 ? pendingItems.map((item) => {
                                const displayTitle = typeof item.title === 'object' ? item.title.en : item.title;
                                return (
                                    <tr key={item._id} className="group hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <span className="text-sm font-bold text-zinc-200 leading-tight truncate group-hover:text-primary transition-colors">{displayTitle}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border border-zinc-700 text-zinc-500 bg-zinc-800/50">{item.type}</span>
                                                    <span className="text-[10px] font-medium text-zinc-500 truncate">{item.organizationName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden sm:table-cell">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tight">
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ID: {item._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link to={`/opportunity/${item._id}`} className="size-9 rounded-xl bg-zinc-800 text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center border border-transparent hover:border-primary/20" title="Inspect">
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </Link>
                                                <ModerationActions opportunityId={item._id} onSuccess={refetch} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr><td colSpan="3" className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-5 opacity-40">
                                        <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <span className="material-symbols-outlined text-4xl">rule</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Vetting Stream Clear</p>
                                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">All pending assets processed.</p>
                                        </div>
                                    </div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:hidden p-5 hfas-card bg-primary/5 border-primary/10 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-relaxed">Swipe grid horizontally for deeper telemetry</p>
            </div>
        </div>
    );
};

export default ModerationQueue;
