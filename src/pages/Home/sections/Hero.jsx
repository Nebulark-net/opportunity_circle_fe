import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            Fueling Your Career Journey
          </div>
          <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Unlock Your Future with <span className="text-primary">Early-Career</span> Opportunities
          </h1>
          <p className="text-lg text-slate-600 dark:text-accent-muted leading-relaxed max-w-xl">
            Discover scholarships, internships, and fellowships tailored for students and early professionals. Manage your applications in one centralized, structured platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              Get Started Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button 
              onClick={() => navigate('/explore')}
              className="px-8 py-4 bg-slate-200 dark:bg-surface-dark font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-surface-dark/80 transition-all"
            >
              Explore Opportunities
            </button>
          </div>
        </div>
        <div className="relative">
          <div 
            className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark bg-slate-200 dark:bg-surface-dark group"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdOZD2GqsqZo31xiHhuiZ8wPtK7ed2amu11H3vpZuJbh6U1nlZn-YAtg4WyaVjmkmgnLRLwE8OR3tIpW02R2q1T-D2VoxjZq_AYuanmAnKRQvR4XWyBnYMn0AKkIigc_aMJ60ZJ8Eo-UuYA1zpcVyasvpU5voQM29pdwNjziJD8SGjtqpBECW5x5env_mLzexj1XYyY0POm5lxK5hZ7KgYvy8gX-sf7Qo51KqP-S89aJF4GMeln3--ooSBA_ofvco5vQwDsGx-Yk8")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 max-w-[200px]">
            <div className="h-10 w-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">500+ Programs</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Verified Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
