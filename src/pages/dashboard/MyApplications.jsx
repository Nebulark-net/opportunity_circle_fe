import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const MyApplications = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const response = await api.get('/seekers/applications');
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

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load applications. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Applications</h1>
        <p className="text-slate-500 dark:text-accent-muted">Track your submission status and progress.</p>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-200 dark:border-border-dark">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">send</span>
          <p className="text-slate-500 dark:text-accent-muted font-medium">You haven't applied to any opportunities yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-border-dark overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-border-dark">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Opportunity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.map((application) => (
                <tr key={application._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{application.opportunity?.title}</span>
                      <span className="text-xs text-slate-500">{application.opportunity?.organizationName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
