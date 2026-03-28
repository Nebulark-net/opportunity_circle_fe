import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesService } from '../../services/opportunities.service';
import { useAuthStore } from '../../stores/authStore';
import Skeleton from '../../components/loaders/Skeleton';
import { toast } from 'sonner';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { 
  MapPin, 
  School, 
  Hub, 
  Calendar, 
  Business, 
  Payments, 
  ChevronRight, 
  Bookmark,
  Share2
} from 'lucide-react';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => opportunitiesService.getOne(id),
  });

  const toggleSaveMutation = useMutation({
    mutationFn: () => opportunitiesService.toggleSave(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['opportunity', id]);
      toast.success('Saved status updated');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="w-full lg:w-[30%] h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Error loading opportunity</h2>
        <p className="text-slate-500 mt-2">{error?.message || 'Opportunity not found'}</p>
        <Link to="/dashboard" className="text-primary mt-4 inline-block font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  const opportunity = response.data;
  const isSaved = user?.savedItems?.includes(id);
  const sanitizedDescription = sanitizeHtml(opportunity.description.en || opportunity.description);
  const sanitizedRequirements = sanitizeHtml(opportunity.requirements?.en || opportunity.requirements);

  return (
    <div className="flex flex-col max-w-[1200px] w-full mx-auto gap-6 px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap gap-2 items-center text-sm font-medium">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Home</Link>
        <ChevronRight size={16} className="text-slate-400" />
        <Link to="/explore" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">{opportunity.type}s</Link>
        <ChevronRight size={16} className="text-slate-400" />
        <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{opportunity.title.en || opportunity.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex flex-col w-full lg:w-[70%] gap-8">
          <section className="bg-white dark:bg-surface-dark rounded-xl p-8 border border-slate-200 dark:border-surface-dark-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="bg-white p-2 rounded-lg size-32 border border-slate-100 dark:border-surface-dark-border shrink-0 flex items-center justify-center overflow-hidden">
                {opportunity.imageUrl ? (
                  <img src={opportunity.imageUrl} alt={opportunity.organizationName} className="w-full h-full object-contain" />
                ) : (
                  <Business size={48} className="text-primary" />
                )}
              </div>
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  {opportunity.title.en || opportunity.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-normal">
                  {opportunity.organizationName} • {opportunity.location}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap mb-8">
              <div className="flex h-8 items-center gap-x-2 rounded-lg bg-slate-100 dark:bg-surface-dark-border px-4 border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-200 text-sm font-medium">
                <MapPin size={16} />
                <span>{opportunity.location}</span>
              </div>
              <div className="flex h-8 items-center gap-x-2 rounded-lg bg-slate-100 dark:bg-surface-dark-border px-4 border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-200 text-sm font-medium">
                <School size={16} />
                <span>{opportunity.educationLevel || 'All Levels'}</span>
              </div>
              <div className="flex h-8 items-center gap-x-2 rounded-lg bg-slate-100 dark:bg-surface-dark-border px-4 border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-200 text-sm font-medium">
                <Hub size={16} />
                <span>{opportunity.type}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-surface-dark-border pb-2 mb-4">
                Description
              </h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
              
              {opportunity.requirements && (
                <>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">Requirements</h4>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedRequirements }} />
                </>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="flex flex-col w-full lg:w-[30%] gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-surface-dark-border shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Details</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{opportunity.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Business size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organization</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{opportunity.organizationName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Payments size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Funding</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{opportunity.fundingType || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-surface-dark-border flex flex-col gap-3">
              <a 
                href={opportunity.applyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-md shadow-primary/20"
              >
                Apply Now
              </a>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => toggleSaveMutation.mutate()}
                  className={`flex items-center justify-center gap-2 rounded-lg h-12 border border-slate-200 dark:border-surface-dark-border bg-slate-50 dark:bg-surface-dark-border hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-semibold ${isSaved ? 'text-primary' : 'text-slate-700 dark:text-white'}`}
                >
                  <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg h-12 border border-slate-200 dark:border-surface-dark-border bg-slate-50 dark:bg-surface-dark-border hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-semibold text-slate-700 dark:text-white">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OpportunityDetail;
