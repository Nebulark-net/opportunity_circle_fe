import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { 
            label: 'My Profile', 
            icon: 'person', 
            path: user?.role === 'PUBLISHER' ? '/publisher/profile' : '/dashboard/profile',
            desc: 'View your public profile'
        },
        { 
            label: 'Account Settings', 
            icon: 'settings', 
            path: user?.role === 'PUBLISHER' ? '/publisher/settings' : '/dashboard/settings',
            desc: 'Manage your security & info'
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-slate-100 dark:hover:bg-border-dark transition-all border border-transparent hover:border-primary/10 group"
            >
                {/* Text Identity - Hidden on mobile */}
                <div className="hidden md:flex flex-col items-end text-right">
                    <p className="text-[12px] font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
                        {user?.fullName || 'User Name'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        {user?.profileTag && (
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20 px-1.5 rounded bg-primary/5">
                                {user.profileTag}
                            </span>
                        )}
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold capitalize">
                            {user?.role === 'PUBLISHER' 
                                ? 'Industrial Publisher' 
                                : user?.degreeLevel 
                                    ? `${user.degreeLevel.toLowerCase()} Seeker` 
                                    : (user?.role === 'SEEKER' ? 'Undergraduate' : 'Platform Member')
                            }
                        </p>
                    </div>
                </div>

                {/* Profile Picture - Always Visible */}
                <div className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 group-hover:border-primary transition-colors overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {user?.profilePhotoUrl ? (
                        <img alt="Profile" className="w-full h-full object-cover" src={user.profilePhotoUrl} />
                    ) : (
                        <span className="material-symbols-outlined text-primary text-2xl">person</span>
                    )}
                </div>

                {/* Mobile chevron/indicator */}
                <div className="md:hidden">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_more</span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="p-5 border-b border-slate-100 dark:border-border-dark bg-slate-50/50 dark:bg-background-dark/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                                        {user?.fullName}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                                        {user?.role} Protocol
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors group"
                                >
                                    <div className="size-9 rounded-lg bg-slate-100 dark:bg-border-dark flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                            
                            <div className="h-px bg-slate-100 dark:bg-border-dark my-2 mx-2"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                            >
                                <div className="size-9 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-red-500">Sign Out</p>
                                    <p className="text-[10px] text-red-400/80 uppercase font-black tracking-widest">End Session</p>
                                </div>
                            </button>
                        </div>

                        <div className="p-3 border-t border-slate-100 dark:border-border-dark bg-slate-50/50 dark:bg-background-dark/50 flex justify-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Opportunity Circle v1.0</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;
