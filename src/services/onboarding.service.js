import api from '../lib/api';

export const onboardingService = {
  // Step 1: Basic Profile Info
  saveProfile: async (profileData) => {
    const response = await api.patch('/seekers/profile', profileData);
    return response.data;
  },

  // Step 2 & 3: Interests and Preferences
  saveStep: async (data) => {
    const response = await api.post('/onboarding', data);
    return response.data;
  },

  // Finalize Onboarding
  completeOnboarding: async (data) => {
    const response = await api.post('/onboarding', { ...data, isCompleted: true });
    return response.data;
  },

  getData: async () => {
    const response = await api.get('/onboarding');
    return response.data;
  },
};

export default onboardingService;
