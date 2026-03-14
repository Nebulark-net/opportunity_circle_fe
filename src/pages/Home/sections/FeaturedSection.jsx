import React from 'react';
import { useOpportunities } from '../../../hooks/useOpportunities';
import OpportunityCard from '../../../components/cards/OpportunityCard';
import MaxContainer from '../../../components/layout/MaxContainer';
import { CardGridSkeleton } from '../../../components/loaders/CardSkeleton';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedSection = () => {
  const { data, isLoading } = useOpportunities({ limit: 4 });
  const opportunities = data?.data?.opportunities || [];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <MaxContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Featured Opportunities</h2>
            <p className="text-slate-500 max-w-lg text-sm font-medium">Hand-picked programs from top organizations around the world.</p>
          </div>
          <Link to="/explore" className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all group">
            <span>View All Opportunities</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id || opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </MaxContainer>
    </section>
  );
};

export default FeaturedSection;
