import api from '../lib/api';

export const userService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/seekers/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.patch('/seekers/profile', profileData);
    return response.data;
  },

  updatePreferences: async (preferencesData) => {
    const response = await api.patch('/seekers/preferences', preferencesData);
    return response.data;
  },

  // Saved Items
  getSavedItems: async (itemType) => {
    const response = await api.get('/seekers/saved-items', { params: { itemType } });
    return response.data;
  },

  toggleSaveItem: async (itemId, itemType) => {
    const response = await api.post('/seekers/toggle-save', { itemId, itemType });
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },
  // Resources
  getAllResources: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },
};

export default userService;
