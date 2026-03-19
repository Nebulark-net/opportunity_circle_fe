import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../lib/api';
import { userService } from '../../services/user.service';
import { useApply } from '../../hooks/useApply';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Skeleton from '../../components/loaders/Skeleton';

const OpportunityDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: result, isLoading, error } = useQuery({
        queryKey: ['opportunity', id],
        queryFn: () => api.get(`/opportunities/${id}`).then(res => res.data.data)
    });

    const applyMutation = useApply(id);

    const toggleSaveMutation = useMutation({
        mutationFn: () => userService.toggleSaveItem(id, 'OPPORTUNITY'),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['opportunity', id]);
            queryClient.invalidateQueries(['saved-opportunities']);
            toast.success(data.message || 'Updated saved status');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update saved status');
        }
    });

    const handleApply = () => {
        // Here you might want to show a modal for more info, but for now direct apply
        applyMutation.mutate(new FormData());
    };

    const handleSave = () => {
        toggleSaveMutation.mutate();
    };

    const opportunity = result;

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 w-full flex flex-col gap-10">
                <Skeleton className="h-8 w-1/3 bg-surface-dark" />
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 flex flex-col gap-8">
                        <Skeleton className="h-[500px] w-full bg-surface-dark rounded-3xl" />
                    </div>
                    <div className="w-full lg:w-80 flex flex-col gap-6">
                        <Skeleton className="h-64 w-full bg-surface-dark rounded-3xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 w-full text-center bg-surface-dark rounded-3xl border border-error/20 my-10">
                <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
                <h2 className="text-off-white text-2xl font-black uppercase tracking-tight">Failed to Synchronize Details</h2>
                <p className="text-light-gray mt-2 font-medium">The opportunity you're looking for could not be retrieved.</p>
                <Link to="/explore" className="mt-8 inline-block btn-primary px-8 py-3 uppercase tracking-widest text-xs font-black">Return to Feed</Link>
            </div>
        )
    }

    const { title, organizationName, location, description, imageUrl, type } = opportunity;
    const displayTitle = typeof title === 'object' ? title.en : title;
    const displayDescription = typeof description === 'object' ? description.en : description;

    return (
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 w-full flex flex-col gap-8 animate-in fade-in duration-700">
            <nav className="flex flex-wrap gap-3 items-center">
                <Link className="text-light-gray hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all" to="/">Home</Link>
                <span className="text-border-dark material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="text-light-gray hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all" to="/explore">Opportunities</Link>
                <span className="text-border-dark material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] truncate max-w-[200px]">{displayTitle}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col gap-8">
                    <section className="bg-surface-dark rounded-[2.5rem] p-8 md:p-12 border border-border-dark shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8 mb-12 relative z-10">
                            <div className="size-32 md:size-40 bg-white rounded-[2rem] p-4 flex items-center justify-center shrink-0 border-4 border-background-dark shadow-xl overflow-hidden">
                                <img 
                                    alt={organizationName} 
                                    className="w-full h-full object-contain" 
                                    src={imageUrl || 'https://via.placeholder.com/160'} 
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{type}</span>
                                <h1 className="text-off-white text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase">{displayTitle}</h1>
                                <p className="text-light-gray text-lg font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">business</span>
                                    {organizationName} • {location}
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-off-white text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <div className="w-8 h-1 bg-primary rounded-full"></div>
                                Description
                            </h3>
                            <div className="text-light-gray/90 text-base font-medium leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: displayDescription }}></div>
                        </div>
                    </section>
                </div>

                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <aside className="bg-surface-dark rounded-[2rem] p-8 border border-border-dark shadow-xl sticky top-28">
                        <h3 className="text-off-white text-sm font-black uppercase tracking-[0.2em] mb-8 text-center">Application Portal</h3>
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={handleApply}
                                disabled={applyMutation.isPending}
                                className="w-full btn-primary h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={toggleSaveMutation.isPending}
                                className="w-full h-14 rounded-2xl bg-background-dark border border-border-dark text-light-gray hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-sm disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                                {toggleSaveMutation.isPending ? 'Updating...' : 'Save for Later'}
                            </button>
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-border-dark/50 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-border-dark">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-light-gray uppercase tracking-widest">Deadline</p>
                                    <p className="text-xs font-bold text-off-white">{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-border-dark">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-light-gray uppercase tracking-widest">Funding</p>
                                    <p className="text-xs font-bold text-off-white">{opportunity.fundingType || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetail;
