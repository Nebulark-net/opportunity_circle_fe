import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';

const AdminMentors = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newMentor, setNewMentor] = useState({ name: '', email: '', designation: '', organization: '', description: '', photoUrl: '' });

    const { data: mentorsResponse, isLoading } = useQuery({
        queryKey: ['admin-mentors'],
        queryFn: adminService.getMentors
    });

    const verifyMentorMutation = useMutation({
        mutationFn: adminService.verifyMentor,
        onMutate: async (mentorId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-mentors'] });
            const previousMentors = queryClient.getQueryData(['admin-mentors']);
            
            queryClient.setQueryData(['admin-mentors'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map(m => m._id === mentorId ? { ...m, isVerified: !m.isVerified } : m)
                };
            });
            return { previousMentors };
        },
        onError: (err, mentorId, context) => {
            queryClient.setQueryData(['admin-mentors'], context.previousMentors);
            toast.error('Identity status synchronization failed.');
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Mentor verification updated');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-mentors'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: adminService.toggleMentorStatus,
        onMutate: async (mentorId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-mentors'] });
            const previousMentors = queryClient.getQueryData(['admin-mentors']);
            
            queryClient.setQueryData(['admin-mentors'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map(m => m._id === mentorId ? { ...m, isActive: !m.isActive } : m)
                };
            });
            return { previousMentors };
        },
        onError: (err, mentorId, context) => {
            queryClient.setQueryData(['admin-mentors'], context.previousMentors);
            toast.error('Lifecycle sync failed. Rolling back node.');
        },
        onSuccess: (response) => {
            toast.success(response.message || 'Mentor status updated');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-mentors'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
    });

    const createMentorMutation = useMutation({
        mutationFn: adminService.createMentor,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-mentors']);
            queryClient.invalidateQueries(['admin-stats']);
            toast.success('New mentor node initialized');
            setIsAdding(false);
            setNewMentor({ name: '', email: '', designation: '', organization: '', description: '', photoUrl: '' });
        },
        onError: () => toast.error('Failed to initialize mentor node')
    });

    const handleSubmit = (e) => { e.preventDefault(); createMentorMutation.mutate(newMentor); };
    const mentors = mentorsResponse?.data || [];

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Mentor Registry</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Orchestrate specialized knowledge nodes</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsAdding(true)} className="hfas-btn-primary px-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Onboard Node
                    </button>
                    <div className="bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-800 shadow-hfas-inner flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{mentors.length} Nodes</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="hfas-card h-80 animate-pulse bg-zinc-800/50"></div>)}
                </div>
            ) : mentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div key={mentor._id} className="hfas-card group flex flex-col hover:border-zinc-700 transition-all relative overflow-hidden">
                            <div className="p-8 flex flex-col gap-6 flex-1">
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="size-16 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0 shadow-hfas-inner group-hover:scale-105 transition-transform">
                                        {mentor.photoUrl || mentor.profilePhotoUrl ? (
                                            <img src={mentor.photoUrl || mentor.profilePhotoUrl} className="size-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" alt={mentor.name || mentor.fullName} />
                                        ) : (
                                            <span className="material-symbols-outlined text-4xl text-zinc-600">account_circle</span>
                                        )}
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border flex items-center gap-1.5 ${
                                        mentor.isVerified 
                                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                                            : 'border-zinc-700/50 text-zinc-500 bg-zinc-800/30'
                                    }`}>
                                        <span className="material-symbols-outlined text-[11px] leading-none">
                                            {mentor.isVerified ? 'verified' : 'cancel_presentation'}
                                        </span>
                                        {mentor.isVerified ? 'AUTHORIZED' : 'UNAUTHORIZED'}
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tight truncate">{mentor.name || mentor.fullName}</h3>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate">{mentor.email}</p>
                                </div>
                                <div className="relative z-10 grid grid-cols-2 gap-4 mt-2">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Field</p>
                                        <p className="text-xs font-bold text-zinc-300 truncate">{mentor.designation || mentor.mentorProfile?.field || 'Unspecified'}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={`size-1.5 rounded-full ${mentor.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></span>
                                            <p className={`text-[10px] font-black uppercase tracking-tight ${mentor.isActive ? 'text-zinc-300' : 'text-red-400'}`}>
                                                {mentor.isActive ? 'Active' : 'Locked'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2 mt-2 italic relative z-10">
                                    {mentor.description || "No intelligence profile provided."}
                                </p>
                            </div>
                            <div className="px-8 py-5 bg-zinc-800/20 border-t border-zinc-800 flex items-center justify-between gap-4 relative z-10">
                                <button 
                                    onClick={() => verifyMentorMutation.mutate(mentor._id)} 
                                    className={`flex-1 hfas-btn-ghost text-[10px] flex items-center justify-center gap-2 ${mentor.isVerified ? 'text-zinc-500 hover:text-accent-red hover:bg-red-500/10' : 'text-primary hover:bg-primary/10'}`}
                                    title={mentor.isVerified ? 'Revoke Status' : 'Grant Verified'}
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {mentor.isVerified ? 'person_remove' : 'verified_user'}
                                    </span>
                                    {mentor.isVerified ? 'UNAUTHORIZE' : 'AUTHORIZE'}
                                </button>
                                <button 
                                    onClick={() => toggleStatusMutation.mutate(mentor._id)} 
                                    className={`p-2.5 rounded-xl bg-zinc-800 border border-transparent transition-all ${
                                        mentor.isActive ? 'text-zinc-500 hover:text-accent-red hover:bg-red-500/10 hover:border-red-500/20' : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                                    }`} 
                                    title={mentor.isActive ? 'Suspend' : 'Initialize'}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{mentor.isActive ? 'person_off' : 'power_settings_new'}</span>
                                </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <span className="material-symbols-outlined text-[150px]">verified_user</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="hfas-card p-24 text-center flex flex-col items-center gap-6">
                    <span className="material-symbols-outlined text-zinc-700 text-6xl">school</span>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">No mentorship nodes detected.</p>
                </div>
            )}

            {/* Onboarding Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAdding(false)}></div>
                    <div className="hfas-card w-full max-w-2xl relative z-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col shadow-hfas-lg bg-zinc-900 border-zinc-800">
                        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                            <h2 className="text-xl font-black text-zinc-100 uppercase tracking-tight">Mentor Onboarding</h2>
                            <button onClick={() => setIsAdding(false)} className="size-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                                    <input type="text" className="hfas-input" placeholder="Identity Label" value={newMentor.name} onChange={(e) => setNewMentor({...newMentor, name: e.target.value})} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Email</label>
                                    <input type="email" className="hfas-input" placeholder="address@protocol.com" value={newMentor.email} onChange={(e) => setNewMentor({...newMentor, email: e.target.value})} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Designation</label>
                                    <input type="text" className="hfas-input" placeholder="Node Specialization" value={newMentor.designation} onChange={(e) => setNewMentor({...newMentor, designation: e.target.value})} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Organization</label>
                                    <input type="text" className="hfas-input" placeholder="Affiliated Matrix" value={newMentor.organization} onChange={(e) => setNewMentor({...newMentor, organization: e.target.value})} required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Bio</label>
                                <textarea className="hfas-input min-h-[100px] resize-none" placeholder="Expertise matrix..." value={newMentor.description} onChange={(e) => setNewMentor({...newMentor, description: e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Avatar URL</label>
                                <input type="text" className="hfas-input" placeholder="https://..." value={newMentor.photoUrl} onChange={(e) => setNewMentor({...newMentor, photoUrl: e.target.value})} />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="hfas-btn-ghost px-6">Abort</button>
                                <button type="submit" className="hfas-btn-primary px-10">Initialize Node</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMentors;
