import React from 'react';
import Hero from './sections/Hero';
import SearchSection from './sections/SearchSection';
import FeaturedSection from './sections/FeaturedSection';
import HomeCTA from './sections/HomeCTA';
import ValueProps from './sections/ValueProps';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

const HomePage = () => {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 font-display text-zinc-900 dark:text-zinc-100 antialiased">
        
        <main className="flex-1">
            <Hero />
            <SearchSection />
            <FeaturedSection />
            <ValueProps />
            <HomeCTA />
        </main>
        
    </div>
  );
};

export default HomePage;
