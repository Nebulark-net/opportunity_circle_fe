import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
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
        <aside className={`
            fixed inset-y-0 left-0 z-[70] w-72 h-full border-r border-zinc-800 bg-zinc-950 p-6 
            overflow-y-auto flex flex-col gap-8 custom-scrollbar transition-transform duration-300 ease-out
            lg:relative lg:translate-x-0 lg:z-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden mb-2">
                <div className="text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-100">C-Circle</span>
                </div>
                <button 
                    onClick={onClose}
                    className="size-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Categories</h3>
                <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                        <NavLink
                            key={cat.path}
                            to={cat.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-zinc-800/80 text-primary font-semibold' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-widest">{cat.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="h-px bg-zinc-800"></div>

            <div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Quick Links</h3>
                <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-zinc-800/80 text-primary font-semibold' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Weekly Digest</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">Get personalized opportunities delivered to your inbox.</p>
                    <button className="w-full py-2 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-black tracking-widest rounded-lg hover:bg-primary/20 transition-colors">Enable Alerts</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
