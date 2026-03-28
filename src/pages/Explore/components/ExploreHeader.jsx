import React from 'react';
import { GraduationCap, HandCoins, MapPin, RotateCcw } from 'lucide-react';
import useFilterStore from '../../../stores/filterStore';
import {
  EDUCATION_LEVEL_OPTIONS,
  FUNDING_TYPE_OPTIONS,
  TYPE_OPTIONS,
} from '../../../utils/exploreFilters';

const ExploreHeader = () => {
  const { searchQuery, setSearchQuery, filters, setFilter, clearFilters } = useFilterStore();

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    filters.type ||
    filters.location?.trim() ||
    filters.educationLevel ||
    filters.fundingType
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchQuery.trim());
  };

  return (
    <section className="bg-zinc-100 dark:bg-zinc-800/30 py-16 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col gap-4 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Explore Opportunities</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Discover the perfect scholarship, internship, fellowship, or event to accelerate your career journey.</p>
        </div>

        <form onSubmit={handleSearch} className="relative group mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-zinc-400 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input
            type="text"
            placeholder="Search by title, organization, or keyword..."
            className="w-full pl-12 pr-24 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg focus:ring-2 focus:ring-primary text-lg text-zinc-900 dark:text-white dark:placeholder:text-zinc-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 inset-y-0 flex items-center py-3">
            <button type="submit" className="h-full px-8 bg-primary text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90 shadow-md shadow-primary/20">
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {TYPE_OPTIONS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setFilter('type', cat.value)}
              className={`px-6 py-2.5 font-bold rounded-full text-sm shadow-sm transition-all ${
                filters.type === cat.value
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm p-5 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <label className="flex flex-col gap-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Location</span>
              <div className="relative">
                <MapPin className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilter('location', e.target.value)}
                  placeholder="Remote, London, Nairobi..."
                  className="w-full h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Education</span>
              <div className="relative">
                <GraduationCap className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <select
                  value={filters.educationLevel || ''}
                  onChange={(e) => setFilter('educationLevel', e.target.value)}
                  className="w-full h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  {EDUCATION_LEVEL_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value || ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Funding</span>
              <div className="relative">
                <HandCoins className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <select
                  value={filters.fundingType || ''}
                  onChange={(e) => setFilter('fundingType', e.target.value)}
                  className="w-full h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-10 pr-4 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  {FUNDING_TYPE_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value || ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <div className="flex flex-col gap-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Actions</span>
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-4" />
                Reset Filters
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Filters update automatically as you search and refine the list.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreHeader;
