import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';

export const useModerate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/opportunities/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Opportunity ${variables.status} successfully!`);
      queryClient.invalidateQueries(['moderation-queue']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Moderation action failed');
    },
  });
};
