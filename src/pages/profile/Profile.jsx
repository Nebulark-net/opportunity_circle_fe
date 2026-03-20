import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { publisherService } from '../../services/publisher.service';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';

const Profile = () => {
    const { user, token, refreshToken, login: updateLocalStore } = useAuthStore();
    const isPublisher = user?.role === 'PUBLISHER';
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: isPublisher ? publisherService.getProfile : userService.getProfile,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data) => isPublisher ? publisherService.updateProfile(data) : userService.updateProfile(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['profile']);
            // Extract user from ApiResponse wrapper: response.data is the wrapper, response.data.data is the payload
            const payload = response?.data?.data || response?.data;
            const updatedUser = payload?.user || payload;
            
            if (updatedUser && updatedUser._id) {
                updateLocalStore(updatedUser, token, refreshToken);
            }
            toast.success('Profile photo updated successfully');
        },
        onError: () => toast.error('Failed to update profile photo'),
    });

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('profilePhoto', file);
        updateProfileMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8 w-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { user: profileUser, profile, preferences } = profileResponse?.data || { user, profile: {}, preferences: {} };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700 bg-zinc-950 min-h-full">
            {/* Profile Identity Deck */}
            <section className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden relative">
                {/* Banner - Industrial Gradient / Photo */}
                <div className="h-56 w-full bg-gradient-to-r from-zinc-800 to-zinc-900 bg-cover bg-center border-b border-zinc-800" style={{ backgroundImage: `url(${profileUser?.bgCoverPhotoUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1500&auto=format&fit=crop'})`, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px]"></div>
                </div>
                
                <div className="px-6 pb-8 sm:px-10 sm:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-24 relative z-10">
                        <div className="relative group size-44 rounded-[2rem] border-8 border-zinc-900 bg-zinc-800 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02]">
                            {profileUser?.profilePhotoUrl ? (
                                <img 
                                    alt={profileUser?.fullName} 
                                    className="h-full w-full object-cover" 
                                    src={profileUser.profilePhotoUrl} 
                                    crossOrigin="anonymous" 
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-zinc-600 bg-zinc-800">
                                    <span className="material-symbols-outlined text-[80px]">person</span>
                                </div>
                            )}

                            {/* Upload Overlay */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-primary text-4xl mb-2">photo_camera</span>
                                <span className="text-zinc-100 text-[10px] font-black uppercase tracking-[0.2em]">{updateProfileMutation.isPending ? 'Uploading...' : 'Upload Image'}</span>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*" disabled={updateProfileMutation.isPending} />
                        </div>
                        <div className="flex flex-col mb-4 space-y-1.5">
                            <h1 className="text-2xl font-black uppercase tracking-[0.05em] text-zinc-100 leading-none">
                                {isPublisher ? (profile?.organizationName || profileUser?.fullName) : profileUser?.fullName}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-primary text-xs font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 rounded-md border border-primary/20">
                                    @{profileUser?.username || 'user'}
                                </span>
                                <div className="size-1.5 bg-zinc-700 rounded-full"></div>
                                <span className="text-zinc-400 font-bold text-xs uppercase tracking-[0.2em]">
                                    {isPublisher ? (profile?.industry || 'Publisher Node') : (profileUser?.profileTag || profileUser?.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/dashboard/settings"
                        className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all h-fit flex items-center justify-center gap-2 group shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">edit_square</span>
                        Edit Blueprint
                    </Link>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Left: Deep Metrics */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Personal & Career Metrics */}
                    <section className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-8 flex flex-col gap-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 relative z-10">
                            <span className="material-symbols-outlined text-zinc-500">fingerprint</span>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-100">
                                {isPublisher ? 'Organization Profile' : 'Identity Matrix'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                            {[
                                { label: 'Direct Comm', value: profileUser?.email, icon: 'mail' },
                                { label: 'Secure Channel', value: profileUser?.phoneNumber || 'Not linked', icon: 'phone' },
                                { label: 'Sector Location', value: profileUser?.location || profileUser?.country || 'Distributed', icon: 'location_on' },
                                ...(isPublisher ? [
                                    { label: 'Industry Class', value: profile?.industry || 'Unspecified', icon: 'business' },
                                    { label: 'Network Portal', value: profile?.websiteUrl || 'Not set', icon: 'language', isLink: true },
                                ] : [
                                    { label: 'Institution', value: profileUser?.education || 'Not assigned', icon: 'school' },
                                    { label: 'Field Array', value: profileUser?.fieldOfStudy || 'General', icon: 'menu_book' },
                                    { label: 'Clearance Level', value: profileUser?.degreeLevel || 'Not specified', icon: 'workspace_premium' }
                                ])
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col gap-2 group">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</span>
                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-100">
                                        <div className="size-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors shadow-hfas-inner">
                                            <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                                        </div>
                                        {stat.isLink && stat.value !== 'Not set' ? (
                                            <a href={stat.value.startsWith('http') ? stat.value : `https://${stat.value}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-all underline decoration-primary/30 underline-offset-4">
                                                {stat.value}
                                            </a>
                                        ) : (
                                            <span className="truncate">{stat.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {isPublisher && profile?.description && (
                        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                                <span className="material-symbols-outlined text-zinc-500">subject</span>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-100">Enterprise Manifest</h2>
                            </div>
                            <p className="text-[11px] font-medium text-zinc-400 leading-relaxed my-2">
                                {profile.description}
                            </p>
                        </section>
                    )}
                </div>

                {/* Right: Preferences Panel */}
                <div className="flex flex-col gap-8">
                    {/* Status Badge */}
                    <section className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-8 flex flex-col items-center gap-6 text-center shadow-hfas-inner bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 to-zinc-900">
                        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-primary/20 shadow-[0_0_30px_rgba(0,167,149,0.15)] relative group cursor-default">
                             <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
                             <span className="material-symbols-outlined text-5xl relative z-10 drop-shadow-[0_0_8px_rgba(0,167,149,0.8)] group-hover:scale-110 transition-transform">verified</span>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-zinc-100 uppercase tracking-[0.3em] mb-2 drop-shadow-md">Clearance Verified</h3>
                            <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-md border border-primary/20 inline-block">Active {profileUser?.role === 'PUBLISHER' ? 'PublisherNode' : 'Seeker'} Protocol</p>
                        </div>
                        <div className="w-full h-px bg-zinc-800 mt-2"></div>
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Network Visibility</span>
                                <span className={`px-2.5 py-1 rounded-md text-[9px] border font-black uppercase tracking-widest ${profileUser?.isProfileVisible ? 'bg-primary/10 text-primary border-primary/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                    {profileUser?.isProfileVisible ? 'Public Routing' : 'Stealth Mode'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Quick Look */}
                    <section className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-8 flex flex-col gap-8">
                        <div>
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">radar</span>
                                Operational Vectors
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {preferences?.interestedTypes?.length > 0 ? (
                                    preferences.interestedTypes.map(type => (
                                        <span key={type} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 shadow-sm text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-colors cursor-default">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-zinc-500 text-[10px] font-medium italic">No dynamic vectors active</span>
                                )}
                            </div>
                        </div>
                        <div className="h-px w-full bg-zinc-800"></div>
                        <div>
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">public</span>
                                Target Sectors
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {preferences?.targetLocations?.length > 0 ? (
                                    preferences.targetLocations.map(loc => (
                                        <span key={loc} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,167,149,0.05)] text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors cursor-default">
                                            {loc}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-zinc-500 text-[10px] font-medium italic">Global reach enabled</span>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
