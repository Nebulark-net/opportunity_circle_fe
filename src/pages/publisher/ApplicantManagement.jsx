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
      case 'ACCEPTED': return 'text-emerald-500 bg-emerald-500/10';
      case 'REJECTED': return 'text-rose-500 bg-rose-500/10';
      case 'SHORTLISTED': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
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
    <div className="h-full flex overflow-hidden -m-4 lg:-m-8">
      {/* List Pane */}
      <div className={`flex-1 flex flex-col border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark ${selectedApplicant ? 'hidden xl:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Applicants</h1>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
              placeholder="Search name or keywords..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {applicants?.length === 0 ? (
            <div className="p-20 text-center text-slate-500">No applicants yet.</div>
          ) : (
            applicants?.map((app) => (
              <div 
                key={app._id}
                onClick={() => setSelectedApplicant(app)}
                className={`p-5 cursor-pointer transition-all border-l-4 ${
                  selectedApplicant?._id === app._id 
                    ? 'bg-primary/5 border-primary' 
                    : 'hover:bg-slate-50 dark:hover:bg-surface-dark/50 border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {app.userId?.profilePhotoUrl ? (
                      <img src={app.userId.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      app.userId?.fullName?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{app.userId?.fullName}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{app.opportunityId?.title?.en || app.opportunityId?.title}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase ${getStatusColor(app.status)}`}>
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
      <div className={`flex-1 xl:flex-none xl:w-[500px] flex flex-col bg-slate-50 dark:bg-surface-dark/30 ${!selectedApplicant ? 'hidden xl:flex' : 'flex'}`}>
        {!selectedApplicant ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
            <FileText size={64} className="mb-4 opacity-20" />
            <p>Select an applicant to view details</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <button 
              onClick={() => setSelectedApplicant(null)}
              className="xl:hidden text-primary font-bold flex items-center gap-1 mb-4"
            >
              <ChevronRight className="rotate-180" /> Back to list
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl text-primary font-black shadow-xl overflow-hidden">
                {selectedApplicant.userId?.profilePhotoUrl ? (
                  <img src={selectedApplicant.userId.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedApplicant.userId?.fullName?.charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedApplicant.userId?.fullName}</h2>
                <p className="text-primary font-bold text-sm">{selectedApplicant.userId?.email}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'ACCEPTED')}
                  disabled={updateStatusMutation.isLoading}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'UNDER_REVIEW')}
                  disabled={updateStatusMutation.isLoading}
                  className="px-4 py-2 bg-slate-200 dark:bg-border-dark text-slate-700 dark:text-white text-xs font-black rounded-lg disabled:opacity-50"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant._id, 'REJECTED')}
                  disabled={updateStatusMutation.isLoading}
                  className="px-4 py-2 bg-rose-500/10 text-rose-500 text-xs font-black rounded-lg disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-border-dark"></div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Application Answers</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Statement of Purpose / Notes</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{selectedApplicant.notes || 'No statement provided.'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Documents</h3>
                {selectedApplicant.resume && (
                  <div className="bg-white dark:bg-background-dark p-3 rounded-lg flex items-center justify-between border border-slate-200 dark:border-border-dark hover:border-primary/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3 text-left">
                      <FileText className="text-primary size-5" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">Candidate_Resume.pdf</span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-tighter">PDF Document</span>
                      </div>
                    </div>
                    <a href={selectedApplicant.resume} target="_blank" rel="noopener noreferrer">
                      <Download className="text-slate-400 size-4" />
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
