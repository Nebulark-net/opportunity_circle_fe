import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';

export const useApply = (opportunityId) => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(`/opportunities/${opportunityId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });
};
