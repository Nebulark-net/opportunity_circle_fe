import { useState, useMemo } from 'react';

const useOpportunitySearch = (opportunities) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery) {
      return opportunities;
    }
    return (opportunities || []).filter(opp => 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [opportunities, searchQuery]);

  return { searchQuery, setSearchQuery, filteredOpportunities };
};

export default useOpportunitySearch;
