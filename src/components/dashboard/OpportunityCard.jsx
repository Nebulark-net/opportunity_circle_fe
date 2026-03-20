import React from 'react';
import { useNavigate } from 'react-router-dom';

const OpportunityCard = ({ opportunity }) => {
    const navigate = useNavigate();
    const {
        _id,
        title,
        organizationName,
        location,
        description,
        deadline,
        fundingType,
        educationLevel,
        type,
        imageUrl
    } = opportunity;

    // Handle i18n title and description
    const displayTitle = typeof title === 'object' ? title.en : title;
    const displayDescription = typeof description === 'object' ? description.en : description;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div
            onClick={() => navigate(`/opportunity/${_id}`)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer relative shadow-sm"
        >
            <div className="flex gap-6">
                {/* Organization Logo */}
                <div className="size-16 rounded-xl bg-zinc-950 p-2 flex items-center justify-center shrink-0 border border-zinc-800 overflow-hidden">
                    {imageUrl ? (
                        <img 
                            alt={organizationName} 
                            className="w-full h-full object-contain" 
                            src={imageUrl} 
                        />
                    ) : (
                        <span className="material-symbols-outlined text-zinc-600 text-3xl">
                            {type === 'SCHOLARSHIP' ? 'school' : 'business_center'}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-1 gap-4">
                        <div className="flex-1">
                            <h3 className="text-[13px] font-black uppercase tracking-wide text-zinc-100 group-hover:text-primary transition-colors truncate">
                                {displayTitle}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-0.5">
                                {organizationName || 'Unknown Organization'} • {location || 'Remote'}
                            </p>
                        </div>
                        <div className="flex gap-2 self-start">
                            <button
                                onClick={(e) => { e.stopPropagation(); /* Handle save */ }}
                                className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center"
                                title="Save for later"
                            >
                                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigate(`/opportunity/${_id}`); }}
                                className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/90 transition-all"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-[11px] font-medium text-zinc-400 line-clamp-2 mb-4 leading-relaxed tracking-wide">
                        {displayDescription}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                        {/* Deadline Badge */}
                        {deadline && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/10">
                                <span className="material-symbols-outlined text-[12px]">timer</span>
                                Deadline: {formatDate(deadline)}
                            </div>
                        )}
                        
                        {/* Funding Badge */}
                        {fundingType && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/5 text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/10">
                                <span className="material-symbols-outlined text-[12px]">payments</span>
                                {fundingType.replace('_', ' ')}
                            </div>
                        )}
                        
                        {/* Education Level Badge */}
                        {educationLevel && (
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10">
                                <span className="material-symbols-outlined text-[12px]">school</span>
                                {educationLevel.replace('_', ' ')}
                            </div>
                        )}

                        {/* Opportunity Type Badge */}
                        {type && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest border border-zinc-700">
                                {type.toLowerCase().replace('_', ' ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityCard;
