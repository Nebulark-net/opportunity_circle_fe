import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';

export const useUpdateApplicant = (opportunityId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicantId, status }) => {
      const response = await api.patch(`/publisher/opportunities/${opportunityId}/applicants/${applicantId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Applicant status updated!');
      queryClient.invalidateQueries(['applicants', opportunityId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
