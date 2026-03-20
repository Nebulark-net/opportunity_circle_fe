import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../lib/api';
import { userService } from '../../services/user.service';
import { useApply } from '../../hooks/useApply';
import { useAuthStore } from '../../stores/authStore';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Skeleton from '../../components/loaders/Skeleton';

const OpportunityDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
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
                <Skeleton className="h-8 w-1/3 bg-zinc-900" />
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 flex flex-col gap-8">
                        <Skeleton className="h-[500px] w-full bg-zinc-900 rounded-3xl" />
                    </div>
                    <div className="w-full lg:w-80 flex flex-col gap-6">
                        <Skeleton className="h-64 w-full bg-zinc-900 rounded-3xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 w-full text-center bg-zinc-900 rounded-3xl border border-error/20 my-10">
                <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
                <h2 className="text-[13px] text-zinc-100 font-black uppercase tracking-[0.2em] mb-1">Failed to Synchronize Details</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-2">The opportunity you're looking for could not be retrieved.</p>
                <Link to="/explore" className="mt-8 inline-block btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em]">Return to Feed</Link>
            </div>
        )
    }

    const { title, organizationName, location, description, imageUrl, type } = opportunity;
    const displayTitle = typeof title === 'object' ? title.en : title;
    const displayDescription = typeof description === 'object' ? description.en : description;

    return (
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 w-full flex flex-col gap-8 animate-in fade-in duration-700">
            <nav className="flex flex-wrap gap-3 items-center">
                <Link className="text-zinc-400 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all" to="/">Home</Link>
                <span className="text-zinc-700 material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="text-zinc-400 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-all" to="/explore">Opportunities</Link>
                <span className="text-zinc-700 material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] truncate max-w-[200px]">{displayTitle}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col gap-8">
                    <section className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 border border-zinc-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8 mb-12 relative z-10">
                            <div className="size-32 md:size-40 bg-white rounded-[2rem] p-4 flex items-center justify-center shrink-0 border-4 border-background-dark shadow-xl overflow-hidden">
                                {imageUrl ? (
                                    <img 
                                        alt={organizationName} 
                                        className="w-full h-full object-contain" 
                                        src={imageUrl} 
                                    />
                                ) : (
                                    <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-black text-5xl group-hover:scale-110 transition-transform">
                                        {organizationName?.charAt(0) || 'O'}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <span className="inline-flex w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">{type}</span>
                                <h1 className="text-3xl md:text-3xl font-black leading-[1.1] tracking-[0.05em] uppercase text-zinc-100">{displayTitle}</h1>
                                <p className="text-xs text-zinc-400 font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">business</span>
                                    {organizationName} • {location}
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-100 mb-6 flex items-center gap-3">
                                <div className="w-8 h-1 bg-primary rounded-full"></div>
                                Description
                            </h3>
                            <div className="text-zinc-400/90 text-xs font-medium leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: displayDescription }}></div>
                        </div>
                    </section>
                </div>

                <div className="w-full lg:w-80 flex flex-col gap-6">
                    <aside className="bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-xl sticky top-28">
                        <h3 className="text-[11px] text-zinc-100 font-black uppercase tracking-[0.3em] mb-8 text-center">
                            {user?.role === 'PUBLISHER' ? 'Publisher Actions' : 'Application Portal'}
                        </h3>
                        <div className="flex flex-col gap-4">
                            {user?.role === 'PUBLISHER' ? (
                                <>
                                    <Link 
                                        to={`/publisher/edit/${id}`}
                                        className="w-full btn-primary h-12 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                                    >
                                        Edit Protocol
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">edit</span>
                                    </Link>
                                    <Link 
                                        to={`/publisher/applicants?opportunityId=${id}`}
                                        className="w-full h-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">group</span>
                                        Manage Applicants
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleApply}
                                        disabled={applyMutation.isPending}
                                        className="w-full btn-primary h-12 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group disabled:opacity-50"
                                    >
                                        {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={toggleSaveMutation.isPending}
                                        className="w-full h-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">bookmark</span>
                                        {toggleSaveMutation.isPending ? 'Updating...' : 'Save for Later'}
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-zinc-800/50 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deadline</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-100">{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Funding</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-100">{opportunity.fundingType || 'N/A'}</p>
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
