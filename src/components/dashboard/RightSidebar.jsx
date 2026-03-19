import React from 'react';

const RightSidebar = () => {
    return (
        <aside className="w-80 border-l border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark p-6 overflow-y-auto hidden xl:flex flex-col gap-8 custom-scrollbar">
            <div>
                <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-4">Trending This Week</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-border-dark transition-colors cursor-pointer border border-transparent dark:hover:border-border-dark border-slate-100">
                        <div className="bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-lg p-2 shrink-0">
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">Goldman Sachs Insight Program</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">2.4k students applied recently</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-border-dark transition-colors cursor-pointer border border-transparent dark:hover:border-border-dark border-slate-100">
                        <div className="bg-purple-500/20 text-purple-500 dark:text-purple-400 rounded-lg p-2 shrink-0">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">NVIDIA AI Research Intern</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">High match for your skill set</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-border-dark"></div>

            <div>
                <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-4">Upcoming Deadlines</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white">Meta Production Eng</span>
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-semibold">Today at 11:59 PM</span>
                        </div>
                        <button className="text-primary text-[10px] font-bold uppercase hover:underline">Apply</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white">Tesla Internship</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">3 Days left</span>
                        </div>
                        <button className="text-primary text-[10px] font-bold uppercase hover:underline">Apply</button>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <div className="rounded-xl bg-gradient-to-br from-primary to-blue-600 p-5 text-white shadow-lg shadow-primary/20">
                    <p className="text-sm font-bold mb-2">Upgrade to Pro</p>
                    <p className="text-xs text-white/90 leading-relaxed mb-4">Get early access to exclusive scholarships and 1-on-1 career coaching.</p>
                    <button className="w-full py-2 bg-white text-primary text-xs font-black rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Go Premium</button>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
