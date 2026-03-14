import React from 'react';
import { Filter, MapPin } from 'lucide-react';
import useFilterStore from '../../../stores/filterStore';
import MaxContainer from '../../../components/layout/MaxContainer';
import LiveSearch from '../../../components/Search/LiveSearch';

const ExploreHeader = () => {
  const { searchQuery, setSearchQuery, filters, setFilter, clearFilters } = useFilterStore();

  const categories = [
    { label: 'All', value: null },
    { label: 'Internships', value: 'INTERNSHIP' },
    { label: 'Scholarships', value: 'SCHOLARSHIP' },
    { label: 'Fellowships', value: 'FELLOWSHIP' },
    { label: 'Events', value: 'EVENT' },
    { label: 'Workshops', value: 'WORKSHOP' },
  ];

  return (
    <section className="bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark pt-8 pb-4">
      <MaxContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Opportunities</h1>
          <p className="text-slate-600 dark:text-slate-400">Find the perfect program to accelerate your growth.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Search and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LiveSearch 
              initialValue={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Search titles, skills, or companies..."
            />
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Location (e.g. Remote, USA)"
                className="w-full bg-slate-100 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 transition-all"
                value={filters.location || ''}
                onChange={(e) => setFilter('location', e.target.value || null)}
              />
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={clearFilters}
                className="text-sm font-medium text-slate-500 hover:text-primary transition-colors px-2"
               >
                 Reset Filters
               </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setFilter('type', cat.value)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filters.type === cat.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </MaxContainer>
    </section>
  );
};

export default ExploreHeader;
