import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AdminLayout = ({ children }) => {
    const { user } = useAuthStore();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-background-dark">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-8 flex items-center justify-center rounded bg-primary/10">
                            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Opportunity Circle Admin</h2>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-8">
                        <NavLink to="/admin/dashboard" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Dashboard</NavLink>
                        <NavLink to="/admin/moderation" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Moderation</NavLink>
                        <NavLink to="/admin/publishers" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Publishers</NavLink>
                        <NavLink to="/admin/settings" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Settings</NavLink>
                    </nav>
                    <div className="flex gap-3 items-center">
                        <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">{user?.fullName}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mt-1">{user?.role}</p>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url(${user?.profilePhotoUrl || 'https://via.placeholder.com/36'})` }}></div>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
};

export default AdminLayout;
