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
            // For publishers, backend returns { user, profile }; extract payload reliably
            const payload = response?.data?.data || response?.data;
            const updatedUser = payload?.user || payload;
            
            if (updatedUser && updatedUser._id) {
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

    const inputClasses = "h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-xs font-medium text-zinc-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-600";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-zinc-500";
    const sectionClasses = "bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6";
    const dividerClasses = "border-b border-zinc-800 pb-4";
    const sectionTitleClasses = "text-xs font-black uppercase tracking-[0.2em] text-zinc-100";

    return (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500 bg-zinc-950 min-h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-black uppercase tracking-[0.05em] text-zinc-100">Settings Protocol</h1>
            </div>

            {/* Profile Picture Section */}
            <section className={sectionClasses}>
                 <div className={dividerClasses}>
                    <h2 className={sectionTitleClasses}>Profile Identity</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group size-24 shrink-0">
                        <div className="size-full rounded-2xl border-2 border-zinc-700 group-hover:border-primary transition-colors overflow-hidden bg-zinc-800 shadow-hfas-inner p-1">
                            {currentProfile?.profilePhotoUrl ? (
                                <img src={currentProfile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover rounded-xl" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900 rounded-xl">
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
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 truncate">{currentProfile?.fullName}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">{currentProfile?.role}</p>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit(onProfileSubmit)} className="flex flex-col gap-6">
                {/* Account Details */}
                <section className={sectionClasses}>
                    <div className={dividerClasses}>
                        <h2 className={sectionTitleClasses}>Account Logistics</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>Full Identity</label>
                            <input {...register('fullName')} className={inputClasses} type="text" placeholder="John Doe" />
                            {errors.fullName && <span className="text-xs text-red-500 font-medium">{errors.fullName.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>Handle</label>
                            <input {...register('username')} className={inputClasses} type="text" placeholder="johndoe" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>Operational Tag</label>
                            <input {...register('profileTag')} className={inputClasses} type="text" placeholder="Protocol Operative" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>Comms Link</label>
                            <input {...register('phoneNumber')} className={inputClasses} type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                </section>

                {/* Professional & Academic / Business Info (Role Aware) */}
                <section className={sectionClasses}>
                    <div className={dividerClasses}>
                        <h2 className={sectionTitleClasses}>
                            {user?.role === 'PUBLISHER' ? 'Enterprise Specifications' : 'Career & Education'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user?.role === 'PUBLISHER' ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Organization Name</label>
                                    <input {...register('organizationName')} className={inputClasses} type="text" placeholder="Acme Corp" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Network Portal</label>
                                    <input {...register('websiteUrl')} className={inputClasses} type="text" placeholder="https://acme.com" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Industry Designation</label>
                                    <input {...register('industry')} className={inputClasses} type="text" placeholder="Technology" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Academic Institution</label>
                                    <input {...register('education')} className={inputClasses} type="text" placeholder="Harvard University" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Field of Study</label>
                                    <input {...register('fieldOfStudy')} className={inputClasses} type="text" placeholder="Computer Science" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={labelClasses}>Degree Clearance</label>
                                    <select {...register('degreeLevel')} className={`${inputClasses} appearance-none`}>
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
                            <label className={labelClasses}>Territory</label>
                            <input {...register('country')} className={inputClasses} type="text" placeholder="United States" />
                        </div>
                         <div className={`flex flex-col gap-2 ${user?.role === 'PUBLISHER' ? '' : 'md:col-span-2'}`}>
                            <label className={labelClasses}>Sector Location</label>
                            <input {...register('location')} className={inputClasses} type="text" placeholder="Mountain View, CA" />
                        </div>
                    </div>
                </section>

                {/* Biography / Description (Role Aware) */}
                <section className={sectionClasses}>
                    <div className={dividerClasses}>
                        <h2 className={sectionTitleClasses}>
                            {user?.role === 'PUBLISHER' ? 'Enterprise Manifest' : 'Biography'}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            {user?.role === 'PUBLISHER' ? 'Corporate Description' : 'Professional Dossier'}
                        </label>
                        <textarea 
                            {...register(user?.role === 'PUBLISHER' ? 'description' : 'bio')} 
                            rows={user?.role === 'PUBLISHER' ? 6 : 4} 
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-600 resize-none" 
                            placeholder={user?.role === 'PUBLISHER' ? "Describe your organization's mission and impact..." : "Tell us about your professional journey..."} 
                        />
                        <div className="flex justify-end">
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                                {watch(user?.role === 'PUBLISHER' ? 'description' : 'bio')?.length || 0}/{user?.role === 'PUBLISHER' ? 1000 : 500}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Notification Preferences — Seeker only */}
                {user?.role !== 'PUBLISHER' && (
                <section className={sectionClasses}>
                    <div className={dividerClasses}>
                        <h2 className={sectionTitleClasses}>Comms Preferences</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        {[
                            { key: 'emailNotifications', label: 'Email Transmissions', sub: 'Receive daily digests of new opportunities.' },
                            { key: 'pushNotifications', label: 'Push Directives', sub: 'Get real-time alerts for system updates.' },
                            { key: 'weeklyDigest', label: 'Weekly Summary', sub: 'Receive a weekly overview of operational nodes.' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-100">{item.label}</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{item.sub}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={preferences?.[item.key]}
                                        onChange={() => updatePreferencesMutation.mutate({ [item.key]: !preferences?.[item.key] })}
                                    />
                                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-zinc-700 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Privacy */}
                <section className={sectionClasses}>
                    <div className={dividerClasses}>
                        <h2 className={sectionTitleClasses}>Security Protocols</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-100">Public Visibility</span>
                                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{user?.role === 'PUBLISHER' ? 'Show your organization publicly on the platform.' : 'Allow publishers to locate your profile.'}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input {...register('isProfileVisible')} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-zinc-700 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-100">Broadcast Location</span>
                                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Display your current sector on public matrices.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input {...register('showLocation')} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-zinc-700 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Deployment Bar */}
                <div className="flex justify-end gap-4 pt-4 mb-8">
                     {isDirty && (
                        <button 
                            type="button"
                            onClick={() => reset()}
                            className="px-6 h-12 text-zinc-500 font-black hover:text-zinc-300 transition-colors uppercase text-[10px] tracking-[0.2em]"
                        >
                            Abort Changes
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="px-10 h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] min-w-[200px]"
                    >
                        {updateProfileMutation.isPending ? (
                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : 'Deploy Updates'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
