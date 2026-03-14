import React from 'react';
import PublisherHero from './sections/PublisherHero';
import FeatureGrid from './sections/FeatureGrid';
import PublisherStats from './sections/PublisherStats';

const PublisherPage = () => {
  return (
    <main className="flex-1">
      <PublisherHero />
      <PublisherStats />
      <FeatureGrid />
    </main>
  );
};

export default PublisherPage;
