import api from '../lib/api';

export const publisherService = {
  /**
   * Get dashboard statistics for the publisher
   */
  getStats: async () => {
    const response = await api.get('/publishers/dashboard/stats');
    return response.data;
  },

  /**
   * Get opportunities created by the publisher
   */
  getOpportunities: async (params = {}) => {
    const response = await api.get('/publishers/opportunities', { params });
    return response.data;
  },

  /**
   * Get all applicants across all opportunities for the publisher
   */
  getAllApplicants: async () => {
    const response = await api.get('/publishers/applicants');
    return response.data;
  },

  /**
   * Create a new opportunity
   */
  createOpportunity: async (opportunityData) => {
    const response = await api.post('/publishers/opportunities', opportunityData);
    return response.data;
  },

  /**
   * Update an existing opportunity
   */
  updateOpportunity: async (id, opportunityData) => {
    const response = await api.patch(`/publishers/opportunities/${id}`, opportunityData);
    return response.data;
  },

  /**
   * Delete an opportunity
   */
  deleteOpportunity: async (id) => {
    const response = await api.delete(`/publishers/opportunities/${id}`);
    return response.data;
  },

  /**
   * Get applications for a specific opportunity
   */
  getOpportunityApplications: async (opportunityId) => {
    const response = await api.get(`/publishers/opportunities/${opportunityId}/applications`);
    return response.data;
  },

  /**
   * Update the status of an application
   */
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    const response = await api.patch(`/publishers/applications/${applicationId}/status`, { status, notes });
    return response.data;
  },

  /**
   * Get publisher profile
   */
  getProfile: async () => {
    const response = await api.get('/publishers/profile');
    return response.data;
  },

  /**
   * Update publisher profile
   */
  updateProfile: async (profileData) => {
    const response = await api.patch('/publishers/profile', profileData);
    return response.data;
  },

  /**
   * Upload an opportunity image
   */
  uploadOpportunityImage: async (formData) => {
    const response = await api.post('/publishers/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default publisherService;
