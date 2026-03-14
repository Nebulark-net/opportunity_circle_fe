import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useOnboardingStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      data: {
        interests: [],
        preferences: {},
        bio: '',
        location: '',
      },

      setStep: (step) => set({ currentStep: step }),
      
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData },
      })),

      syncStep: async (step, stepData) => {
        try {
          await api.post('/seekers/onboarding/step', { step: step + 1, data: stepData });
          set({ currentStep: step + 1 });
        } catch (error) {
          console.error('Failed to sync onboarding step:', error);
          throw error;
        }
      },

      resetOnboarding: () => set({
        currentStep: 1,
        data: {
          interests: [],
          preferences: {},
          bio: '',
          location: '',
        },
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
