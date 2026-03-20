import api from '../lib/api';

export const adminService = {
  /**
   * Get overarching platform statistics
   */
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  /**
   * Get all users in the platform with optional role filter, pagination and search
   */
  getUsers: async (role = 'ALL', page = 1, limit = 20, search = '') => {
    const response = await api.get(`/admin/users?role=${role}&page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },

  /**
   * Toggle user suspension status
   */
  toggleUserStatus: async (id) => {
    const response = await api.patch(`/admin/users/${id}/status`);
    return response.data;
  },

  /**
   * Verify/Trust a publisher
   */
  verifyPublisher: async (userId, status) => {
    const response = await api.patch(`/admin/publishers/${userId}/verify`, { status });
    return response.data;
  },

  /**
   * Get pending opportunities for moderation
   */
  getModerationQueue: async () => {
    const response = await api.get('/admin/moderation-queue');
    return response.data;
  },

  /**
   * Update opportunity status (Approve/Reject)
   */
  updateOpportunityStatus: async (id, status) => {
    const response = await api.patch(`/admin/opportunities/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update Admin's own profile
   */
  updateProfile: async (data) => {
    const response = await api.patch('/admin/profile', data);
    return response.data;
  },

  /**
   * Get exhaustive details for a specific user
   */
  getUserDetails: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * CMS: Get all platform pages
   */
  getCmsPages: async () => {
    const response = await api.get('/cms');
    return response.data;
  },

  /**
   * CMS: Update a specific page
   */
  updateCmsPage: async (pageKey, data) => {
    const response = await api.patch(`/cms/${pageKey}`, data);
    return response.data;
  },

  /**
   * Get admin's own profile
   */
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  /**
   * Mentors: Get all registered mentors
   */
  getMentors: async () => {
    const response = await api.get('/mentors');
    return response.data;
  },

  /**
   * Mentors: Create a new mentor profile
   */
  createMentor: async (data) => {
    const response = await api.post('/mentors', data);
    return response.data;
  },

  /**
   * Mentors: Toggle mentor active/locked status
   */
  toggleMentorStatus: async (id) => {
    const response = await api.patch(`/mentors/${id}/status`);
    return response.data;
  },

  /**
   * Mentors: Toggle mentor verification status
   */
  verifyMentor: async (id) => {
    const response = await api.patch(`/mentors/${id}/verify`);
    return response.data;
  }
};
