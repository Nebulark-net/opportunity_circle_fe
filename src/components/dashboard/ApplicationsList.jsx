import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Card from '../shared/Card';
import api from '../../lib/api';

const ApplicationsList = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await api.get('/seeker/applications');
      return response.data;
    },
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Pending' };
      case 'accepted':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100', label: 'Accepted' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Rejected' };
      case 'withdrawn':
        return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-100', label: 'Withdrawn' };
      default:
        return { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100', label: status };
    }
  };

  if (isLoading) return <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-card"></div>
    ))}
  </div>;

  return (
    <div className="space-y-4">
      {applications?.length > 0 ? (
        applications.map((app) => {
          const status = getStatusInfo(app.status);
          return (
            <Card key={app.id} className="p-4 md:p-6" hoverEffect={false}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                    {app.opportunityTitle?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg dark:text-white truncate">{app.opportunityTitle}</h4>
                    <p className="text-sm text-slate-500">{app.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.color} text-xs font-bold uppercase`}>
                    <status.icon size={14} />
                    <span>{status.label}</span>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-500">Applied on</p>
                    <p className="text-sm font-semibold">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-surface-dark border-2 border-dashed border-slate-200 dark:border-border-dark rounded-card">
          <p className="text-slate-500">You haven't applied to any opportunities yet.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
