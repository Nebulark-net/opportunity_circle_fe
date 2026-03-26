import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Link } from 'react-router-dom';
import OpportunityCard from '../../components/dashboard/OpportunityCard';

const SavedOpportunities = () => {
    const queryClient = useQueryClient();

    // Fetch Saved Items
    const { data: savedItems, isLoading, error } = useQuery({
        queryKey: ['saved-opportunities'],
        queryFn: () => api.get('/seekers/saved-items').then(res => res.data.data || [])
    });

    // Fetch Applications to show 'Applied' status on saved cards
    const { data: applications } = useQuery({
        queryKey: ['my-applications'],
        queryFn: () => api.get('/seekers/applications').then(res => res.data.data || [])
    });

    const appliedIds = new Set(applications?.map(app => app.opportunityId || app.opportunity?._id));

    // Save Toggle Mutation
    const toggleSaveMutation = useMutation({
        mutationFn: (opportunityId) => api.post('/seekers/toggle-save', { itemId: opportunityId, itemType: 'OPPORTUNITY' }),
        onMutate: async (opportunityId) => {
            await queryClient.cancelQueries(['saved-opportunities']);
            const previousSaved = queryClient.getQueryData(['saved-opportunities']);
            queryClient.setQueryData(['saved-opportunities'], (old = []) => old.filter(item => item._id !== opportunityId));
            return { previousSaved };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['saved-opportunities'], context.previousSaved);
        },
        onSettled: () => {
            queryClient.invalidateQueries(['saved-opportunities']);
        }
    });

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header / Action Bar */}
            <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black text-zinc-100 uppercase tracking-[0.05em] italic">Archive Nexus</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">
                            {isLoading ? 'Decrypting bookmarks...' : `Stored Intelligence: ${savedItems?.length || 0} nodes`}
                        </p>
                    </div>
                     <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                        {savedItems?.length || 0} Calibrated
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800"></div>)}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-red-500/10">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4 opacity-50">data_alert</span>
                        <p className="text-red-500/80 font-black text-xs uppercase tracking-[0.3em]">Protocol Failure</p>
                    </div>
                ) : savedItems?.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center gap-6">
                        <div className="size-20 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-700 border border-zinc-800">
                            <span className="material-symbols-outlined text-4xl">bookmark_border</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] text-zinc-100 font-black uppercase tracking-[0.2em]">Archive Empty</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">No data points currently bookmarked in this sector.</p>
                        </div>
                        <Link to="/dashboard/feed" className="px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-lg hover:bg-primary/90 transition-all uppercase tracking-[0.3em] shadow-hfas-teal">
                            Explore Nexus
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {savedItems?.map((item) => {
                            const opportunity = item.opportunityId;
                            if (!opportunity) return null;

                            return (
                                <OpportunityCard 
                                    key={opportunity._id} 
                                    opportunity={opportunity} 
                                    isSaved={true}
                                    isApplied={appliedIds.has(opportunity._id)}
                                    onSaveToggle={(id) => toggleSaveMutation.mutate(id)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedOpportunities;
