import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronRight, FileText, Download } from 'lucide-react';
import api from '../../lib/api';

const ApplicantManagement = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  const { data: applicants, isLoading } = useQuery({
    queryKey: ['publisher-applicants'],
    queryFn: async () => {
      const response = await api.get('/publishers/applicants');
      return response.data.data;
    },
  });

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
                    {app.seeker?.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{app.seeker?.fullName}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{app.opportunity?.title}</p>
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
              <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl text-primary font-black shadow-xl">
                {selectedApplicant.seeker?.fullName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedApplicant.seeker?.fullName}</h2>
                <p className="text-primary font-bold text-sm">{selectedApplicant.seeker?.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-white text-xs font-black rounded-lg hover:opacity-90">Accept</button>
                <button className="px-4 py-2 bg-slate-200 dark:bg-border-dark text-slate-700 dark:text-white text-xs font-black rounded-lg">Shortlist</button>
                <button className="px-4 py-2 bg-rose-500/10 text-rose-500 text-xs font-black rounded-lg">Reject</button>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-border-dark"></div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Application Answers</h3>
                <div className="space-y-4">
                  {selectedApplicant.answers?.map((ans, i) => (
                    <div key={i}>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{ans.question}</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{ans.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Documents</h3>
                {selectedApplicant.documents?.map((doc, i) => (
                  <div key={i} className="bg-white dark:bg-background-dark p-3 rounded-lg flex items-center justify-between border border-slate-200 dark:border-border-dark hover:border-primary/50 cursor-pointer transition-all">
                    <div className="flex items-center gap-3 text-left">
                      <FileText className="text-primary size-5" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{doc.split('/').pop()}</span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-tighter">PDF Document</span>
                      </div>
                    </div>
                    <Download className="text-slate-400 size-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantManagement;
