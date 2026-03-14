import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeCTA = () => {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-primary/10 to-accent-teal/10 rounded-3xl p-8 md:p-12 border border-primary/10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to find your next milestone?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of students and professionals finding their dream opportunities every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
              Start Searching
              <ArrowRight size={18} />
            </Link>
            <Link to="/publishers" className="w-full sm:w-auto px-6 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
              Are you a publisher?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
