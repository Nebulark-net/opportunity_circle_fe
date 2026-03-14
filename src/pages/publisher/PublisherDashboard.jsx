import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, Eye, CheckCircle, Activity, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import StatCard from '../../components/dashboard/StatCard';
import api from '../../lib/api';

const PublisherDashboard = () => {
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['publisher-listings'],
    queryFn: async () => {
      const response = await api.get('/publishers/opportunities');
      return response.data;
    },
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['publisher-stats'],
    queryFn: async () => {
      const response = await api.get('/publishers/dashboard/stats');
      return response.data;
    },
  });

  const listings = listingsData?.data?.opportunities || [];
  const stats = statsData?.data || {};

  const statCards = [
    { 
      title: 'Engagement Rate', 
      value: stats.engagementRate || 0, 
      icon: Activity, 
      description: 'Based on views & applicants' 
    },
    { 
      title: 'Verified Programs', 
      value: stats.verifiedProgramsCount || 0, 
      icon: Award, 
      description: 'Active programs from verified profile' 
    },
    { 
      title: 'Active Listings', 
      value: stats.activeListingsCount || 0, 
      icon: Eye, 
      description: 'Currently visible to seekers' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Publisher Dashboard</h1>
          <p className="text-slate-500">Manage your listings and track applicant progress.</p>
        </div>
        <Link to="/publisher/create">
          <Button className="flex items-center gap-2 px-6">
            <Plus size={20} />
            Post Opportunity
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <StatCard 
            key={stat.title} 
            {...stat} 
            loading={statsLoading} 
          />
        ))}
      </div>

      {/* Listings Table */}
      <Card className="overflow-hidden p-0" hoverEffect={false}>
        <div className="p-6 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Opportunities</h2>
          <Link to="/publisher/listings">
            <Button variant="ghost" className="text-xs">View All</Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Opportunity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Posted On</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {listingsLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center animate-pulse text-slate-400">Loading your listings...</td>
                </tr>
              ) : listings.length > 0 ? (
                listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{listing.title?.en || listing.title}</p>
                      <p className="text-xs text-slate-500">{listing.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        listing.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 
                        listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-slate-400" />
                        <span className="font-bold">{listing.applicantCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/opportunities/${listing._id}`}>
                          <Button variant="ghost" className="p-2">
                            <Eye size={18} />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    You haven't posted any opportunities yet.
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

export default PublisherDashboard;
