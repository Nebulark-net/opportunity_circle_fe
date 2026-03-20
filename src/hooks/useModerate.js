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
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['moderation-queue'] });
      const previousQueue = queryClient.getQueryData(['moderation-queue']);

      queryClient.setQueryData(['moderation-queue'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            opportunities: old.data.opportunities.filter(opp => opp._id !== id)
          }
        };
      });

      return { previousQueue };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['moderation-queue'], context.previousQueue);
      toast.error(error.response?.data?.message || 'Moderation action failed. Asset stream preserved.');
    },
    onSuccess: (_, variables) => {
      toast.success(`Opportunity ${variables.status === 'ACTIVE' ? 'authorized' : 'rejected'} successfully!`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};
