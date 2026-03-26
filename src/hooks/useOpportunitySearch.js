import { useState, useMemo, useEffect } from 'react';

const useOpportunitySearch = (opportunities) => {
  const [localQuery, setLocalQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 500); // 500ms industrial standard delay

    return () => clearTimeout(timer);
  }, [localQuery]);

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery) {
      return opportunities;
    }
    const query = searchQuery.toLowerCase();
    return (opportunities || []).filter(opp => {
        const title = (typeof opp.title === 'object' ? opp.title.en : opp.title) || '';
        const org = opp.organizationName || opp.company || '';
        const desc = (typeof opp.description === 'object' ? opp.description.en : opp.description) || '';
        
        return title.toLowerCase().includes(query) ||
               org.toLowerCase().includes(query) ||
               desc.toLowerCase().includes(query);
    });
  }, [opportunities, searchQuery]);

  return { 
    searchQuery: localQuery, 
    setSearchQuery: setLocalQuery, 
    filteredOpportunities 
  };
};

export default useOpportunitySearch;
