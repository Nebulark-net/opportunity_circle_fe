import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, FileText, Download } from 'lucide-react';
import { publisherService } from '../../services/publisher.service';
import { toast } from 'sonner';

const ApplicantManagement = () => {
  const [searchParams] = useSearchParams();
  const opportunityId = searchParams.get('opportunityId');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const queryClient = useQueryClient();
  
  const { data: applicants, isLoading } = useQuery({
    queryKey: ['publisher-applicants', opportunityId],
    queryFn: async () => {
      const response = opportunityId 
        ? await publisherService.getOpportunityApplications(opportunityId)
        : await publisherService.getAllApplicants();
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => publisherService.updateApplicationStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['publisher-applicants']);
      toast.success(`Protocol status updated to ${variables.status}`);
      // Update local state if selected
      if (selectedApplicant?._id === variables.id) {
        setSelectedApplicant(prev => ({ ...prev, status: variables.status }));
      }
    },
    onError: () => {
      toast.error('Failed to update protocol status. System rejection.');
    }
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'text-emerald-400 bg-emerald-500/10';
      case 'REJECTED': return 'text-rose-400 bg-rose-500/10';
      case 'SHORTLISTED': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-zinc-950">
      {/* List Pane */}
      <div className={`flex-1 flex flex-col border-r border-zinc-800 bg-zinc-900/40 ${selectedApplicant ? 'hidden xl:flex' : 'flex'}`}>
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/20 sticky top-0 z-10">
          <h1 className="text-2xl font-black text-zinc-100 mb-4 uppercase tracking-tighter">Applicants</h1>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 size-5 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-zinc-100 placeholder:text-zinc-600"
              placeholder="Search name or keywords..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 custom-scrollbar">
          {applicants?.length === 0 ? (
            <div className="p-20 text-center text-zinc-600 uppercase font-black text-xs tracking-widest">No applicants detected in sector.</div>
          ) : (
            applicants?.map((app) => (
              <div 
                key={app._id}
                onClick={() => setSelectedApplicant(app)}
                className={`p-5 cursor-pointer transition-all border-l-4 ${
                  selectedApplicant?._id === app._id 
                    ? 'bg-zinc-800/80 border-primary shadow-inner' 
                    : 'hover:bg-zinc-800/30 border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm">
                    {app.userId?.profilePhotoUrl ? (
                      <img src={app.userId.profilePhotoUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-zinc-500">{app.userId?.fullName?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-zinc-100 truncate uppercase tracking-tighter">{app.userId?.fullName}</h3>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-2">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate uppercase tracking-tight">{app.opportunityId?.title?.en || app.opportunityId?.title}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-white/5 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Pane */}
      <div className={`flex-1 xl:flex-none xl:w-[500px] flex flex-col bg-zinc-950 shadow-2xl relative z-20 ${!selectedApplicant ? 'hidden xl:flex' : 'flex'}`}>
        {!selectedApplicant ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 p-10 text-center gap-4">
            <span className="material-symbols-outlined text-7xl opacity-10">contact_page</span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select an identity to view dossier</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
            <button 
              onClick={() => setSelectedApplicant(null)}
              className="xl:hidden text-primary font-black flex items-center gap-2 mb-6 uppercase text-[10px] tracking-widest group"
            >
              <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
              <span>Back to Registry</span>
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="size-24 rounded-full bg-zinc-800 border-4 border-zinc-800/80 flex items-center justify-center text-3xl text-primary font-black shadow-2xl overflow-hidden p-1 relative group">
                {selectedApplicant.userId?.profilePhotoUrl ? (
                  <img src={selectedApplicant.userId.profilePhotoUrl} alt="" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                ) : (
                  <div className="size-full flex items-center justify-center bg-zinc-900 rounded-full text-zinc-600">{selectedApplicant.userId?.fullName?.charAt(0)}</div>
                )}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter">{selectedApplicant.userId?.fullName}</h2>
                <div className="flex items-center gap-2 justify-center">
                    <span className="material-symbols-outlined text-primary text-[14px]">alternate_email</span>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{selectedApplicant.userId?.email}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-6 w-full max-w-sm">
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'ACCEPTED')}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white text-[10px] font-black rounded-xl hover:bg-emerald-500 disabled:opacity-30 uppercase tracking-widest shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'SHORTLISTED')}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-100 text-[10px] font-black rounded-xl border border-zinc-700 hover:bg-zinc-700 disabled:opacity-30 uppercase tracking-widest transition-all active:scale-95"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'REJECTED')}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 px-4 py-3 bg-rose-900/20 text-rose-500 text-[10px] font-black rounded-xl border border-rose-500/20 hover:bg-rose-500/10 disabled:opacity-30 uppercase tracking-widest transition-all active:scale-95"
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-800 mt-4"></div>

            <div className="space-y-8 pt-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-zinc-600 text-[18px]">notes</span>
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Application Dossier</h3>
                </div>
                <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800/80 shadow-hfas-inner">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-3 border-b border-zinc-800 pb-2">Statement of Intent</p>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">{selectedApplicant.notes || 'No statement provided.'}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-zinc-600 text-[18px]">attachment</span>
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Validated Documents</h3>
                </div>
                {selectedApplicant.resume && (
                  <div className="bg-zinc-900 p-5 rounded-2xl flex items-center justify-between border border-zinc-800 hover:border-primary/50 cursor-pointer transition-all group overflow-hidden relative shadow-hfas-lg px-6">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-5 text-left relative z-10">
                      <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center text-primary border border-zinc-700 group-hover:scale-105 transition-transform">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-zinc-100 uppercase tracking-tight truncate max-w-[180px]">Candidate_Resume.pdf</span>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest uppercase">Validated PDF</span>
                      </div>
                    </div>
                    <a href={selectedApplicant.resume} target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-primary transition-all hover:scale-110 relative z-10">
                      <Download className="size-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantManagement;
