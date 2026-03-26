import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
    CalendarDays, 
    MapPin, 
    Building2, 
    Banknote, 
    ChevronRight, 
    Bookmark, 
    BookmarkCheck,
    Search,
    AlertCircle,
    Send,
    Briefcase,
    GraduationCap,
    Tags
} from 'lucide-react';
import api from '../../lib/api';
import { userService } from '../../services/user.service';
import { useApply } from '../../hooks/useApply';
import { useAuthStore } from '../../stores/authStore';

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuthStore();
    
    const { data: result, isLoading, error } = useQuery({
        queryKey: ['opportunity', id],
        queryFn: () => api.get(`/opportunities/${id}`).then(res => res.data.data)
    });

    const { data: savedQuery } = useQuery({
        queryKey: ['saved-opportunities'],
        queryFn: async () => {
            const res = await userService.getSavedItems('OPPORTUNITY');
            return res.data; 
        },
        enabled: isAuthenticated && user?.role === 'SEEKER',
    });

    const isSaved = savedQuery?.some(item => 
        (item.item && typeof item.item === 'object' ? item.item._id : item.item) === id || item._id === id
    );

    const applyMutation = useApply(id);

    const toggleSaveMutation = useMutation({
        mutationFn: () => userService.toggleSaveItem(id, 'OPPORTUNITY'),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['saved-opportunities']);
            toast.success(data.message || 'Updated saved status');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update saved status');
        }
    });

    const handleApply = () => {
        if (!isAuthenticated) {
            toast.error('Please create an account or sign in to apply.');
            navigate('/register');
            return;
        }
        if (user?.role === 'PUBLISHER') {
            toast.error('Publishers cannot apply to opportunities.');
            return;
        }
        
        if (result?.applyUrl) {
            window.open(result.applyUrl, '_blank');
        } else {
            applyMutation.mutate(new FormData());
        }
    };

    const handleSave = () => {
        if (!isAuthenticated) {
            toast.error('Please create an account to save opportunities.');
            navigate('/register');
            return;
        }
        if (user?.role === 'PUBLISHER') {
            toast.error('Publishers cannot save opportunities.');
            return;
        }
        toggleSaveMutation.mutate();
    };

    if (isLoading) {
         return (
             <div className="flex h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
                     <span className="material-symbols-outlined text-4xl">radar</span>
                     <p className="text-xs font-bold uppercase tracking-[0.3em]">Loading details...</p>
                 </div>
             </div>
         );
    }

    if (error || !result) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center bg-zinc-950 px-6 text-center">
                <AlertCircle className="size-16 text-error mb-6" />
                <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight mb-2">Opportunity Not Found</h2>
                <p className="text-sm font-medium text-zinc-400 max-w-md mx-auto mb-8">
                    The opportunity you are looking for may have been removed or the link is invalid.
                </p>
                <Link to="/explore" className="btn-primary px-8 py-3 rounded-xl font-bold transition-colors">
                    Return to Explore
                </Link>
            </div>
        );
    }

    const opportunity = result;
    const { 
        title, organizationName, location, description, imageUrl, type, createdAt, 
        educationLevel, fundingType, deadline, specificRequirements, tags, salary
    } = opportunity;
    
    const displayTitle = typeof title === 'object' ? title.en : title;
    const displayDescription = typeof description === 'object' ? description.en : description;
    const displaySpecificReqs = typeof specificRequirements === 'object' ? specificRequirements.en : specificRequirements;
    
    const isPublisherOwner = user?.role === 'PUBLISHER' && opportunity.publisher?._id === user._id;
    const isAdmin = user?.role === 'ADMIN';

    return (
        <main className="min-h-screen bg-zinc-950 font-display text-zinc-100 pb-20">
            <div className="px-6 lg:px-10 py-8 flex flex-1 justify-center">
                <div className="flex flex-col max-w-[1200px] w-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 items-center">
                        <Link to="/" className="text-zinc-500 hover:text-zinc-300 text-xs font-black uppercase tracking-[0.2em] transition-colors">Home</Link>
                        <ChevronRight className="text-zinc-600 size-4" />
                        <Link to="/explore" className="text-zinc-500 hover:text-zinc-300 text-xs font-black uppercase tracking-[0.2em] transition-colors">Explore</Link>
                        <ChevronRight className="text-zinc-600 size-4" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.2em] truncate max-w-[200px] md:max-w-none">{displayTitle}</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8 mt-4">
                        {/* Main Content Area */}
                        <div className="flex flex-col w-full lg:w-[70%] gap-8">
                            <section className="bg-zinc-900 rounded-[2rem] p-8 md:p-10 border border-zinc-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                                
                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row gap-8 mb-10 relative z-10">
                                    <div className="shrink-0 aspect-square rounded-[2rem] h-28 sm:h-36 w-28 sm:w-36 border-4 border-zinc-950 bg-white p-3 flex items-center justify-center shadow-lg overflow-hidden">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={organizationName} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-5xl font-black text-primary/30">{organizationName?.charAt(0) || 'O'}</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center gap-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="inline-flex items-center justify-center px-4 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                                {type}
                                            </span>
                                        </div>
                                        <h1 className="text-zinc-100 text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight uppercase">
                                            {displayTitle}
                                        </h1>
                                        <p className="text-zinc-400 text-sm sm:text-base font-bold tracking-widest uppercase flex items-center gap-2">
                                            <Briefcase className="size-4 text-primary" />
                                            {organizationName}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags & Quick Info */}
                                <div className="flex gap-3 flex-wrap mb-10 pb-10 border-b border-zinc-800/50">
                                    <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-zinc-800/50 px-5 border border-zinc-800">
                                        <MapPin className="size-4 text-primary" />
                                        <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest">{location}</p>
                                    </div>
                                    {educationLevel && (
                                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-zinc-800/50 px-5 border border-zinc-800">
                                            <GraduationCap className="size-4 text-primary" />
                                            <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest">{educationLevel.replace('_', ' ')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="relative">
                                    <h3 className="text-sm font-black text-zinc-100 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-primary rounded-full"></div>
                                        About this Opportunity
                                    </h3>
                                    <div className="text-zinc-400/90 text-sm md:text-base font-medium leading-relaxed space-y-6 prose prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-zinc-100 prose-a:text-primary max-w-none" dangerouslySetInnerHTML={{ __html: displayDescription }}></div>
                                </div>

                                {/* Specific Requirements if available */}
                                {displaySpecificReqs && (
                                    <div className="relative mt-12 pt-10 border-t border-zinc-800/50">
                                        <h3 className="text-sm font-black text-zinc-100 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                            <div className="w-8 h-1 bg-primary rounded-full"></div>
                                            Specific Requirements
                                        </h3>
                                        <div className="text-zinc-400/90 text-sm md:text-base font-medium leading-relaxed bg-zinc-950 rounded-2xl p-6 border border-zinc-800 whitespace-pre-wrap">
                                            {displaySpecificReqs}
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Sidebar Details */}
                        <aside className="flex flex-col w-full lg:w-[30%] gap-6">
                            <div className="bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-xl">
                                <h3 className="text-xs text-zinc-100 font-black uppercase tracking-[0.3em] mb-8 text-center bg-zinc-950 py-3 rounded-xl border border-zinc-800">
                                    Program Details
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                            <CalendarDays className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Deadline</p>
                                            <p className="text-sm font-black text-zinc-100 uppercase tracking-wider">
                                                {deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Rolling Admission'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                                            <p className="text-sm font-black text-zinc-100 uppercase tracking-wider">{location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                            <Building2 className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Organizer</p>
                                            <p className="text-sm font-black text-zinc-100 uppercase tracking-wider line-clamp-1 truncate" title={organizationName}>{organizationName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                            <Banknote className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Funding</p>
                                            <p className="text-sm font-black text-zinc-100 uppercase tracking-wider">
                                                {fundingType ? fundingType.replace('_', ' ') : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {salary && (
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                                <Banknote className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Salary / Stipend</p>
                                                <p className="text-sm font-black text-zinc-100 uppercase tracking-wider line-clamp-1">{salary}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {tags && tags.length > 0 && (
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-primary border border-zinc-800 shrink-0">
                                                <Tags className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tags</p>
                                                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider line-clamp-1">{tags.join(', ')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-10 pt-8 border-t border-zinc-800/50 flex flex-col gap-4">
                                    {isPublisherOwner ? (
                                        <Link to={`/publisher/edit/${id}`} className="btn-primary w-full h-14 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                            Edit Opportunity
                                        </Link>
                                    ) : isAdmin ? (
                                        <div className="text-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Admin View Active</p>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={handleApply}
                                                disabled={applyMutation.isPending && !opportunity.applyUrl}
                                                className="btn-primary w-full h-14 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1 transition-transform"
                                            >
                                                {applyMutation.isPending && !opportunity.applyUrl ? 'Processing...' : (
                                                    <>
                                                        <Send className="size-4" /> {opportunity.applyUrl ? 'Apply Externally' : 'Apply Now'}
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                onClick={handleSave}
                                                disabled={toggleSaveMutation.isPending}
                                                className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 ${
                                                    isSaved 
                                                    ? 'bg-primary/10 text-primary border border-primary/30'
                                                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/50'
                                                }`}
                                            >
                                                {isSaved ? (
                                                    <><BookmarkCheck className="size-5" /> Saved</>
                                                ) : (
                                                    <><Bookmark className="size-5" /> Save</>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                <div className="mt-8 text-center opacity-60">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                                        Posted {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OpportunityDetail;
