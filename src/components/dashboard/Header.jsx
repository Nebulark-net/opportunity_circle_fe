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
        <header className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 px-6 py-3 shrink-0 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to={user?.role === 'PUBLISHER' ? "/publisher/dashboard" : "/dashboard"} className="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg border border-primary/20">
                        <span className="material-symbols-outlined text-[20px]">explore</span>
                    </div>
                    <h2 className="text-zinc-100 text-[13px] font-black uppercase tracking-[0.1em]">Opportunity Circle</h2>
                </Link>
                
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = item.exact 
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${
                                    isActive 
                                        ? 'text-primary border-primary shadow-[0_4px_10px_-4px_rgba(0,167,149,0.3)]' 
                                        : 'text-zinc-500 hover:text-zinc-100 border-transparent'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-5">
                <NotificationDropdown />
                <Link to="/settings" className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-100 flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </Link>
                <div className="h-6 w-px bg-zinc-800 mx-1"></div>
                
                <UserDropdown />
            </div>
        </header>
    );
};

export default Header;
