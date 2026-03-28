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
        <section className="border-y border-border-dark/60 bg-surface_container_low/80 py-12 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col gap-4 text-center mb-8">
                    <h3 className="text-2xl font-black text-off-white">Ready to find your next milestone?</h3>
                    <p className="text-sm text-accent-muted">Search the feed by keyword and jump straight into the obsidian explore view.</p>
                </div>
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-accent-muted group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input 
                        className="w-full rounded-2xl border border-border-dark bg-surface_container_high/80 py-5 pl-12 pr-32 text-lg text-off-white shadow-hfas-sm outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/35 placeholder:text-accent-muted/55" 
                        placeholder="Search for scholarships, internships, or fellowships..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-3 inset-y-0 flex items-center py-3">
                        <button type="submit" className="h-full rounded-xl bg-primary px-6 text-sm font-black uppercase tracking-[0.16em] text-white shadow-hfas-teal transition-opacity hover:opacity-90">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SearchSection;
