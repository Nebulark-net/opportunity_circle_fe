import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';

const fetchOpportunities = async ({ queryKey }) => {
  const [_, { search, type, location, page, limit }] = queryKey;
  
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (location) params.append('location', location);
  params.append('page', page);
  params.append('limit', limit);

  const { data } = await api.get(`/opportunities?${params.toString()}`);
  return data; 
};

export const useOpportunities = ({ search, type, location, page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: ['opportunities', { search, type, location, page, limit }],
    queryFn: fetchOpportunities,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, 
  });
};
