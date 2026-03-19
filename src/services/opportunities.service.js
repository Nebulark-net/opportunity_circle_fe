import api from '../lib/api';

export const opportunitiesService = {
  getOne: async (id) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  toggleSave: async (id) => {
    const response = await api.post('/seekers/toggle-save', { itemId: id, itemType: 'OPPORTUNITY' });
    return response.data;
  },
};

export default opportunitiesService;
