import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { publisherService } from '../../services/publisher.service';
import { useAuthStore } from '../../stores/authStore';

const Profile = () => {
    const { user } = useAuthStore();
    const isPublisher = user?.role === 'PUBLISHER';

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: isPublisher ? publisherService.getProfile : userService.getProfile,
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8 w-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { user: profileUser, profile, preferences } = profileResponse?.data || { user, profile: {}, preferences: {} };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Profile Identity Deck */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
                {/* Banner - Industrial Gradient / Photo */}
                <div className="h-48 w-full bg-gradient-to-r from-primary to-accent-muted bg-cover bg-center" style={{ backgroundImage: `url(${profileUser?.bgCoverPhotoUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1500&auto=format&fit=crop'})` }}>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div className="px-6 pb-8 sm:px-10 sm:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-20 relative z-10">
                        <div className="size-40 rounded-3xl border-[6px] border-white dark:border-surface-dark bg-slate-100 dark:bg-background-dark overflow-hidden shadow-xl">
                            {profileUser?.profilePhotoUrl ? (
                                <img 
                                    alt={profileUser?.fullName} 
                                    className="h-full w-full object-cover" 
                                    src={profileUser.profilePhotoUrl} 
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-7xl">person</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 space-y-1">
                            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                                {isPublisher ? (profile?.organizationName || profileUser?.fullName) : profileUser?.fullName}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-primary text-sm font-black uppercase tracking-widest">
                                    @{profileUser?.username || 'user'}
                                </span>
                                <div className="size-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">
                                    {isPublisher ? (profile?.industry || 'Publisher') : (profileUser?.profileTag || profileUser?.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/dashboard/settings"
                        className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all h-fit flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                        Edit Profile
                    </Link>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Deep Metrics */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Personal & Career Metrics */}
                    <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-10">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                                {isPublisher ? 'Organization Profile' : 'Profile Information'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { label: 'Direct Email', value: profileUser?.email, icon: 'mail' },
                                { label: 'Contact Number', value: profileUser?.phoneNumber || 'Not provided', icon: 'phone' },
                                { label: 'Primary Location', value: profileUser?.location || profileUser?.country || 'Distributed', icon: 'location_on' },
                                ...(isPublisher ? [
                                    { label: 'Industry Sector', value: profile?.industry || 'Educational Services', icon: 'business' },
                                    { label: 'Corporate Website', value: profile?.websiteUrl || 'Not set', icon: 'language', isLink: true },
                                ] : [
                                    { label: 'Institution', value: profileUser?.education || 'Not specified', icon: 'school' },
                                    { label: 'Field of Study', value: profileUser?.fieldOfStudy || 'General', icon: 'menu_book' },
                                    { label: 'Degree Level', value: profileUser?.degreeLevel || 'Not specified', icon: 'workspace_premium' }
                                ])
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                                        <span className="material-symbols-outlined text-primary text-[18px]">{stat.icon}</span>
                                        {stat.isLink && stat.value !== 'Not set' ? (
                                            <a href={stat.value.startsWith('http') ? stat.value : `https://${stat.value}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">
                                                {stat.value}
                                            </a>
                                        ) : stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {isPublisher && profile?.description && (
                        <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase border-b border-slate-100 dark:border-slate-800 pb-4">Company Overview</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                {profile.description}
                            </p>
                        </section>
                    )}
                </div>

                {/* Right: Preferences Panel */}
                <div className="flex flex-col gap-8">
                    {/* Status Badge */}
                    <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center gap-6 text-center">
                        <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-4xl">verified</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Account Verified</h3>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Active {profileUser?.role === 'PUBLISHER' ? 'Publisher' : 'Seeker'} Protocol</p>
                        </div>
                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${profileUser?.isProfileVisible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {profileUser?.isProfileVisible ? 'Public' : 'Hidden'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Quick Look */}
                    <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {preferences?.interestedTypes?.length > 0 ? (
                                    preferences.interestedTypes.map(type => (
                                        <span key={type} className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-background-dark text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-[10px] italic">No preferences set</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Target Regions</h3>
                            <div className="flex flex-wrap gap-2">
                                {preferences?.targetLocations?.length > 0 ? (
                                    preferences.targetLocations.map(loc => (
                                        <span key={loc} className="px-3 py-1 rounded-lg bg-primary/5 text-primary border border-primary/20 text-[10px] font-bold uppercase">
                                            {loc}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-[10px] italic">Global reach</span>
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
