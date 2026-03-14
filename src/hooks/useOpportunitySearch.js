import { useState, useMemo } from 'react';

const useOpportunitySearch = (opportunities) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery.trim()) return opportunities;

    const query = searchQuery.toLowerCase();
    return opportunities.filter((opp) => {
      const title = (opp.title.en || opp.title || '').toLowerCase();
      const org = (opp.organizationName || '').toLowerCase();
      const loc = (opp.location || '').toLowerCase();
      const desc = (opp.description.en || opp.description || '').toLowerCase();
      
      return (
        title.includes(query) ||
        org.includes(query) ||
        loc.includes(query) ||
        desc.includes(query)
      );
    });
  }, [opportunities, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredOpportunities,
  };
};

export default useOpportunitySearch;
