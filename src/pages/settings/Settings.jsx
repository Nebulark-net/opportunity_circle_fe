import React, { useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { publisherService } from '../../services/publisher.service';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    username: z.string().optional(),
    profileTag: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    location: z.string().optional(),
    education: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    degreeLevel: z.enum(['UNDERGRADUATE', 'GRADUATE', 'PHD', 'OTHER']).nullable().optional(),
    bio: z.string().max(500, 'Bio is too long').optional(),
    isProfileVisible: z.boolean().default(true),
    showLocation: z.boolean().default(true),
    // Publisher specific
    organizationName: z.string().optional(),
    websiteUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
    industry: z.string().optional(),
    description: z.string().max(1000, 'Description is too long').optional(),
});

const Settings = () => {
    const { user, updateProfile: updateLocalStore } = useAuthStore();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: user?.role === 'PUBLISHER' ? publisherService.getProfile : userService.getProfile,
    });

    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            username: user?.username || '',
            profileTag: user?.profileTag || '',
            phoneNumber: user?.phoneNumber || '',
            country: user?.country || '',
            location: user?.location || '',
            education: user?.education || '',
            fieldOfStudy: user?.fieldOfStudy || '',
            degreeLevel: user?.degreeLevel || null,
            bio: user?.bio || '',
            isProfileVisible: user?.isProfileVisible ?? true,
            showLocation: user?.showLocation ?? true,
            organizationName: user?.profile?.organizationName || '',
            websiteUrl: user?.profile?.websiteUrl || '',
            industry: user?.profile?.industry || '',
            description: user?.profile?.description || '',
        }
    });

    useEffect(() => {
        if (profileResponse?.data?.user) {
            const u = profileResponse.data.user;
            reset({
                fullName: u.fullName || '',
                username: u.username || '',
                profileTag: u.profileTag || '',
                phoneNumber: u.phoneNumber || '',
                country: u.country || '',
                location: u.location || '',
                education: u.education || '',
                fieldOfStudy: u.fieldOfStudy || '',
                degreeLevel: u.degreeLevel || null,
                bio: u.bio || '',
                isProfileVisible: u.isProfileVisible ?? true,
                showLocation: u.showLocation ?? true,
                organizationName: profileResponse?.data?.profile?.organizationName || '',
                websiteUrl: profileResponse?.data?.profile?.websiteUrl || '',
                industry: profileResponse?.data?.profile?.industry || '',
                description: profileResponse?.data?.profile?.description || '',
            });
        }
    }, [profileResponse, reset]);

    const updateProfileMutation = useMutation({
        mutationFn: (data) => user?.role === 'PUBLISHER' ? publisherService.updateProfile(data) : userService.updateProfile(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['profile']);
            // For publishers, backend returns { user, profile }; for seekers it returns user directly
            const updatedUser = response?.data?.user || response?.data || null;
            if (updatedUser) {
                updateLocalStore(updatedUser);
            }
            toast.success('Changes saved successfully');
        },
        onError: () => toast.error('Failed to save changes'),
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: userService.updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
            toast.success('Preferences updated');
        },
    });

    const onProfileSubmit = (data) => {
        if (user?.role === 'PUBLISHER') {
            // Specialized publisher update logic
            const publisherData = {
                organizationName: data.organizationName,
                websiteUrl: data.websiteUrl,
                industry: data.industry,
                description: data.description,
                // Also update generic user fields that are allowed
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                country: data.country,
                location: data.location,
            };
            
            // The publisher controller handles its own profile update
            // We might need to split this if the backend expects different structures
            updateProfileMutation.mutate(publisherData);
        } else {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });
            updateProfileMutation.mutate(formData);
        }
    };

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

    const { preferences } = profileResponse?.data || { preferences: {} };
    const currentProfile = profileResponse?.data?.user || user;

    return (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
            </div>

            {/* Profile Picture Section (Matching Designing aesthetic) */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                 <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Identity</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group size-24 shrink-0">
                        <div className="size-full rounded-2xl border-2 border-primary overflow-hidden bg-slate-100 dark:bg-background-dark">
                            {currentProfile?.profilePhotoUrl ? (
                                <img src={currentProfile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-4xl">person</span>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 size-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{currentProfile?.fullName}</h3>
                        <p className="text-xs text-slate-500 dark:text-accent-muted uppercase font-black tracking-widest">{currentProfile?.role}</p>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit(onProfileSubmit)} className="flex flex-col gap-6">
                {/* Account Details */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Account Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                            <input {...register('fullName')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="John Doe" />
                            {errors.fullName && <span className="text-xs text-red-500 font-medium">{errors.fullName.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                            <input {...register('username')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="johndoe" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Tag</label>
                            <input {...register('profileTag')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Scholarship Seeker" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                            <input {...register('phoneNumber')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                </section>

                {/* Professional & Academic / Business Info (Role Aware) */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {user?.role === 'PUBLISHER' ? 'Business Profile' : 'Career & Education'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user?.role === 'PUBLISHER' ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Organization Name</label>
                                    <input {...register('organizationName')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Acme Corp" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Website</label>
                                    <input {...register('websiteUrl')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="https://acme.com" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Industry</label>
                                    <input {...register('industry')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Technology" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Academic Institution</label>
                                    <input {...register('education')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Harvard University" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Field of Study</label>
                                    <input {...register('fieldOfStudy')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Computer Science" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Degree Level</label>
                                    <select {...register('degreeLevel')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                        <option value="">Select Level</option>
                                        <option value="UNDERGRADUATE">Undergraduate</option>
                                        <option value="GRADUATE">Graduate</option>
                                        <option value="PHD">PhD</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Country</label>
                            <input {...register('country')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="United States" />
                        </div>
                         <div className={`flex flex-col gap-2 ${user?.role === 'PUBLISHER' ? '' : 'md:col-span-2'}`}>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location / City</label>
                            <input {...register('location')} className="h-12 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark px-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400" type="text" placeholder="Mountain View, CA" />
                        </div>
                    </div>
                </section>

                {/* Biography / Description (Role Aware) */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {user?.role === 'PUBLISHER' ? 'Company Overview' : 'Biography'}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {user?.role === 'PUBLISHER' ? 'Corporate Description' : 'Professional Bio'}
                        </label>
                        <textarea 
                            {...register(user?.role === 'PUBLISHER' ? 'description' : 'bio')} 
                            rows={user?.role === 'PUBLISHER' ? 6 : 4} 
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark p-4 text-slate-800 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none" 
                            placeholder={user?.role === 'PUBLISHER' ? "Describe your organization's mission and impact..." : "Tell us about your professional journey..."} 
                        />
                        <div className="flex justify-end">
                            <span className="text-xs text-slate-500 font-bold uppercase">
                                {watch(user?.role === 'PUBLISHER' ? 'description' : 'bio')?.length || 0}/{user?.role === 'PUBLISHER' ? 1000 : 500}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Notification Preferences — Seeker only (publishers have no UserPreference records) */}
                {user?.role !== 'PUBLISHER' && (
                <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Notification Preferences</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', sub: 'Receive daily digests of new opportunities.' },
                            { key: 'pushNotifications', label: 'Push Notifications', sub: 'Get real-time alerts for application updates.' },
                            { key: 'weeklyDigest', label: 'Weekly Summary', sub: 'Receive a weekly overview of saved items.' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                                    <span className="text-xs text-slate-500 dark:text-accent-muted">{item.sub}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={preferences?.[item.key]}
                                        onChange={() => updatePreferencesMutation.mutate({ [item.key]: !preferences?.[item.key] })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Privacy (Design Layout) */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Privacy</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Profile Visibility</span>
                                <span className="text-xs text-slate-500 dark:text-accent-muted">{user?.role === 'PUBLISHER' ? 'Show your organization publicly on the platform.' : 'Allow publishers to find you.'}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input {...register('isProfileVisible')} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Show Location</span>
                                <span className="text-xs text-slate-500 dark:text-accent-muted">Display your current city on your public profile.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input {...register('showLocation')} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Sticky Save Bar (Industrial pattern, but matching design components) */}
                <div className="flex justify-end gap-4 pt-2 mb-8">
                     {isDirty && (
                        <button 
                            type="button"
                            onClick={() => reset()}
                            className="px-6 h-12 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase text-xs tracking-widest"
                        >
                            Discard
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="px-10 h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] min-w-[200px]"
                    >
                        {updateProfileMutation.isPending ? (
                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : 'Save New Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
