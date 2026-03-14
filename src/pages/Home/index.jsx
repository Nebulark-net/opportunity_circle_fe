import React from 'react';
import Hero from './sections/Hero';
import ValueProps from './sections/ValueProps';
import HomeCTA from './sections/HomeCTA';
import FeaturedSection from './sections/FeaturedSection';

const HomePage = () => {
  return (
    <main className="flex-1 bg-background-light dark:bg-background-dark">
      <Hero />
      <FeaturedSection />
      <ValueProps />
      <HomeCTA />
    </main>
  );
};

export default HomePage;
