import React from 'react';
import useFilterStore from '../../../stores/filterStore';
import LiveSearch from '../../../components/Search/LiveSearch';

const ExploreHeader = () => {
  const { searchQuery, setSearchQuery, filters, setFilter } = useFilterStore();

  const categories = [
    { label: 'All', value: null },
    { label: 'Scholarships', value: 'SCHOLARSHIP' },
    { label: 'Internships', value: 'INTERNSHIP' },
    { label: 'Fellowships', value: 'FELLOWSHIP' },
    { label: 'Events', value: 'EVENT' },
    { label: 'Workshops', value: 'WORKSHOP' },
  ];

  return (
    <section className="bg-zinc-100 dark:bg-zinc-800/30 py-16 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col gap-4 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Explore Opportunities</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Discover the perfect scholarship, internship, fellowship, or event to accelerate your career journey.</p>
        </div>

        <div className="relative group mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-zinc-400 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input 
            type="text"
            placeholder="Search for opportunities..." 
            className="w-full pl-12 pr-24 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg focus:ring-2 focus:ring-primary text-lg text-zinc-900 dark:text-white dark:placeholder:text-zinc-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 inset-y-0 flex items-center py-3">
            <button className="h-full px-8 bg-primary text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90 shadow-md shadow-primary/20">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
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
      </div>
    </section>
  );
};

export default ExploreHeader;
