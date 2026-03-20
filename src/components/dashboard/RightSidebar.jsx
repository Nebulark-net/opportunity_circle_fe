import React from 'react';

const RightSidebar = () => {
    return (
        <aside className="w-80 border-l border-zinc-800 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 p-6 overflow-y-auto hidden xl:flex flex-col gap-8 custom-scrollbar">
            <div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Trending This Week</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent dark:hover:border-zinc-800 hover:border-zinc-800">
                        <div className="bg-blue-500/10 text-blue-500 dark:text-blue-500 rounded-lg p-2 shrink-0 border border-blue-500/20">
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black tracking-widest uppercase text-zinc-100 mb-0.5">Goldman Sachs Insight Program</p>
                            <p className="text-[9px] font-medium tracking-widest uppercase text-zinc-500">2.4k students applied recently</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent dark:hover:border-zinc-800 hover:border-zinc-800">
                        <div className="bg-purple-500/10 text-purple-500 dark:text-purple-500 rounded-lg p-2 shrink-0 border border-purple-500/20">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black tracking-widest uppercase text-zinc-100 mb-0.5">NVIDIA AI Research Intern</p>
                            <p className="text-[9px] font-medium tracking-widest uppercase text-zinc-500">High match for your skill set</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-zinc-800 dark:bg-zinc-800"></div>

            <div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Upcoming Deadlines</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between group cursor-pointer hover:bg-zinc-900/50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Meta Production Eng</span>
                            <span className="text-[9px] text-red-500 font-bold uppercase tracking-[0.2em] mt-0.5">Today at 11:59 PM</span>
                        </div>
                        <button className="text-primary text-[10px] font-black uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Apply</button>
                    </div>

                    <div className="flex items-center justify-between group cursor-pointer hover:bg-zinc-900/50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Tesla Internship</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">3 Days left</span>
                        </div>
                        <button className="text-primary text-[10px] font-black uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Apply</button>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <div className="rounded-xl bg-zinc-900 p-5 text-white shadow-xl border border-zinc-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <p className="text-xs font-black mb-2 text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
                        Pro Access
                    </p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">Get early access to exclusive scholarships and 1-on-1 career coaching.</p>
                    <button className="w-full py-2 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/20 transition-colors shadow-sm relative z-10">Go Premium</button>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
