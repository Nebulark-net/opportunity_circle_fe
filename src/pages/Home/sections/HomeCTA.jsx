import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeCTA = () => {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="rounded-[28px] border border-primary/15 p-8 md:p-12 bg-[linear-gradient(135deg,rgba(19,164,236,0.18),rgba(29,78,216,0.12))] shadow-hfas-lg">
          <h2 className="mb-6 text-3xl font-bold text-off-white md:text-4xl">
            Ready to find your next milestone?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-accent-muted">
            Join thousands of students and professionals finding their dream opportunities every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="btn-primary w-full sm:w-auto">
              Start Searching
              <ArrowRight size={18} />
            </Link>
            <Link to="/publishers" className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-light-gray hover:text-primary transition-colors">
              Are you a publisher?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
