import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => { setPage(1); }, [roleFilter, debouncedSearch]);

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ['admin-users', roleFilter, page, debouncedSearch],
        queryFn: () => adminService.getUsers(roleFilter, page, 15, debouncedSearch),
    });

    const toggleStatusMutation = useMutation({
        mutationFn: adminService.toggleUserStatus,
        onMutate: async (userId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-users'] });
            const previousUsers = queryClient.getQueryData(['admin-users', roleFilter, page, debouncedSearch]);
            
            queryClient.setQueryData(['admin-users', roleFilter, page, debouncedSearch], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        users: old.data.users.map(u => 
                            u._id === userId 
                                ? { ...u, isActive: !u.isActive, deletedAt: u.deletedAt ? null : new Date().toISOString() } 
                                : u
                        )
                    }
                };
            });
            return { previousUsers };
        },
        onError: (err, userId, context) => {
            queryClient.setQueryData(['admin-users', roleFilter, page, debouncedSearch], context.previousUsers);
            toast.error('Identity sync failed. Rolling back protocol.');
        },
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });

    const verifyPublisherMutation = useMutation({
        mutationFn: ({ userId, status }) => adminService.verifyPublisher(userId, status),
        onMutate: async ({ userId, status }) => {
            await queryClient.cancelQueries({ queryKey: ['admin-users'] });
            const previousUsers = queryClient.getQueryData(['admin-users', roleFilter, page, debouncedSearch]);

            queryClient.setQueryData(['admin-users', roleFilter, page, debouncedSearch], (old) => {
                if (!old) return old;
                const isVerified = status === 'TRUSTED';
                return {
                    ...old,
                    data: {
                        ...old.data,
                        users: old.data.users.map(u => 
                            u._id === userId 
                                ? { ...u, isVerified, publisherProfile: { ...u.publisherProfile, verified: isVerified } } 
                                : u
                        )
                    }
                };
            });
            return { previousUsers };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['admin-users', roleFilter, page, debouncedSearch], context.previousUsers);
            toast.error('Identity status synchronization failed.');
        },
        onSuccess: (response) => {
            toast.success(response.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });

    const { users = [], total = 0, totalPages = 1 } = usersResponse?.data || {};

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Registry Terminal</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Platform Identity Orchestration</p>
                </div>
                <div className="relative w-full sm:w-80 group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px] group-focus-within:text-primary transition-colors">search</span>
                    <input 
                        type="text" 
                        placeholder="SEARCH IDENTITY OR PROTOCOL..."
                        className="hfas-input pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-[0.1em]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 p-2 hfas-card bg-zinc-900/50 border-zinc-800/30 max-w-max">
                {['ALL', 'SEEKER', 'PUBLISHER', 'ADMIN'].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            roleFilter === r 
                            ? 'bg-primary text-white shadow-hfas-sm' 
                            : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800'
                        }`}
                    >
                        {r === 'ALL' ? 'Universal' : r}
                    </button>
                ))}
            </div>

            {/* Data Grid */}
            <div className="hfas-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-800/30 border-b border-zinc-800/50">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Identity Node</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hidden sm:table-cell">Protocol</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hidden lg:table-cell">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
                                        <span className="material-symbols-outlined text-4xl">radar</span>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Scanning Identity Streams...</p>
                                    </div>
                                </td></tr>
                            ) : users.length > 0 ? users.map((user) => (
                                <tr key={user._id} className="group hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="size-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0 shadow-hfas-inner text-zinc-500">
                                                {user.profilePhotoUrl ? (
                                                    <img src={user.profilePhotoUrl} alt="" className="size-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-[22px]">person</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0 gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-zinc-100 leading-tight truncate">{user.fullName}</span>
                                                    {user.role === 'PUBLISHER' && (
                                                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase border flex items-center gap-1.5 ${
                                                            user.isVerified 
                                                                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                                                                : 'border-zinc-700/50 text-zinc-500 bg-zinc-800/30'
                                                        }`}>
                                                            <span className="material-symbols-outlined text-[11px] leading-none">
                                                                {user.isVerified ? 'verified' : 'cancel_presentation'}
                                                            </span>
                                                            {user.isVerified ? 'AUTHORIZED' : 'UNAUTHORIZED'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-medium text-zinc-500 truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 hidden sm:table-cell">
                                        <span className={`px-2.5 py-1 rounded-md text-[8px] font-black tracking-widest uppercase border ${
                                            user.role === 'ADMIN' ? 'border-primary/30 text-primary bg-primary/10' : 
                                            user.role === 'PUBLISHER' ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10' : 
                                            'border-zinc-700 text-zinc-400 bg-zinc-800/50'
                                        }`}>{user.role}</span>
                                    </td>
                                    <td className="px-8 py-6 hidden lg:table-cell">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`size-1.5 rounded-full ${!user.deletedAt ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${!user.deletedAt ? 'text-zinc-500' : 'text-red-400'}`}>
                                                {!user.deletedAt ? 'ACTIVE' : 'SUSPENDED'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {user.role === 'PUBLISHER' && (
                                                <button 
                                                    onClick={() => verifyPublisherMutation.mutate({ userId: user._id, status: user.isVerified ? 'PENDING' : 'TRUSTED' })} 
                                                    className={`hfas-btn-ghost flex items-center gap-1.5 ${user.isVerified ? 'text-zinc-500 hover:text-accent-red hover:bg-red-500/10' : 'text-primary hover:bg-primary/10'}`}
                                                    title={user.isVerified ? 'Revoke Authorization' : 'Authorize Account'}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {user.isVerified ? 'person_remove' : 'verified_user'}
                                                    </span>
                                                    {user.isVerified ? 'UNAUTHORIZE' : 'AUTHORIZE'}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => toggleStatusMutation.mutate(user._id)}
                                                className={`p-2 rounded-lg transition-all ${
                                                    !user.deletedAt 
                                                    ? 'text-zinc-500 hover:text-accent-red hover:bg-red-500/10' 
                                                    : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                                                }`}
                                                title={!user.deletedAt ? 'Suspend Identity' : 'Restore Identity'}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {!user.deletedAt ? 'person_off' : 'power_settings_new'}
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-8 py-24 text-center text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Registry Void (0 Nodes Detected)
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-8 py-5 bg-zinc-800/20 border-t border-zinc-800 flex items-center justify-between">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">NODE {page} OF {totalPages}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="size-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary disabled:opacity-30 transition-all shadow-hfas-sm">
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="size-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary disabled:opacity-30 transition-all shadow-hfas-sm">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:hidden p-5 hfas-card bg-primary/5 border-primary/10 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-relaxed">Swipe grid horizontally to inspect deeper operational telemetry</p>
            </div>
        </div>
    );
};

export default AdminUsers;
