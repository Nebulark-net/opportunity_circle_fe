import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFilterStore from '../../stores/filterStore';
import { useOpportunities } from '../../hooks/useOpportunities';
import ExploreHeader from './components/ExploreHeader';
import OpportunityGrid from './components/OpportunityGrid';
import { CardGridSkeleton } from '../../components/loaders/CardSkeleton';
import EmptyState from '../../components/feedback/EmptyState';
import MaxContainer from '../../components/layout/MaxContainer';
import { buildExploreSearchParams, parseExploreSearchParams } from '../../utils/exploreFilters';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, filters, page, setPage, clearFilters, syncFromQuery } = useFilterStore();
  const searchParamString = searchParams.toString();
  const isApplyingUrlState = useRef(true);
  
  const { data, isLoading, error } = useOpportunities({
    search: searchQuery,
    type: filters.type,
    location: filters.location,
    educationLevel: filters.educationLevel,
    fundingType: filters.fundingType,
    page,
    limit: 12,
  });

  const opportunities = data?.data?.opportunities || [];
  const totalPages = data?.data?.totalPages || 0;

  useEffect(() => {
    isApplyingUrlState.current = true;
    syncFromQuery(parseExploreSearchParams(new URLSearchParams(searchParamString)));
  }, [searchParamString, syncFromQuery]);

  useEffect(() => {
    if (isApplyingUrlState.current) {
      isApplyingUrlState.current = false;
      return;
    }

    const nextParams = buildExploreSearchParams({ searchQuery, filters, page });
    const nextQueryString = nextParams.toString();

    if (nextQueryString !== searchParamString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, page, searchParamString, searchQuery, setSearchParams]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 min-h-screen flex flex-col">
      <ExploreHeader />
      
      <MaxContainer as="main" className="py-8 flex-1">
        {isLoading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-20 text-red-500">
             Failed to load opportunities. Please try again later.
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState 
            title="No opportunities found"
            description="We couldn't find any opportunities matching your current filters. Try adjusting your search or resetting all filters."
            actionLabel="Reset All Filters"
            onAction={clearFilters} 
          />
        ) : (
          <OpportunityGrid 
            opportunities={opportunities} 
            totalPages={totalPages} 
            currentPage={page} 
            onPageChange={setPage}
          />
        )}
      </MaxContainer>
    </div>
  );
};

export default ExplorePage;
