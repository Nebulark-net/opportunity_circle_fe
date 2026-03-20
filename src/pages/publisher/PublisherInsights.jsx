import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { publisherService } from '../../services/publisher.service';
import { motion } from 'framer-motion';

const PublisherInsights = () => {
    const { data: statsResponse, isLoading } = useQuery({
        queryKey: ['publisher-stats'],
        queryFn: () => publisherService.getStats(),
    });

    const stats = statsResponse?.data || {
        totalListings: 0,
        activeListingsCount: 0,
        engagementRate: 0,
        totalViews: 0,
        totalApplicants: 0,
        listingStatusBreakdown: []
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    // Calculate percentage for status breakdown
    const getMaxCount = () => {
        if (!stats.listingStatusBreakdown || stats.listingStatusBreakdown.length === 0) return 1;
        return Math.max(...stats.listingStatusBreakdown.map(s => s.count || 0));
    };

    const maxStatusCount = getMaxCount();

    const getStatusColor = (status) => {
        const colors = {
            ACTIVE: 'bg-emerald-500',
            PENDING: 'bg-amber-500',
            DRAFT: 'bg-zinc-500',
            EXPIRED: 'bg-red-500',
            CLOSED: 'bg-rose-600'
        };
        return colors[status] || 'bg-primary';
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10 min-h-full"
        >
            {/* Header Module */}
            <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-6 relative overflow-hidden">
                <div className="absolute top-0 right-10 size-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,167,149,0.1)]">
                        <span className="material-symbols-outlined text-[24px]">analytics</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-zinc-100 uppercase tracking-tighter">Network Telemetry</h1>
                </div>
                <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold ml-16">Global Engagement & Deployment Metrics</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Reach', value: stats.totalViews, icon: 'visibility', trend: 'Global Views', accent: 'primary' },
                    { label: 'Candidate Pool', value: stats.totalApplicants, icon: 'groups', trend: 'Submitted', accent: 'emerald' },
                    { label: 'Active Relays', value: stats.activeListingsCount, icon: 'wifi_tethering', trend: `Of ${stats.totalListings} total`, accent: 'blue' },
                    { label: 'Engagement Rate', value: `${stats.engagementRate}%`, icon: 'vital_signs', trend: 'Interactions', accent: 'amber' },
                ].map((kpi, idx) => (
                    <motion.div 
                        key={idx} 
                        variants={itemVariants} 
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-white pointer-events-none">
                            <span className="material-symbols-outlined text-7xl">{kpi.icon}</span>
                        </div>
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined text-[20px] text-${kpi.accent}-500 opacity-80`}>{kpi.icon}</span>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{kpi.label}</span>
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-4xl font-black text-zinc-100 tracking-tighter">
                                    {isLoading ? <span className="animate-pulse text-zinc-700">--</span> : kpi.value}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-800/50">{kpi.trend}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Visuals Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Status Distribution Panel */}
                <motion.div variants={itemVariants} className="xl:col-span-1 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-xl flex flex-col gap-8">
                    <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                        <span className="material-symbols-outlined text-zinc-500">donut_large</span>
                        <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Listing Protocols</h2>
                    </div>

                    <div className="flex flex-col gap-6 flex-1 justify-center">
                        {isLoading ? (
                            <div className="flex flex-col gap-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 bg-zinc-800/50 rounded-xl w-full"></div>
                                ))}
                            </div>
                        ) : stats.listingStatusBreakdown && stats.listingStatusBreakdown.length > 0 ? (
                            stats.listingStatusBreakdown.map((statusItem, idx) => {
                                const widthPercent = Math.max((statusItem.count / maxStatusCount) * 100, 5); // min 5% width for visibility
                                return (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                            <span className="text-zinc-300">{statusItem._id || 'Unknown'}</span>
                                            <span className="text-zinc-500">{statusItem.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${widthPercent}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                className={`h-full rounded-full ${getStatusColor(statusItem._id)}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center flex flex-col items-center gap-4 py-8">
                                <span className="material-symbols-outlined text-zinc-700 text-5xl">inventory_2</span>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No telemetry recorded</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Conversion Funnel / Abstract Graphic */}
                <motion.div variants={itemVariants} className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-xl flex flex-col overflow-hidden relative">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-zinc-500">filter_alt</span>
                            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Conversion Matrix</h2>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Optimized</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center py-12 relative z-10 gap-8">
                        {/* Abstract Funnel Representation */}
                        <div className="w-full max-w-lg flex flex-col items-center gap-2">
                            <div className="w-full h-16 bg-zinc-800/40 rounded-t-2xl border border-zinc-800 flex items-center justify-between px-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Global Impressions</span>
                                <span className="text-xl font-black text-zinc-300">{stats.totalViews}</span>
                            </div>
                            <div className="w-[85%] h-16 bg-zinc-800/60 rounded-md border border-zinc-700/50 flex items-center justify-between px-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Interactions</span>
                                <span className="text-xl font-black text-zinc-200">~{Math.floor(stats.totalViews * 0.4)}</span>
                            </div>
                            <div className="w-[70%] h-16 bg-zinc-800 rounded-b-2xl border border-zinc-600 flex items-center justify-between px-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Submitted Applications</span>
                                <span className="text-xl font-black text-white">{stats.totalApplicants}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                             <div className="flex flex-col items-center gap-1">
                                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Est. Conversion</span>
                                 <span className="text-lg font-black text-primary border-b border-primary/30 pb-0.5">{stats.totalViews > 0 ? ((stats.totalApplicants / stats.totalViews) * 100).toFixed(1) : 0}%</span>
                             </div>
                             <div className="h-8 w-px bg-zinc-800"></div>
                             <div className="flex flex-col items-center gap-1 text-center">
                                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Industry Avg</span>
                                 <span className="text-lg font-bold text-zinc-500 border-b border-zinc-800 pb-0.5">3.2%</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PublisherInsights;
