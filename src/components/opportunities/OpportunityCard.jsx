import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Bookmark } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const OpportunityCard = ({ opportunity }) => {
  const { 
    id, title, company, location, 
    type, deadline, category, salaryRange 
  } = opportunity;

  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-black text-xl">
          {company?.charAt(0)}
        </div>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
            {type}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-1 dark:text-white line-clamp-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{company}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} />
            <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
          </div>
          {salaryRange && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={14} />
              <span>{salaryRange}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-border-dark flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-300">
          Posted 2 days ago
        </span>
        <Link to={`/opportunities/${id}`}>
          <Button variant="ghost" className="text-xs py-1.5">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default OpportunityCard;
