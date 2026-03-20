import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { toast } from 'sonner';

const AdminCMS = () => {
    const queryClient = useQueryClient();
    const [editingPage, setEditingPage] = useState(null);
    const [editData, setEditData] = useState({});

    const { data: cmsResponse, isLoading } = useQuery({
        queryKey: ['cms-pages'],
        queryFn: adminService.getCmsPages
    });

    const updateCmsMutation = useMutation({
        mutationFn: ({ pageKey, data }) => adminService.updateCmsPage(pageKey, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['cms-pages']);
            toast.success('Strategy synchronized successfully');
            setEditingPage(null);
        },
        onError: () => toast.error('Failed to commit strategy data')
    });

    const startEditing = (page) => {
        setEditingPage(page);
        setEditData({
            title: page.title || { en: '', fr: '' },
            mainHeading: page.mainHeading || { en: '', fr: '' },
            heroImageUrl: page.heroImageUrl || ''
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        updateCmsMutation.mutate({ pageKey: editingPage.pageKey, data: editData });
    };

    const pages = cmsResponse?.data || [];

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-zinc-800">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-zinc-100 tracking-tight uppercase">Content Matrix</h1>
                    <p className="text-zinc-500 font-medium text-xs uppercase tracking-[0.2em]">Manage and orchestrate platform strategy nodes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Node Registry */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Registered Nodes</h3>
                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-800/50 rounded-2xl animate-pulse"></div>)
                        ) : pages.length > 0 ? (
                            pages.map((page) => (
                                <button 
                                    key={page._id}
                                    onClick={() => startEditing(page)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left group ${
                                        editingPage?.pageKey === page.pageKey 
                                        ? 'bg-primary border-primary text-white shadow-hfas-md scale-[1.02]' 
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:scale-[1.01]'
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-black text-xs tracking-tight uppercase">{page.pageKey}</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest truncate max-w-[150px]">
                                            {typeof page.title === 'object' ? page.title.en : page.title}
                                        </p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[18px] transition-transform ${editingPage?.pageKey === page.pageKey ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
                                        {editingPage?.pageKey === page.pageKey ? 'expand_circle_right' : 'chevron_right'}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="hfas-card p-10 text-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Registry Vacant</div>
                        )}
                    </div>
                </div>

                {/* Editor */}
                <div className="lg:col-span-2">
                    {editingPage ? (
                        <div className="hfas-card overflow-hidden animate-in slide-in-from-right-8 duration-500">
                            <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-800/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-hfas-sm">
                                        <span className="material-symbols-outlined">edit_square</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-zinc-100 uppercase tracking-tight">Strategy Modulator</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Protocol: {editingPage.pageKey}</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingPage(null)} className="size-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-10 flex flex-col gap-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Primary Heading (EN)</label>
                                        <textarea 
                                            value={editData.mainHeading?.en || ''} onChange={(e) => setEditData({...editData, mainHeading: {...editData.mainHeading, en: e.target.value}})}
                                            rows={3} className="hfas-input min-h-[100px] resize-none text-sm font-bold leading-relaxed" placeholder="Enter English Heading..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Primary Heading (FR)</label>
                                        <textarea 
                                            value={editData.mainHeading?.fr || ''} onChange={(e) => setEditData({...editData, mainHeading: {...editData.mainHeading, fr: e.target.value}})}
                                            rows={3} className="hfas-input min-h-[100px] resize-none text-sm font-bold leading-relaxed" placeholder="Entrez le titre en français..."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Hero Asset Endpoint (URL)</label>
                                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                                        <input type="text" value={editData.heroImageUrl || ''} onChange={(e) => setEditData({...editData, heroImageUrl: e.target.value})} className="hfas-input flex-1" placeholder="https://images.unsplash.com/..." />
                                        {editData.heroImageUrl && (
                                            <div className="size-12 rounded-xl border border-zinc-700 overflow-hidden shrink-0 shadow-hfas-inner bg-zinc-800">
                                                <img src={editData.heroImageUrl} className="size-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-800 flex items-center justify-between gap-6">
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest max-w-[200px]">Committing changes will immediately update the live platform matrix.</p>
                                    <div className="flex items-center gap-4">
                                        <button type="button" onClick={() => setEditingPage(null)} className="hfas-btn-ghost px-6">Abort</button>
                                        <button type="submit" disabled={updateCmsMutation.isPending} className="hfas-btn-primary px-10 min-w-[160px]">
                                            {updateCmsMutation.isPending ? 'Syncing...' : 'Commit Protocol'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] bg-zinc-900/30 border-2 border-dashed border-zinc-800/50 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 group">
                            <div className="size-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-600 mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-hfas-sm">
                                <span className="material-symbols-outlined text-4xl">deployed_code</span>
                            </div>
                            <h4 className="text-xl font-black text-zinc-500 uppercase tracking-tight">Target Selection Required</h4>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-3 max-w-sm leading-relaxed">Choose a strategy node from the registry on the left to begin orchestration.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCMS;
