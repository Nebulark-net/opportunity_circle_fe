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
        }] : []),
        { 
            label: 'Modulation', 
            icon: 'tune', 
            path: user?.role === 'ADMIN' 
                ? '/admin/settings' 
                : (user?.role === 'PUBLISHER' ? '/publisher/settings' : '/dashboard/settings'),
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 p-1 rounded-xl transition-all border border-transparent group ${
                    isOpen ? 'bg-zinc-800/50' : 'hover:bg-zinc-900/50'
                }`}
            >
                {/* Profile Picture */}
                <div className={`size-8 rounded-lg bg-zinc-800 border transition-all overflow-hidden flex items-center justify-center shrink-0 ${
                    isOpen ? 'border-primary' : 'border-zinc-700/50 group-hover:border-zinc-600'
                }`}>
                    {user?.profilePhotoUrl ? (
                        <img alt="Profile" className="size-full object-cover" src={user.profilePhotoUrl} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    ) : (
                        <span className="material-symbols-outlined text-zinc-500 text-[18px]">person</span>
                    )}
                </div>

                <div className={`hidden md:flex items-center gap-1.5`}>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-100 transition-colors">
                        {user?.fullName?.split(' ')[0] || 'Node'}
                    </p>
                    <span className={`material-symbols-outlined text-zinc-600 text-[16px] transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header Info (Compact) */}
                        <div className="px-4 py-3 bg-zinc-950/40 border-b border-zinc-800/50">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Connected as</p>
                            <p className="text-[11px] font-bold text-zinc-200 truncate">{user?.email}</p>
                        </div>

                        <div className="p-1.5 flex flex-col gap-0.5">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </Link>
                            ))}
                            
                            <div className="h-px bg-zinc-800/50 my-1 mx-2"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all group text-left"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Terminate Token</span>
                            </button>
                        </div>

                        {/* Status Footer */}
                        <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-800/50 flex items-center justify-between">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;
