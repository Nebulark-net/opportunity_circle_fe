import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const Header = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    const seekerNavItems = [
        { path: '/dashboard/feed', label: 'Opportunities' },
        { path: '/dashboard/saved', label: 'Saved' },
        { path: '/dashboard/applications', label: 'Applications' },
        { path: '/dashboard/resources', label: 'Resources' },
    ];

    const publisherNavItems = [
        { path: '/publisher/dashboard', label: 'Console' },
        { path: '/publisher/listings', label: 'Listings' },
        { path: '/publisher/applicants', label: 'Applicants' },
        { path: '/publisher/create', label: 'Deploy' },
    ];

    const navItems = user?.role === 'PUBLISHER' ? publisherNavItems : seekerNavItems;

    return (
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark px-6 py-3 shrink-0">
            <div className="flex items-center gap-8">
                <Link to={user?.role === 'PUBLISHER' ? "/publisher/dashboard" : "/dashboard"} className="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined">explore</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Opportunity Circle</h2>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = item.exact 
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-semibold transition-colors pb-1 ${
                                    isActive 
                                        ? 'text-primary border-b-2 border-primary' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <NotificationDropdown />
                <Link to="/settings" className="p-2 rounded-lg bg-slate-100 dark:bg-border-dark text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                </Link>
                <div className="h-8 w-px bg-slate-200 dark:bg-border-dark mx-1"></div>
                
                <UserDropdown />
            </div>
        </header>
    );
};

export default Header;
