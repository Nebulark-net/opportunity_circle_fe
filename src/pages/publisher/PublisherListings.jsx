import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusCircle, MoreVertical } from 'lucide-react';
import api from '../../lib/api';
import Button from '../../components/shared/Button';

const PublisherListings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['publisher-listings'],
    queryFn: async () => {
      const response = await api.get('/publishers/listings');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Opportunities</h1>
          <p className="text-slate-500 dark:text-accent-muted">Create, edit and track your early-career listings.</p>
        </div>
        <Link to="/publisher/create">
          <Button className="flex items-center gap-2 px-6 py-2.5">
            <PlusCircle size={20} />
            <span>Create New Opportunity</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-border-dark">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Opportunity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                    No opportunities found. Start by creating your first listing!
                  </td>
                </tr>
              ) : (
                data?.map((opp) => (
                  <tr key={opp._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 dark:text-white">{opp.title}</div>
                      <div className="text-xs text-slate-500">Created on {new Date(opp.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{opp.type}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        opp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {opp.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublisherListings;
