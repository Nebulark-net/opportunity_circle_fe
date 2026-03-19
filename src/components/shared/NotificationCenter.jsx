import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await api.get('/notifications');
            return response.data.data || [];
        },
        enabled: isOpen,
    });

    const markReadMutation = useMutation({
        mutationFn: (id) => api.patch(`/notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl border transition-all duration-300 ${
                    isOpen 
                    ? 'bg-primary border-primary text-off-white shadow-[0_0_15px_rgba(0,167,149,0.4)]' 
                    : 'bg-surface-dark border-border-dark text-light-gray hover:border-primary/50 hover:text-off-white shadow-lg'
                }`}
            >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-error text-off-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-dark shadow-lg animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 mt-4 w-80 sm:w-96 bg-surface-dark border border-border-dark rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-border-dark bg-background-dark/50 flex justify-between items-center">
                                <h3 className="text-sm font-black text-off-white uppercase tracking-widest">Notifications</h3>
                                <button className="text-[10px] font-black text-primary uppercase tracking-tighter hover:underline">Mark all read</button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <div className="p-10 text-center">
                                        <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                                        <p className="text-[10px] font-black text-light-gray uppercase tracking-widest">Synchronizing...</p>
                                    </div>
                                ) : notifications?.length > 0 ? (
                                    <div className="divide-y divide-border-dark/30">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n._id} 
                                                className={`p-5 hover:bg-background-dark/30 transition-colors cursor-pointer group relative ${!n.isRead ? 'bg-primary/5' : ''}`}
                                                onClick={() => !n.isRead && markReadMutation.mutate(n._id)}
                                            >
                                                {!n.isRead && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                                )}
                                                <div className="flex gap-4">
                                                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 border ${
                                                        n.type === 'success' ? 'bg-success/10 border-success/20 text-success' :
                                                        n.type === 'error' ? 'bg-error/10 border-error/20 text-error' :
                                                        'bg-primary/10 border-primary/20 text-primary'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'info'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-black uppercase tracking-tight mb-0.5 ${!n.isRead ? 'text-off-white' : 'text-light-gray'}`}>
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[11px] text-light-gray font-medium leading-relaxed line-clamp-2 mb-2">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[9px] font-black text-light-gray/40 uppercase tracking-widest">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-16 text-center opacity-40 flex flex-col items-center gap-3">
                                        <span className="material-symbols-outlined text-4xl">notifications_off</span>
                                        <p className="text-[10px] font-black text-light-gray uppercase tracking-widest text-center">No new notifications</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-border-dark bg-background-dark/30 text-center">
                                <button className="text-[10px] font-black text-light-gray hover:text-off-white transition-colors uppercase tracking-[0.2em]">View History</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
