import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const categories = [
        { path: '/dashboard/feed', label: 'All Opportunities', icon: 'grid_view' },
        { path: '/dashboard/internships', label: 'Internships', icon: 'work' },
        { path: '/dashboard/scholarships', label: 'Scholarships', icon: 'school' },
        { path: '/dashboard/fellowships', label: 'Fellowships', icon: 'group' },
        { path: '/dashboard/workshops', label: 'Workshops', icon: 'psychology' },
    ];

    const navLinks = [
        { path: '/dashboard/profile', label: 'Profile', icon: 'person' },
        { path: '/dashboard/settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <aside className="w-72 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark p-6 overflow-y-auto hidden lg:flex flex-col gap-8 custom-scrollbar">
            <div>
                <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
                <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                        <NavLink
                            key={cat.path}
                            to={cat.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark hover:text-slate-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                            <span className="text-sm">{cat.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-border-dark"></div>

            <div>
                <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-4">Quick Links</h3>
                <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark hover:text-slate-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                            <span className="text-sm">{link.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-1">Weekly Digest</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">Get personalized opportunities delivered to your inbox.</p>
                    <button className="w-full py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-colors">Enable Alerts</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
