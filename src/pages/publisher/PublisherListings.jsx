import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publisherService } from '../../services/publisher.service';
import { toast } from 'sonner';

const PublisherListings = () => {
  const queryClient = useQueryClient();

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['publisher-listings'],
    queryFn: () => publisherService.getOpportunities(),
  });

  const opportunities = listingsData?.data?.opportunities || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => publisherService.deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['publisher-listings']);
      toast.success('Protocol deactivated and removed from hub.');
    },
    onError: () => {
      toast.error('Failed to deactivate protocol. System error.');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently deactivate this protocol?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Live' },
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Review' },
      DRAFT: { bg: 'bg-zinc-800/50', text: 'text-zinc-500', label: 'Draft' },
      EXPIRED: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Ended' }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-8 space-y-10 bg-zinc-950"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-zinc-100 tracking-tighter uppercase leading-none">Deployment Hub</h1>
          <p className="text-zinc-500 font-medium text-lg uppercase tracking-tight">Detailed ledger of all activated and pending opportunity protocols.</p>
        </div>
        <Link to="/publisher/create" className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-white text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 active:scale-95 whitespace-nowrap">
          <span className="material-symbols-outlined font-black">add</span>
          <span>New Deployment</span>
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-[32px] border border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/20 border-b border-zinc-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Opportunity Protocol</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Protocol Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
                        <span className="material-symbols-outlined text-4xl">radar</span>
                        <p className="mt-4 text-sm font-bold uppercase tracking-widest">Fetching Ledgers...</p>
                    </div>
                  </td>
                </tr>
              ) : opportunities?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
                    No active protocols detected in the current sector.
                  </td>
                </tr>
              ) : (
                opportunities?.map((opp) => (
                  <tr key={opp._id} className="group hover:bg-zinc-800/20 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700 group-hover:border-primary/50 transition-colors shadow-sm text-zinc-600">
                            {opp.type === 'SCHOLARSHIP' ? <span className="material-symbols-outlined">school</span> : <span className="material-symbols-outlined">work</span>}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-black text-zinc-100 uppercase tracking-tight">{opp.title?.en || opp.title}</p>
                          <p className="text-[10px] font-medium text-zinc-500">Initiated on {new Date(opp.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10 uppercase tracking-tighter">{opp.type}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(opp.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/publisher/applicants?opportunityId=${opp._id}`} className="size-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all" title="Manage Applicants">
                            <span className="material-symbols-outlined text-[18px]">group</span>
                          </Link>
                          <Link to={`/publisher/opportunity/${opp._id}`} className="size-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all" title="View Public Listing">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </Link>
                          <Link to={`/publisher/edit/${opp._id}`} className="size-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Edit Protocol">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button 
                            onClick={() => handleDelete(opp._id)}
                            className="size-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all" 
                            title="Deactivate Protocol"
                            disabled={deleteMutation.isLoading}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default PublisherListings;
