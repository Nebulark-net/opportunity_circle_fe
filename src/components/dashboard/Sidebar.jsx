import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    
    // Fetch User Preferences & New Opportunities for Digest
    const { data: profileData } = useQuery({
        queryKey: ['profile-context'],
        queryFn: () => api.get('/seekers/profile').then(res => res.data.data)
    });

    const { data: opportunities } = useQuery({
        queryKey: ['opportunities-digest'],
        queryFn: () => api.get('/opportunities').then(res => res.data.data.opportunities),
        enabled: !!profileData?.preferences
    });

    const categories = [
        { path: '/dashboard/feed', label: 'All Opportunities', icon: 'grid_view' },
        { path: '/dashboard/internships', label: 'Internships', icon: 'work' },
        { path: '/dashboard/scholarships', label: 'Scholarships', icon: 'school' },
        { path: '/dashboard/fellowships', label: 'Fellowships', icon: 'group' },
        { path: '/dashboard/workshops', label: 'Workshops', icon: 'psychology' },
    ];

    const navLinks = [
        { path: '/dashboard/resources', label: 'Knowledge Base', icon: 'auto_stories' },
        { path: '/dashboard/applications', label: 'My Applications', icon: 'assignment' },
        { path: '/dashboard/saved', label: 'Saved Archive', icon: 'bookmark' },
    ];

    // Calculate Weekly Digest Stats
    const getDigestStats = () => {
        if (!opportunities || !profileData?.preferences) return null;
        const interestedTypes = profileData.preferences.interestedTypes || [];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const matches = opportunities.filter(opp => {
            const isMatch = interestedTypes.length === 0 || interestedTypes.includes(opp.type);
            const isNew = new Date(opp.createdAt) > sevenDaysAgo;
            return isMatch && isNew;
        });

        return matches.length;
    };

    const matchCount = getDigestStats();
    const isDigestEnabled = profileData?.preferences?.weeklyDigest;

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
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Navigation Sector</h3>
                <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                        <NavLink
                            key={cat.path}
                            to={cat.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="h-px bg-zinc-800/50"></div>

            <div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Operational Nexus</h3>
                <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                <div className="bg-zinc-950/40 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-700"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 italic">Weekly Digest</p>
                    {isDigestEnabled ? (
                        <div className="space-y-3">
                            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                {matchCount > 0 
                                    ? `Detected ${matchCount} new matching nodes in your sector this week.` 
                                    : 'Scanning for new matching nodes...'}
                            </p>
                            <div className="flex items-center gap-2 text-emerald-500">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[8px] font-black uppercase tracking-widest">Live Monitoring</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mb-4">Integrate automated opportunity scanning into your workflow.</p>
                            <button className="w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-hfas-teal">Enable Alerts</button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
