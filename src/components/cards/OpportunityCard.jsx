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
    <div className="card flex h-full flex-col gap-4 p-4 group">
      {/* Image or Placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-background-dark">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 font-bold uppercase text-lg">
             {organizationName?.charAt(0) || 'O'}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
           <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
             {type}
           </span>
        </div>

        {/* Bookmark Button */}
        <button className="absolute top-2 right-2 rounded-full border border-border-dark/70 bg-background-dark/80 p-1.5 text-light-gray hover:text-primary backdrop-blur-sm transition-colors">
          <Bookmark size={14} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="mb-1 line-clamp-1 text-lg font-bold text-off-white group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-1.5 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-light-gray">
            {organizationName}
          </p>
          {isVerified && (
            <CheckCircle size={12} className="text-primary fill-primary/10" title="Verified Publisher" />
          )}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-xs text-light-gray">
            <MapPin size={14} className="text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-light-gray">
            <Calendar size={14} className="text-primary" />
            <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <Link 
          to={`/opportunities/${opportunityId}`}
          className="mt-4 flex items-center justify-between border-t border-border-dark/70 pt-4 text-xs font-black uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-all"
        >
          <span>View Details</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;
