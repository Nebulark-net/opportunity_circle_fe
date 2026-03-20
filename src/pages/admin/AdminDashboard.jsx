import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';

const AdminDashboard = () => {
    const { data: statsResponse, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: adminService.getStats,
    });

    const stats = statsResponse?.data || {};

    const telemetryCards = [
        { label: 'Total Seekers', value: stats.totalSeekers || 0, icon: 'person_search', color: 'text-primary' },
        { label: 'Total Publishers', value: stats.totalPublishers || 0, icon: 'apartment', color: 'text-indigo-400' },
        { label: 'Live Opportunities', value: stats.liveOpportunities || 0, icon: 'rocket_launch', color: 'text-emerald-400' },
        { label: 'Pending Review', value: stats.pendingOpportunities || 0, icon: 'pending_actions', color: 'text-accent-amber' },
    ];

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Command Center</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Platform telemetry and orchestration overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-800 shadow-hfas-inner flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </div>

            {/* Telemetry Core */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {telemetryCards.map((card) => (
                    <div key={card.label} className="hfas-card p-7 flex flex-col gap-5 group relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <span className={`material-symbols-outlined text-[28px] ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{card.icon}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-4xl font-black text-zinc-100 tracking-tight leading-none">
                                {isLoading ? '—' : card.value}
                            </p>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-2">{card.label}</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <span className={`material-symbols-outlined text-[100px] ${card.color}`}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity Streams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="hfas-card overflow-hidden">
                    <div className="px-7 py-5 border-b border-zinc-800/50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Recent Identities</h3>
                        <span className="material-symbols-outlined text-zinc-600 text-[18px]">group</span>
                    </div>
                    <div className="divide-y divide-zinc-800/50">
                        {isLoading ? (
                            <div className="p-10 text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning...</div>
                        ) : (stats.recentUsers || []).map((u) => (
                            <div key={u._id} className="px-7 py-4 flex items-center gap-4 hover:bg-zinc-800/30 transition-colors">
                                <div className="size-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 shadow-hfas-inner">
                                    {u.profilePhotoUrl ? (
                                        <img src={u.profilePhotoUrl} className="size-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" alt="" />
                                    ) : (
                                        <span className="material-symbols-outlined text-zinc-500 text-[18px]">person</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-200 truncate">{u.fullName}</p>
                                    <p className="text-[10px] font-medium text-zinc-500 truncate">{u.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border ${
                                    u.role === 'ADMIN' ? 'border-primary/30 text-primary bg-primary/10' : 
                                    u.role === 'PUBLISHER' ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10' : 
                                    'border-zinc-700 text-zinc-400 bg-zinc-800/50'
                                }`}>{u.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Opportunities */}
                <div className="hfas-card overflow-hidden">
                    <div className="px-7 py-5 border-b border-zinc-800/50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Recent Ops</h3>
                        <span className="material-symbols-outlined text-zinc-600 text-[18px]">work</span>
                    </div>
                    <div className="divide-y divide-zinc-800/50">
                        {isLoading ? (
                            <div className="p-10 text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning...</div>
                        ) : (stats.recentOpportunities || []).map((o) => {
                            const title = typeof o.title === 'object' ? o.title.en : o.title;
                            return (
                                <div key={o._id} className="px-7 py-4 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-200 truncate">{title}</p>
                                        <p className="text-[10px] font-medium text-zinc-500">{o.type} • {new Date(o.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border ${
                                        o.status === 'ACTIVE' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                                        o.status === 'PENDING' ? 'border-amber-500/20 text-amber-400 bg-amber-500/10' :
                                        'border-zinc-700 text-zinc-400 bg-zinc-800/50'
                                    }`}>{o.status}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
