import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/user.service';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const Resources = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const { data: result, isLoading } = useQuery({
        queryKey: ['resources', selectedCategory, searchQuery],
        queryFn: () => userService.getAllResources({ 
            type: selectedCategory !== 'ALL' ? selectedCategory : undefined,
            search: searchQuery || undefined 
        }),
    });

    const { data: savedItems } = useQuery({
        queryKey: ['saved-opportunities'],
        queryFn: () => api.get('/seekers/saved-items').then(res => res.data.data || [])
    });

    const savedIds = new Set(savedItems?.map(item => item._id));

    const toggleSaveMutation = useMutation({
        mutationFn: (resourceId) => api.post('/seekers/toggle-save', { itemId: resourceId, itemType: 'RESOURCE' }),
        onMutate: async (resourceId) => {
            await queryClient.cancelQueries(['saved-opportunities']);
            const previousSaved = queryClient.getQueryData(['saved-opportunities']);
            queryClient.setQueryData(['saved-opportunities'], (old = []) => {
                const exists = old.find(item => item._id === resourceId);
                if (exists) return old.filter(item => item._id !== resourceId);
                return [...old, { _id: resourceId }];
            });
            return { previousSaved };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['saved-opportunities'], context.previousSaved);
        },
        onSettled: () => {
            queryClient.invalidateQueries(['saved-opportunities']);
        }
    });

    const resources = result?.data?.resources || [];

    const categories = [
        { id: 'ALL', label: 'All Resources', icon: 'grid_view' },
        { id: 'INTERVIEW_PREP', label: 'Interview Prep', icon: 'forum' },
        { id: 'RESUME_TEMPLATE', label: 'Resume Building', icon: 'description' },
        { id: 'CAREER_GUIDE', label: 'Career Guides', icon: 'explore' },
        { id: 'SKILL_WORKSHOP', label: 'Skill Workshops', icon: 'build' },
    ];

    const formats = [
        { id: 'ARTICLE', label: 'Articles & Guides' },
        { id: 'VIDEO', label: 'Video Tutorials' },
        { id: 'RESUME_TEMPLATE', label: 'Templates' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
            {/* Left Sidebar - Filters & Context */}
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
                <div>
                    <h3 className="text-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Resource Categories</h3>
                    <div className="flex flex-col gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-[11px] uppercase tracking-widest ${
                                    selectedCategory === cat.id 
                                        ? 'bg-primary/10 text-primary border border-primary/20' 
                                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-zinc-800/50"></div>

                <div>
                    <h3 className="text-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Content Format</h3>
                    <div className="space-y-3">
                        {formats.map((format) => (
                            <label key={format.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="size-4 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary/50 transition-all cursor-pointer"
                                />
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                    {format.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-all duration-700"></div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Weekly Digest</p>
                        <p className="text-[10px] text-zinc-400 font-medium leading-relaxed mb-4">Get top professional resources delivered to your inbox every module refresh.</p>
                        <button className="w-full py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-hfas-teal">
                            Enable Alerts
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col gap-6">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-white italic tracking-tight uppercase">Knowledge Nexus</h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Deciphering {resources.length}+ high-value career data points</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64 group">
                             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors text-[18px]">search</span>
                            <input
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                placeholder="Query knowledge base..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"></div>)}
                    </div>
                ) : resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                        <span className="material-symbols-outlined text- zinc-700 text-5xl mb-4">folder_off</span>
                        <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em]">No matching data found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {resources.map((resource) => (
                                <motion.article 
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={resource._id || resource.id} 
                                    className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col gap-6 transition-all hover:border-primary/40 group relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="size-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <span className="material-symbols-outlined text-2xl">
                                                {resource.type === 'VIDEO' ? 'play_circle' : (resource.type === 'RESUME_TEMPLATE' ? 'description' : 'explore')}
                                            </span>
                                        </div>
                                        <span className="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                            {resource.type?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2 relative z-10">
                                        <h3 className="text-[12px] font-black uppercase tracking-wide text-zinc-100 leading-tight group-hover:text-primary transition-colors">{resource.title?.en || resource.title}</h3>
                                        <p className="text-[10px] font-medium text-zinc-500 leading-relaxed line-clamp-2 my-2">{resource.description?.en || resource.description}</p>
                                    </div>

                                    <div className="flex items-center gap-3 relative z-10">
                                        <button className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-primary text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                            Terminate Data
                                        </button>
                                        <button 
                                            onClick={() => toggleSaveMutation.mutate(resource._id)}
                                            className={`size-11 rounded-xl bg-zinc-800 border transition-all flex items-center justify-center ${
                                                savedIds.has(resource._id) ? 'border-primary text-primary shadow-hfas-teal-sm' : 'border-zinc-700 text-zinc-500 hover:text-primary hover:border-primary'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: savedIds.has(resource._id) ? "'FILL' 1" : "'FILL' 0" }}>
                                                {savedIds.has(resource._id) ? 'bookmark' : 'bookmark_border'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Abstract background effect */}
                                    <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                
                {resources.length > 0 && (
                    <div className="flex justify-center py-10 mt-6 border-t border-zinc-800">
                        <button className="flex items-center gap-2 px-8 py-3 rounded-xl border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all text-[10px] font-black bg-zinc-900 uppercase tracking-[0.3em]">
                            <span className="material-symbols-outlined text-[18px]">sync</span>
                            Scan Further Data
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Resources;
