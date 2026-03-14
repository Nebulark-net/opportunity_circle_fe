import React from 'react';
import { NavLink } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All Opportunities', icon: 'grid_view', path: '/dashboard' },
  { id: 'INTERNSHIP', label: 'Internships', icon: 'work', path: '/dashboard/internships' },
  { id: 'SCHOLARSHIP', label: 'Scholarships', icon: 'school', path: '/dashboard/scholarships' },
  { id: 'FELLOWSHIP', label: 'Fellowships', icon: 'group', path: '/dashboard/fellowships' },
  { id: 'WORKSHOP', label: 'Workshops', icon: 'psychology', path: '/dashboard/workshops' },
  { id: 'EVENT', label: 'Events', icon: 'event', path: '/dashboard/events' },
];

const Sidebar = () => {
  return (
    <aside className="w-72 border-r border-border-dark bg-background-dark p-6 overflow-y-auto hidden lg:flex flex-col gap-8">
      <div>
        <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <NavLink
              key={cat.id}
              to={cat.path}
              end={cat.path === '/dashboard'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-slate-400 hover:bg-border-dark hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              <span className="text-sm">{cat.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="h-px bg-border-dark"></div>

      <div>
        <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Quick Filters</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Employment Type</label>
            <div className="flex flex-wrap gap-2">
              {['Remote', 'Full-time', 'Part-time'].map(type => (
                <span key={type} className="px-2 py-1 bg-border-dark rounded text-[11px] font-medium text-slate-300 border border-slate-700 cursor-pointer hover:border-primary transition-colors">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">Weekly Digest</p>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Get personalized opportunities delivered to your inbox.</p>
          <button className="w-full py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Enable Alerts
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
