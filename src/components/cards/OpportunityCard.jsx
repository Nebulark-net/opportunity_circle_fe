import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Bookmark, CheckCircle } from 'lucide-react';

const OpportunityCard = ({ opportunity }) => {
  const { 
    id, _id, title, organizationName, location, 
    type, deadline, imageUrl, isVerified 
  } = opportunity;

  const opportunityId = id || _id;

  // Format title (handle object or string)
  const displayTitle = typeof title === 'object' ? title.en : title;

  return (
    <div className="card flex flex-col h-full group p-4 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark transition-all hover:shadow-lg hover:border-primary/30">
      {/* Image or Placeholder */}
      <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-bold uppercase text-lg">
             {organizationName?.charAt(0) || 'O'}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
           <span className="px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
             {type}
           </span>
        </div>

        {/* Bookmark Button */}
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-surface-dark/80 text-slate-500 hover:text-primary backdrop-blur-sm transition-colors">
          <Bookmark size={14} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-1.5 mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {organizationName}
          </p>
          {isVerified && (
            <CheckCircle size={12} className="text-primary fill-primary/10" title="Verified Publisher" />
          )}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={14} className="text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={14} className="text-primary" />
            <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <Link 
          to={`/opportunities/${opportunityId}`}
          className="mt-4 flex items-center justify-between py-2 text-xs font-bold text-primary hover:text-primary/80 transition-all border-t border-slate-100 dark:border-border-dark pt-4"
        >
          <span>View Details</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;
