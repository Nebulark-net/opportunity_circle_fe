import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, ShieldAlert, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import ModerationActions from '../../components/admin/ModerationActions';
import api from '../../lib/api';

const ModerationQueue = () => {
  const { data: pendingItems, isLoading } = useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      const response = await api.get('/opportunities', { params: { status: 'pending' } });
      return response.data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldAlert className="text-primary" size={32} />
          Moderation Queue
        </h1>
        <p className="text-slate-500">Review and approve opportunities before they go live.</p>
      </div>

      <Card className="overflow-hidden p-0" hoverEffect={false}>
        <div className="p-6 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-500" />
            <span className="font-bold">{pendingItems?.data?.length || 0} Pending Items</span>
          </div>
          <Button variant="secondary" className="flex items-center gap-2 text-xs">
            <Filter size={14} />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Opportunity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Publisher</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Submitted On</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center animate-pulse text-slate-400">Loading queue...</td>
                </tr>
              ) : pendingItems?.data?.length > 0 ? (
                pendingItems.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.category} • {item.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{item.company}</p>
                      <p className="text-xs text-slate-500">{item.publisherName || 'External'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-4">
                        <Link to={`/opportunities/${item.id}`}>
                          <Button variant="ghost" className="p-2" title="View Details">
                            <Eye size={18} />
                          </Button>
                        </Link>
                        <ModerationActions opportunityId={item.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                    Queue is empty. Great job! 🚀
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ModerationQueue;
