import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8">About Opportunity Circle</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-accent-muted">
        <p className="text-lg">
          Opportunity Circle is a premier platform dedicated to bridging the gap between ambitious talent and world-class opportunities.
        </p>
        <p>
          Founded in 2024, our mission is to ensure that the best career paths—including scholarships, internships, and fellowships—are accessible to everyone, regardless of their location or background.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white pt-4">Our Vision</h2>
        <p>
          We envision a world where every student and early-career professional has the tools and information they need to unlock their full potential and fuel their career journey.
        </p>
      </div>
    </div>
  );
};

export default About;
