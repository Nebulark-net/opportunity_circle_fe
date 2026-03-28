import React from 'react';
import useFilterStore from '../../../stores/filterStore';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
    const navigate = useNavigate();
    const { searchQuery, setSearchQuery } = useFilterStore();

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        navigate(trimmedQuery ? `/explore?search=${encodeURIComponent(trimmedQuery)}` : '/explore');
    };

    return (
        <section className="bg-zinc-100 dark:bg-zinc-900/30 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col gap-4 text-center mb-8">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Ready to find your next milestone?</h3>
                </div>
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-accent-muted group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input 
                        className="w-full pl-12 pr-4 py-5 bg-white dark:bg-zinc-900 border-none rounded-2xl shadow-lg focus:ring-2 focus:ring-primary text-lg text-zinc-900 dark:text-white dark:placeholder:text-accent-muted/50 transition-all" 
                        placeholder="Search for scholarships, internships, or fellowships..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-3 inset-y-0 flex items-center py-3">
                        <button type="submit" className="h-full px-6 bg-primary text-white font-bold rounded-xl text-sm transition-opacity hover:opacity-90">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SearchSection;
