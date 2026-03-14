import React from 'react';
import { toast } from 'sonner';
import api from '../../lib/api';

const OpportunityCard = ({ opportunity, isSaved, onToggleSave }) => {
  const {
    _id,
    title,
    organizationName,
    location,
    type,
    description,
    deadline,
    fundingType,
    educationLevel,
    applyUrl,
    imageUrl,
  } = opportunity;

  const handleApply = (e) => {
    e.stopPropagation();
    if (applyUrl) {
      window.open(applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Application link not available for this opportunity.');
    }
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    try {
      await api.post('/seekers/toggle-save', {
        itemId: _id,
        itemType: 'OPPORTUNITY'
      });
      onToggleSave(_id);
      toast.success(isSaved ? 'Removed from saved items' : 'Opportunity saved!');
    } catch (error) {
      toast.error('Failed to update saved status.');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer relative">
      <div className="flex gap-6">
        <div className="size-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-border-dark overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={organizationName} className="w-full h-full object-contain" />
          ) : (
            <span className="material-symbols-outlined text-primary text-3xl">work</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                {title.en || title}
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                {organizationName} • {location}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleToggleSave}
                className={`p-2 rounded-lg bg-background-dark border border-border-dark transition-all ${
                  isSaved ? 'text-primary' : 'text-slate-400 hover:text-primary hover:border-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-1' : ''}`}>
                  bookmark
                </span>
              </button>
              <button 
                onClick={handleApply}
                className="px-4 py-2 bg-primary text-[#101c22] text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
          
          <p className="text-slate-300 text-sm line-clamp-2 mb-4">
            {description.en || description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            {deadline && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/20">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Deadline: {formatDate(deadline)}
              </div>
            )}
            {fundingType && fundingType !== 'N/A' && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-[11px] font-bold border border-green-500/20">
                <span className="material-symbols-outlined text-[14px]">payments</span>
                {fundingType.replace('_', ' ')}
              </div>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
              <span className="material-symbols-outlined text-[14px]">category</span>
              {type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
