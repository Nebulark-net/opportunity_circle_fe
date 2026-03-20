import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

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
        ...(user?.role !== 'ADMIN' ? [{ 
            label: 'Registry Profile', 
            icon: 'account_circle', 
            path: user?.role === 'PUBLISHER' ? '/publisher/profile' : '/dashboard/profile',
            desc: 'Node identity overview'
        }] : []),
        { 
            label: 'Account Modulation', 
            icon: 'dynamic_settings', 
            path: user?.role === 'ADMIN' 
                ? '/admin/settings' 
                : (user?.role === 'PUBLISHER' ? '/publisher/settings' : '/dashboard/settings'),
            desc: 'System security & logic'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 12, scale: 0.96, filter: 'blur(4px)' },
        visible: { 
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            transition: { 
                duration: 0.4, 
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.08,
                delayChildren: 0.05
            } 
        },
        exit: { 
            opacity: 0, y: 8, scale: 0.98, filter: 'blur(4px)',
            transition: { duration: 0.2, ease: 'easeIn' } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 p-1.5 pl-4 rounded-xl transition-all border border-transparent group ${
                    isOpen ? 'bg-zinc-800/50 border-zinc-700/50' : 'hover:bg-zinc-900/80 hover:border-zinc-800/50'
                }`}
            >
                {/* Text Identity */}
                <div className="hidden md:flex flex-col items-end text-right">
                    <p className="text-[11px] font-black text-zinc-100 leading-tight uppercase tracking-[0.1em]">
                        {user?.fullName || 'Identity Node'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                            {user?.role === 'ADMIN' ? 'Root Admin' : user?.role || 'Guest'}
                        </span>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className={`size-10 rounded-xl bg-zinc-800 border-2 transition-all overflow-hidden flex items-center justify-center shrink-0 shadow-hfas-inner ${
                    isOpen ? 'border-primary' : 'border-zinc-700 group-hover:border-zinc-600'
                }`}>
                    {user?.profilePhotoUrl ? (
                        <img alt="Profile" className="size-full object-cover" src={user.profilePhotoUrl} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    ) : (
                        <span className="material-symbols-outlined text-zinc-500 text-[20px]">person_filled</span>
                    )}
                </div>

                {/* Mobile chevron */}
                <div className="md:hidden">
                    <span className={`material-symbols-outlined text-zinc-500 text-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
            </button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-4 w-72 hfas-glass rounded-2xl shadow-hfas-lg z-50 overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="p-6 border-b border-zinc-800/50 bg-zinc-950/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-hfas-inner">
                                    <span className="material-symbols-outlined text-[24px]">terminal</span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[13px] font-black text-zinc-100 uppercase tracking-tight truncate">
                                        {user?.fullName}
                                    </h4>
                                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] truncate">
                                        {user?.role} PROTOCOL
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-3">
                            <div className="flex flex-col gap-1">
                                {menuItems.map((item) => (
                                    <motion.div key={item.label} variants={itemVariants}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-zinc-800/50 transition-all group"
                                        >
                                            <div className="size-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-hfas-inner">
                                                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-xs font-black text-zinc-200 uppercase tracking-[0.05em]">{item.label}</p>
                                                <p className="text-[9px] text-zinc-500 font-medium">{item.desc}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="h-px bg-zinc-800/50 my-3 mx-2"></div>

                            <motion.div variants={itemVariants}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-red-500/5 transition-all group"
                                >
                                    <div className="size-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shadow-hfas-inner">
                                        <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.05em] group-hover:text-red-400">End Session</p>
                                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Terminate Node</p>
                                    </div>
                                </button>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/20 flex justify-center">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Core v2.4.0 • Industrial Platform</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;
