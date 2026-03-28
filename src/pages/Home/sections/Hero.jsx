import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(19,164,236,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(29,78,216,0.16),transparent_28%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary shadow-hfas-teal-sm">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            High-Resolution Hub
          </div>
          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-off-white">
            Discover <span className="text-primary">editorial-grade</span> opportunities built for ambitious careers.
          </h1>
          <p className="max-w-xl text-base leading-8 text-accent-muted md:text-lg">
            Midnight Obsidian turns the opportunity search into a curated, high-signal feed. Scholarships, internships, fellowships, and events are illuminated with the context you need to move fast.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-hfas-teal transition-transform hover:-translate-y-0.5"
            >
              Get Started Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button 
              onClick={() => navigate('/explore')}
              className="btn-secondary px-8 py-4 text-sm"
            >
              Explore Opportunities
            </button>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {['500+ active programs', 'Global reach', 'Editorial filtering'].map((item) => (
              <div key={item} className="rounded-full border border-border-dark bg-surface-dark/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-light-gray">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div 
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-border-dark bg-surface-dark shadow-hfas-lg"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdOZD2GqsqZo31xiHhuiZ8wPtK7ed2amu11H3vpZuJbh6U1nlZn-YAtg4WyaVjmkmgnLRLwE8OR3tIpW02R2q1T-D2VoxjZq_AYuanmAnKRQvR4XWyBnYMn0AKkIigc_aMJ60ZJ8Eo-UuYA1zpcVyasvpU5voQM29pdwNjziJD8SGjtqpBECW5x5env_mLzexj1XYyY0POm5lxK5hZ7KgYvy8gX-sf7Qo51KqP-S89aJF4GMeln3--ooSBA_ofvco5vQwDsGx-Yk8")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/45 to-transparent"></div>
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 flex max-w-[240px] items-center gap-4 rounded-2xl border border-border-dark bg-surface_container_high/95 p-4 shadow-hfas-lg backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-off-white">500+ Programs</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-light-gray">Verified Daily</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
