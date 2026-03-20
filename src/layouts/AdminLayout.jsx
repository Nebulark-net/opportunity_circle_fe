import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import UserDropdown from '../components/dashboard/UserDropdown';

const AdminLayout = () => {
    const { user } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
        { to: "/admin/moderation", label: "Moderation", icon: "gavel" },
        { to: "/admin/users", label: "Directory", icon: "group" },
        { to: "/admin/cms", label: "CMS", icon: "hub" },
        { to: "/admin/mentors", label: "Mentors", icon: "person_celebrate" },
    ];

    return (
        <div className="bg-zinc-950 font-sans text-zinc-100 min-h-screen flex flex-col md:flex-row antialiased">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between px-5 py-3 hfas-glass sticky top-0 z-50">
                <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined font-black text-[20px]">admin_panel_settings</span>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">Matrix Ops</h2>
                </div>
                <div className="flex items-center gap-3">
                    <UserDropdown />
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="size-9 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400"
                    >
                        <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-zinc-950/50 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800/50 transform transition-transform duration-300 ease-in-out flex flex-col
                md:relative md:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="px-6 py-10 hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[18px] font-black">admin_panel_settings</span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100">Admin</h2>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Precision Core</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            onClick={() => setIsSidebarOpen(false)}
                            className={({isActive}) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300
                                ${isActive 
                                    ? 'bg-zinc-800 text-primary shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50'}
                            `}
                        >
                            {({isActive}) => (
                                <>
                                    <span className={`material-symbols-outlined text-[18px] transition-colors ${isActive ? 'text-primary' : 'text-zinc-500'}`}>
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-800/50 hidden md:block">
                    <div className="p-3 rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
                         <UserDropdown />
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-zinc-600 text-[16px]">more_vert</span>
                         </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 max-h-screen overflow-y-auto bg-zinc-950">
                <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
