import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

// Simplified Opportunity Card for the landing page
const OpportunityCard = ({ title, company, image, location }) => (
  <div className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
      <div className="absolute top-3 right-3 z-10">
        <button className="h-9 w-9 rounded-full bg-white/90 dark:bg-zinc-950/90 flex items-center justify-center text-zinc-600 dark:text-zinc-100 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">bookmark</span>
        </button>
      </div>
      <div 
        className="w-full h-full bg-zinc-200 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
        aria-label={title}
      ></div>
    </div>
    <div className="p-5 flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors text-zinc-900 dark:text-white">{title}</h3>
        <p className="text-sm font-medium text-accent-muted mt-1">{company}</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-accent-muted bg-zinc-50 dark:bg-zinc-950/50 px-3 py-2 rounded-lg w-fit">
        <span className="material-symbols-outlined text-sm">location_on</span>
        {location}
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
    <div className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm animate-pulse">
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-zinc-200 dark:bg-zinc-700"></div>
        <div className="p-5 flex flex-col gap-4">
            <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
        </div>
    </div>
);


const FeaturedSection = () => {
    const { data: opportunities, isLoading, error } = useQuery({
        queryKey: ['featuredOpportunities'],
        queryFn: () => api.get('/opportunities?isFeatured=true&limit=4').then(res => res.data.data.opportunities)
    });

  const placeholderImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Featured Opportunities</h2>
          <p className="text-accent-muted font-medium">Hand-picked excellence for your career growth</p>
        </div>
        <Link className="flex items-center gap-2 text-primary font-bold hover:underline" to="/explore">
          View All
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : error ? (
            <div className="lg:col-span-4 text-center py-10 bg-red-500/10 rounded-xl">
                <p className="text-red-500 font-semibold">Failed to load featured opportunities.</p>
            </div>
        ) : (
          (opportunities || []).map((opp, index) => (
            <OpportunityCard
              key={opp._id}
              title={opp.title.en || opp.title}
              company={opp.organizationName || 'N/A'}
              location={opp.location || 'Remote'}
              image={opp.imageUrl || placeholderImages[index % placeholderImages.length]}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
