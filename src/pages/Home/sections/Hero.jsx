import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import MaxContainer from '../../../components/layout/MaxContainer';
import LiveSearch from '../../../components/Search/LiveSearch';
import useFilterStore from '../../../stores/filterStore';

const Hero = () => {
  const navigate = useNavigate();
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery);

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      navigate('/explore');
    }
  };

  return (
    <section className="pt-12 pb-16 overflow-hidden">
      <MaxContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide w-fit border border-primary/20">
              <Rocket size={14} />
              <span>Fueling Your Career Journey</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-white tracking-tight">
              Unlock Your Future with <span className="text-primary">Early-Career</span> Opportunities
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
              Discover scholarships, internships, and fellowships tailored for students and early professionals.
            </p>

            {/* Quick Search */}
            <div className="max-w-md w-full py-2">
              <LiveSearch 
                placeholder="Quick search: e.g. 'Software Intern'..." 
                onSearch={handleSearch}
                className="shadow-xl shadow-primary/5"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/signup')} 
                className="btn-primary flex items-center gap-2 px-6 py-3 text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Get Started Now
                <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Verified Programs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Global Reach</span>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700">
               {/* Placeholder for the image from designs */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent-teal/20 flex items-center justify-center">
                  <span className="text-slate-400 font-medium">Hero Image Placeholder</span>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-surface-dark p-4 rounded-card shadow-xl border border-slate-100 dark:border-border-dark flex items-center gap-4 animate-bounce-slow">
               <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                 <Rocket size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-900 dark:text-white">500+ Programs</p>
                 <p className="text-[10px] text-slate-500">Added this month</p>
               </div>
            </div>
          </div>
        </div>
      </MaxContainer>
    </section>
  );
};

export default Hero;
