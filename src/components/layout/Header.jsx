import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import UserDropdown from '../dashboard/UserDropdown';

const Header = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-surface-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Opportunity Circle</h2>
                </Link>
                <nav className="hidden md:flex items-center gap-10">
                    <NavLink to="/explore" className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>Explore</NavLink>
                    <NavLink to="/publishers" className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>For Publishers</NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link 
                                to={user?.role === 'PUBLISHER' ? '/publisher/dashboard' : '/dashboard'} 
                                className="hidden lg:flex px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all"
                            >
                                Dashboard
                            </Link>
                            <UserDropdown />
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-dark rounded-lg transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
