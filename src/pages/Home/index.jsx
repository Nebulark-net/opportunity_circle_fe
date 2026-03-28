import React from 'react';
import Hero from './sections/Hero';
import SearchSection from './sections/SearchSection';
import FeaturedSection from './sections/FeaturedSection';
import HomeCTA from './sections/HomeCTA';
import ValueProps from './sections/ValueProps';

const HomePage = () => {
  return (
    <div className="bg-background-dark font-display text-off-white antialiased">
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
