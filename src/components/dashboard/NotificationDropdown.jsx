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
        switch (type) {
            case 'success': return 'text-green-500 bg-green-500/10';
            case 'warning': return 'text-yellow-500 bg-yellow-500/10';
            case 'error': return 'text-red-500 bg-red-500/10';
            default: return 'text-blue-500 bg-blue-500/10';
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
                className="p-2 rounded-lg bg-slate-100 dark:bg-border-dark text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-all relative"
            >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-background-dark animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-background-dark/50">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-10 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-10 text-center flex flex-col items-center gap-3">
                                    <div className="size-16 rounded-full bg-slate-50 dark:bg-background-dark flex items-center justify-center text-slate-300 dark:text-slate-600">
                                        <span className="material-symbols-outlined text-4xl">notifications_off</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-border-dark/50">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification._id}
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer relative group ${!notification.isRead ? 'bg-primary/[0.02] dark:bg-primary/[0.02]' : ''}`}
                                            onClick={() => !notification.isRead && markAsReadMutation.mutate(notification._id)}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${getTypeColor(notification.type)}`}>
                                                    <span className="material-symbols-outlined text-[20px]">{getTypeIcon(notification.type)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className={`text-sm font-bold truncate ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-slate-100 dark:border-border-dark bg-slate-50/50 dark:bg-background-dark/50 text-center">
                            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
