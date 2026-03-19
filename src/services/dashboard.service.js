import api from '../lib/api';

export const dashboardService = {
  getOpportunities: async (params = {}) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  getOpportunityById: async (id) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/seekers/applications');
    return response.data;
  },

  applyToOpportunity: async (opportunityId, applicationData) => {
    const response = await api.post(`/seekers/opportunities/${opportunityId}/apply`, applicationData);
    return response.data;
  },

  withdrawApplication: async (applicationId) => {
    const response = await api.post(`/seekers/applications/${applicationId}/withdraw`);
    return response.data;
  },
};

export default dashboardService;
