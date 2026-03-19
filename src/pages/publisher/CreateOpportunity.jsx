import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { publisherService } from '../../services/publisher.service';
import { opportunitiesService } from '../../services/opportunities.service';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title protocol must be at least 5 characters'),
  company: z.string().min(2, 'Organization identity required'),
  type: z.string(),
  category: z.string().optional(),
  location: z.string().min(2, 'Deployment location required'),
  deadline: z.string().min(1, 'Termination date required'),
  salaryRange: z.string().optional(),
  description: z.string().min(20, 'Detailed intelligence must be at least 20 characters'),
});

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: JSON.parse(localStorage.getItem('opportunity_draft') || '{}'),
  });

  // Fetch existing data for Edit Mode
  const { data: existingOpp, isLoading: isFetching } = useQuery({
    queryKey: ['publisher-opportunity', id],
    queryFn: () => opportunitiesService.getOne(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingOpp?.data) {
      const opp = existingOpp.data;
      reset({
        title: opp.title?.en || opp.title,
        company: opp.organizationName,
        type: opp.type?.toLowerCase().replace('_', '-'),
        category: opp.category,
        location: opp.location,
        deadline: opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : '',
        salaryRange: opp.salaryRange,
        description: opp.description?.en || opp.description,
      });
    }
  }, [existingOpp, reset]);

  const formData = watch();

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem('opportunity_draft', JSON.stringify(formData));
    }
  }, [formData, isEditMode]);

  const mutation = useMutation({
    mutationFn: (data) => isEditMode 
      ? publisherService.updateOpportunity(id, data)
      : publisherService.createOpportunity(data),
    onSuccess: () => {
      toast.success(isEditMode ? 'Protocol successfully updated!' : 'Opportunity protocol successfully deployed!');
      localStorage.removeItem('opportunity_draft');
      navigate('/publisher/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Deployment protocol failed. System error.');
    },
  });

  const onSubmit = (data) => {
    // Construct a clean payload matching the backend opportunitySchema exactly
    const payload = {
      type: data.type.toUpperCase().replace('-', '_'),
      title: { en: data.title },
      organizationName: data.company,
      description: { en: data.description },
      location: data.location,
      deadline: new Date(data.deadline).toISOString(),
      // Add optional fields if they have values
      ...(data.applyUrl && { applyUrl: data.applyUrl }),
    };
    
    console.log('Dispatching Deployment Payload:', payload);
    mutation.mutate(payload);
  };

  const inputClasses = "w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium";
  const labelClasses = "text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-12"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div className="flex items-center gap-4 text-primary mb-2">
            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">add_task</span>
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Protocol Alpha-1</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Deploy New Opportunity</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Broadcast your mission to our global network of top-tier talent.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Core Identity Section */}
        <section className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Identity</h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className={labelClasses}>Opportunity Title</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">title</span>
                        <input
                            {...register('title')}
                            className={inputClasses}
                            placeholder="e.g. Senior Research Fellow"
                        />
                    </div>
                    {errors.title && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Organization Name</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">corporate_fare</span>
                        <input
                            {...register('company')}
                            className={inputClasses}
                            placeholder="e.g. Acme Industries"
                        />
                    </div>
                    {errors.company && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Deployment Type</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">work</span>
                        <select
                            {...register('type')}
                            className={`${inputClasses} appearance-none cursor-pointer`}
                        >
                            <option value="scholarship">Alpha Scholarship</option>
                            <option value="internship">Industrial Internship</option>
                            <option value="fellowship">Research Fellowship</option>
                            <option value="event">Global Event</option>
                            <option value="workshop">Technical Workshop</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Operational Category</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">category</span>
                        <input
                            {...register('category')}
                            className={inputClasses}
                            placeholder="e.g. Engineering, Research, Arts"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Logistics Section */}
        <section className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics & Scope</h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className={labelClasses}>Location Buffer</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                        <input
                            {...register('location')}
                            className={inputClasses}
                            placeholder="e.g. Remote, Silicon Valley, London"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Termination Date (Deadline)</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">event</span>
                        <input
                            type="date"
                            {...register('deadline')}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className={labelClasses}>Bounty/Compensation (Optional)</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">payments</span>
                        <input
                            {...register('salaryRange')}
                            className={inputClasses}
                            placeholder="e.g. $120k - $150k or Competitive"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Intelligence Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Intelligence</h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="space-y-2">
                <label className={labelClasses}>Mission Objectives & Requirements</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-6 text-slate-400">subject</span>
                    <textarea
                        {...register('description')}
                        className={`${inputClasses} min-h-[300px] pl-12 py-6 resize-none`}
                        placeholder="Detail the responsibilities, requirements and vision for this role..."
                    />
                </div>
                {errors.description && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.description.message}</p>}
            </div>
        </section>

        {/* Deployment Actions */}
        <div className="flex justify-between items-center pt-10 border-t border-slate-200 dark:border-slate-800">
            <button 
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-colors"
            >
                Abort Protocol
            </button>
            <button
                type="submit"
                disabled={mutation.isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-12 rounded-2xl shadow-2xl shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
            >
                {mutation.isLoading ? 'Initiating Deployment...' : 'Deploy Opportunity'}
            </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateOpportunity;
