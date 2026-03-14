import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, Clock, Bookmark, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';
import api from '../../lib/api';
import ApplyForm from '../../components/opportunities/ApplyForm';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [showApplyForm, setShowApplyForm] = useState(false);

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      const response = await api.get(`/opportunities/${id}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="animate-pulse space-y-8">
    <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-card"></div>
    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-card"></div>
  </div>;

  if (error) return <div className="text-center py-20">Error loading opportunity</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link to="/explore" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
        <ArrowLeft size={18} />
        Back to Explore
      </Link>

      {/* Hero Section */}
      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-card p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-3xl">
            {opportunity.company?.charAt(0)}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {opportunity.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                {opportunity.category}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{opportunity.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">{opportunity.company}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="p-3">
              <Bookmark size={20} />
            </Button>
            <Button variant="secondary" className="p-3">
              <Share2 size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-border-dark">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
            <div className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-primary" />
              <span>{opportunity.location}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Deadline</p>
            <div className="flex items-center gap-2 font-semibold">
              <Calendar size={16} className="text-primary" />
              <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Salary/Stipend</p>
            <div className="flex items-center gap-2 font-semibold">
              <Clock size={16} className="text-primary" />
              <span>{opportunity.salaryRange || 'Not disclosed'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Apply Before</p>
            <div className="font-semibold text-red-500">
              {Math.ceil((new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Description</h2>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
              {opportunity.description || 'No description provided.'}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Requirements</h2>
            <ul className="space-y-3">
              {opportunity.requirements?.map((req, i) => (
                <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {req}
                </li>
              )) || 'No requirements listed.'}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="text-center space-y-4">
              <h3 className="text-lg font-bold">Ready to apply?</h3>
              <p className="text-sm text-slate-500">Submit your application today and take the next step in your career.</p>
              <Button 
                className="w-full py-4 text-lg" 
                onClick={() => setShowApplyForm(true)}
              >
                Apply Now
              </Button>
            </Card>

            <Card>
              <h3 className="font-bold mb-4">About the Publisher</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div>
                  <p className="text-sm font-bold">{opportunity.publisherName || 'Anonymous'}</p>
                  <p className="text-xs text-slate-500">Verified Publisher</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs">View Profile</Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal/Form */}
      {showApplyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark w-full max-w-xl rounded-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
              <h2 className="text-xl font-bold">Apply for {opportunity.title}</h2>
              <Button variant="ghost" className="p-2" onClick={() => setShowApplyForm(false)}>
                <ArrowLeft size={20} />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto">
              <ApplyForm opportunityId={id} requirements={opportunity.applicationRequirements} onClose={() => setShowApplyForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetail;
