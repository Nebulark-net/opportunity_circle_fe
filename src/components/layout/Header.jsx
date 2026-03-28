import React from 'react';
import { Menu } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import UserDropdown from '../dashboard/UserDropdown';
import useLayoutStore from '../../stores/layoutStore';

const Header = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { toggleMobileMenu } = useLayoutStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-dark/70 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        className="md:hidden inline-flex size-10 items-center justify-center rounded-xl border border-border-dark bg-surface-dark text-light-gray hover:text-off-white hover:border-primary/35"
                    >
                        <Menu size={18} />
                    </button>
                    <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-hfas-teal-sm">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-light-gray">High-Resolution Hub</span>
                        <h2 className="text-lg font-black tracking-tight text-off-white">Opportunity Circle</h2>
                    </div>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-2 rounded-full border border-border-dark/60 bg-surface-dark/80 p-1 shadow-hfas-inner">
                    <NavLink
                        to="/explore"
                        className={({isActive}) => `rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
                            isActive
                                ? 'bg-primary/10 text-primary shadow-hfas-teal-sm'
                                : 'text-light-gray hover:bg-background-dark/60 hover:text-off-white'
                        }`}
                    >
                        Explore
                    </NavLink>
                    <NavLink
                        to="/publishers"
                        className={({isActive}) => `rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
                            isActive
                                ? 'bg-primary/10 text-primary shadow-hfas-teal-sm'
                                : 'text-light-gray hover:bg-background-dark/60 hover:text-off-white'
                        }`}
                    >
                        For Publishers
                    </NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link 
                                to={user?.role === 'PUBLISHER' ? '/publisher/dashboard' : '/dashboard'} 
                                className="hidden lg:inline-flex btn-primary"
                            >
                                Dashboard
                            </Link>
                            <UserDropdown />
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:inline-flex btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary">
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
