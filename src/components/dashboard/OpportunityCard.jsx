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
            className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 hover:border-primary/50 dark:hover:border-primary/50 transition-all group cursor-pointer relative shadow-sm"
        >
            <div className="flex gap-6">
                {/* Organization Logo */}
                <div className="size-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-slate-200 dark:border-border-dark overflow-hidden">
                    {imageUrl ? (
                        <img 
                            alt={organizationName} 
                            className="w-full h-full object-contain" 
                            src={imageUrl} 
                        />
                    ) : (
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl">
                            {type === 'SCHOLARSHIP' ? 'school' : 'business_center'}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-1 gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                {displayTitle}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                {organizationName || 'Unknown Organization'} • {location || 'Remote'}
                            </p>
                        </div>
                        <div className="flex gap-2 self-start">
                            <button
                                onClick={(e) => { e.stopPropagation(); /* Handle save */ }}
                                className="p-2 rounded-lg bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-400 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all flex items-center justify-center"
                                title="Save for later"
                            >
                                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigate(`/opportunity/${_id}`); }}
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {displayDescription}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Deadline Badge */}
                        {deadline && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold border border-red-200 dark:border-red-500/20">
                                <span className="material-symbols-outlined text-[14px]">timer</span>
                                Deadline: {formatDate(deadline)}
                            </div>
                        )}
                        
                        {/* Funding Badge */}
                        {fundingType && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-green-100/50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[11px] font-bold border border-green-200 dark:border-green-500/20 capitalize">
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                {fundingType.replace('_', ' ')}
                            </div>
                        )}
                        
                        {/* Education Level Badge */}
                        {educationLevel && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 text-primary text-[11px] font-bold border border-primary/20 capitalize">
                                <span className="material-symbols-outlined text-[14px]">school</span>
                                {educationLevel.replace('_', ' ')}
                            </div>
                        )}

                        {/* Opportunity Type Badge */}
                        {type && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold border border-slate-200 dark:border-slate-700 capitalize">
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
