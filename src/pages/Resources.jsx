import React from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/user.service';

const Resources = () => {
    const { data: result, isLoading } = useQuery({
        queryKey: ['resources'],
        queryFn: userService.getNotifications, // Using a similar fetching pattern or specific resource service if available
    });

    // Mock data if actual resources endpoint is not ready/hydrated
    const resources = [
        { id: 1, title: 'Resume Excellence Guide', description: 'Master the art of creating high-impact resumes for tech roles.', type: 'Guide', icon: 'description' },
        { id: 2, title: 'Interview Mastery Course', description: 'Comprehensive video series on behavioral and technical interviews.', type: 'Video', icon: 'play_circle' },
        { id: 3, title: 'Network Strategy Template', description: 'Structured approach to building meaningful professional connections.', type: 'Template', icon: 'account_tree' },
        { id: 4, title: 'Global Scholarship Catalog', description: 'Updated list of active international scholarships for 2024.', type: 'Document', icon: 'auto_stories' },
        { id: 5, title: 'Internship Tracker (Excel)', description: 'Professional grade tracking template for multiple applications.', type: 'Tool', icon: 'table_chart' },
    ];

    if (isLoading) {
        return (
            <div className="p-6 w-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Knowledge Base</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Curated professional resources to accelerate your career trajectory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <article key={resource.id} className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm p-6 flex flex-col gap-6 transition-all hover:border-primary/30 group">
                        <div className="flex items-start justify-between">
                            <div className="size-12 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-border-dark flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">{resource.icon}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-wider text-primary">
                                {resource.type}
                            </span>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{resource.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{resource.description}</p>
                        </div>

                        <button className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-background-dark hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            Access Content
                        </button>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Resources;
