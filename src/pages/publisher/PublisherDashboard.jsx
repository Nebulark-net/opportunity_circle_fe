import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publisherService } from '../../services/publisher.service';
import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';

const PublisherDashboard = () => {
  const [activeTab, setActiveTab] = useState('All Listings');
  const { user } = useAuthStore();

  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['publisher-listings'],
    queryFn: () => publisherService.getOpportunities(),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['publisher-stats'],
    queryFn: () => publisherService.getStats(),
  });

  const listings = listingsData?.data?.opportunities || [];
  const stats = statsData?.data || {};

  const tabs = ['All Listings', 'Active', 'Pending', 'Drafts', 'Expired'];

  const filteredListings = listings.filter((listing) => {
    if (activeTab === 'All Listings') return true;
    if (activeTab === 'Active') return listing.status === 'ACTIVE';
    if (activeTab === 'Pending') return listing.status === 'PENDING';
    if (activeTab === 'Drafts') return listing.status === 'DRAFT';
    if (activeTab === 'Expired') return listing.status === 'EXPIRED' || listing.status === 'CLOSED';
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusBadge = (status) => {
    const configs = {
      ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Live' },
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Review' },
      DRAFT: { bg: 'bg-zinc-800/50', text: 'text-zinc-500', label: 'Draft' },
      EXPIRED: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Expired' },
      CLOSED: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Closed' }
    };
    const config = configs[status] || { bg: 'bg-zinc-800/50', text: 'text-zinc-500', label: status };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.text} border border-white/5`}>
        {config.label}
      </span>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10"
    >
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-6">
          <div className="size-20 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-600 shadow-xl p-1">
             {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Organization Logo" className="w-full h-full object-cover rounded-xl" crossOrigin="anonymous" referrerPolicy="no-referrer" />
             ) : (
                <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
             )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-zinc-100 tracking-tighter uppercase leading-none">Management Console</h1>
            <p className="text-zinc-500 font-medium text-lg uppercase tracking-tight">Orchestrate your early-career opportunities and track global impact.</p>
          </div>
        </div>
        <Link to="/publisher/create" className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-white text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95 whitespace-nowrap">
          <span className="material-symbols-outlined font-black">add</span>
          <span>Deploy Opportunity</span>
        </Link>
      </div>

      {/* Industrial Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Listings', value: stats.activeListingsCount || 0, accent: 'emerald', icon: 'check_circle', trend: 'Live' },
          { label: 'Total Reach', value: stats.totalViews || 0, accent: 'blue', icon: 'visibility', trend: 'Views' },
          { label: 'Engagement', value: `${stats.engagementRate || 0}%`, accent: 'primary', icon: 'ads_click', trend: 'Global' },
          { label: 'Candidate Pool', value: stats.totalApplicants || 0, accent: 'purple', icon: 'groups', trend: 'Total' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="group relative bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform text-white`}>
              <span className="material-symbols-outlined text-6xl">{item.icon}</span>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">{item.label}</p>
            <div className="flex items-baseline justify-between pt-2">
              <h3 className="text-3xl font-black text-zinc-100 tracking-tighter">{statsLoading ? '...' : item.value}</h3>
              <span className={`text-[10px] font-black text-zinc-400 uppercase bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700`}>{item.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation & Listings Hub */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-zinc-800">
          <div className="flex gap-10 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${
                  activeTab === tab 
                    ? 'text-primary' 
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Listings Table */}
        <div className="bg-zinc-900 rounded-[32px] border border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-800/20 border-b border-zinc-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Listing Protocol</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Engagement</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {listingsLoading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
                        <span className="material-symbols-outlined text-4xl">radar</span>
                        <p className="mt-4 text-sm font-bold uppercase tracking-widest">Initalizing Streams...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <motion.tr 
                      key={listing._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-zinc-800/20 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-14 rounded-2xl bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700 group-hover:border-primary/50 transition-colors shadow-sm">
                            {listing.coverImage ? (
                               <img src={listing.coverImage} alt={listing.title} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                            ) : (
                               <span className="material-symbols-outlined text-zinc-600 text-2xl">{listing.type === 'SCHOLARSHIP' ? 'school' : 'work'}</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-black text-zinc-100 uppercase tracking-tight line-clamp-1">{listing.title?.en || listing.title}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 uppercase">{listing.type}</span>
                              <span className="text-[10px] font-medium text-zinc-500">{new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-zinc-100">{listing.views || 0}</span>
                              <span className="text-[9px] font-bold text-zinc-500 uppercase">Views</span>
                            </div>
                            <div className="w-[1px] h-6 bg-zinc-800"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-emerald-500">{listing.applicantCount || 0}</span>
                              <span className="text-[9px] font-bold text-zinc-500 uppercase">Applied</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {getStatusBadge(listing.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/opportunity/${listing._id}`} className="size-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-zinc-800">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                          <Link to={`/publisher/edit/${listing._id}`} className="size-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-zinc-800">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-32 text-center text-zinc-500">
                      <div className="size-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-700">
                        <span className="material-symbols-outlined text-4xl text-zinc-600">inventory_2</span>
                      </div>
                      <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tighter">No Protocols Detected</h3>
                      <p className="text-zinc-500 mt-2 max-w-xs mx-auto text-sm">You haven't deployed any opportunities under the {activeTab} category yet.</p>
                      <Link to="/publisher/create" className="mt-8 inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:gap-4 transition-all">
                        Deploy first listing <span className="material-symbols-outlined">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublisherDashboard;
