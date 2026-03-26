import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => userService.getNotifications(),
        refetchInterval: 60000, // Refetch every minute
    });

    const notifications = response?.data || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsReadMutation = useMutation({
        mutationFn: userService.markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: userService.markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeColor = (type) => {
        // Enforcing strict industrial dark palette
        switch (type) {
            case 'success': return 'text-zinc-300 bg-zinc-800 border-zinc-700';
            case 'warning': return 'text-zinc-400 bg-zinc-800 border-zinc-700';
            case 'error': return 'text-zinc-500 bg-zinc-800 border-zinc-700';
            default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-all relative border flex items-center justify-center group ${
                    isOpen ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-100'
                }`}
            >
                <span className={`material-symbols-outlined text-[22px] transition-colors ${isOpen ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-100'}`}>notifications</span>
                {unreadCount > 0 && (
                    <span className={`absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-zinc-100 border-2 animate-pulse ${isOpen ? 'border-zinc-800' : 'border-zinc-900'}`}></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
                            <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">Notification Registry</h3>
                            {unreadCount > 0 && (
                                <span className="text-[9px] font-black px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 uppercase tracking-[0.2em]">
                                    {unreadCount} Nodes Incoming
                                </span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                            {isLoading ? (
                                <div className="p-12 text-center animate-pulse">
                                    <div className="h-1 w-24 bg-zinc-800 rounded-full mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center gap-4 group">
                                    <div className="size-16 rounded-[2rem] bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-600 transition-transform group-hover:scale-110 duration-500">
                                        <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Quiet Channel</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-800/40">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification._id}
                                            className={`p-5 hover:bg-zinc-800/40 transition-all cursor-pointer relative group ${!notification.isRead ? 'bg-primary/5' : ''}`}
                                            onClick={() => !notification.isRead && markAsReadMutation.mutate(notification._id)}
                                        >
                                            <div className="flex gap-5">
                                                <div className={`size-12 rounded-2xl shrink-0 flex items-center justify-center border shadow-hfas-inner ${getTypeColor(notification.type)}`}>
                                                    <span className="material-symbols-outlined text-[22px]">{getTypeIcon(notification.type)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-xs font-black uppercase tracking-tight truncate pr-2 ${!notification.isRead ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest pt-0.5 whitespace-nowrap">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-zinc-700 rounded-r-lg shadow-[0_0_10px_rgba(255,255,255,0.05)]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
                            <button 
                                onClick={() => markAllAsReadMutation.mutate()}
                                disabled={notifications.length === 0 || markAllAsReadMutation.isPending}
                                className="text-[9px] font-black text-zinc-500 hover:text-primary uppercase tracking-[0.3em] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {markAllAsReadMutation.isPending ? 'Archiving...' : 'Archive All Streams'}
                            </button>
                            <button className="text-[9px] font-black text-zinc-600 hover:text-zinc-300 uppercase tracking-[0.3em] transition-colors">
                                Nexus History
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
