import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';

const AdminSettings = () => {
    const queryClient = useQueryClient();
    const { user: authUser } = useAuthStore();
    const [formData, setFormData] = useState({ fullName: '', email: '', profilePhotoUrl: '' });

    const { data: profileResponse, isLoading } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: adminService.getProfile,
    });

    useEffect(() => {
        if (profileResponse?.data) {
            setFormData({
                fullName: profileResponse.data.fullName || '',
                email: profileResponse.data.email || '',
                profilePhotoUrl: profileResponse.data.profilePhotoUrl || ''
            });
        }
    }, [profileResponse]);

    const updateProfileMutation = useMutation({
        mutationFn: adminService.updateProfile,
        onSuccess: () => { queryClient.invalidateQueries(['admin-profile']); toast.success('Identity synchronized'); },
        onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
    });

    const handleSubmit = (e) => { e.preventDefault(); updateProfileMutation.mutate(formData); };

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Security & Profile</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Orchestrate Administrator Identity Protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-800 shadow-hfas-inner flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{authUser?.role || 'ADMIN'} Authority</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Identity Card */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="hfas-card p-10 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="size-32 rounded-[2.5rem] bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0 shadow-hfas-lg relative z-10 group-hover:scale-105 transition-transform duration-500">
                            {formData.profilePhotoUrl ? (
                                <img src={formData.profilePhotoUrl} className="size-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" alt="Admin" />
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-zinc-600">account_circle</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <h3 className="text-2xl font-black text-zinc-100 tracking-tight uppercase">{formData.fullName || 'Unidentified'}</h3>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{formData.email}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 relative z-10">
                            <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full">Primary Admin</span>
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-zinc-700">Core Authority</span>
                        </div>
                    </div>

                    <div className="hfas-card p-8 flex flex-col gap-4 bg-zinc-800/50 border-zinc-700/50 text-zinc-400">
                        <div className="flex items-center gap-3 text-zinc-200 mb-2">
                            <span className="material-symbols-outlined text-[20px]">verified_user</span>
                            <h4 className="text-xs font-black uppercase tracking-widest">Protocol Integrity</h4>
                        </div>
                        <p className="text-[10px] font-medium leading-relaxed">
                            System-wide policies enforce encrypted data transmission. Ensure your administrator credentials remain confidential.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="hfas-card p-10 flex flex-col gap-10">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tight">Identity Modulation</h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Update your core administrative records</p>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Full Name</label>
                                    <input type="text" className="hfas-input" placeholder="Enter full identity label..." value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Email Endpoint</label>
                                    <input type="email" className="hfas-input opacity-70 cursor-not-allowed" value={formData.email} disabled title="Email change requires protocol escalation" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Avatar Endpoint (URL)</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <input type="text" className="hfas-input flex-1" placeholder="https://..." value={formData.profilePhotoUrl} onChange={(e) => setFormData({...formData, profilePhotoUrl: e.target.value})} />
                                    {formData.profilePhotoUrl && (
                                        <div className="size-12 rounded-xl border border-zinc-700 overflow-hidden shrink-0 shadow-hfas-inner">
                                            <img src={formData.profilePhotoUrl} className="size-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-zinc-800 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-zinc-700 text-4xl">security</span>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest max-w-[200px]">Committing identity changes triggers global synchronization.</p>
                            </div>
                            <button type="submit" disabled={updateProfileMutation.isPending} className="hfas-btn-primary px-12 min-w-[200px]">
                                {updateProfileMutation.isPending ? 'Syncing...' : 'Sync Identity'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
