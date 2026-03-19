import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onboardingService } from '../services/onboarding.service';

export const useOnboardingStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      data: {
        interests: [],
        preferences: {},
        fullName: '',
        country: '',
        education: '',
      },

      setStep: (step) => set({ currentStep: step }),
      
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData },
      })),

      syncStep1: async (formData) => {
        try {
          await onboardingService.saveProfile(formData);
          set({ currentStep: 2 });
        } catch (error) {
          console.error('Step 1 sync failed:', error);
          throw error;
        }
      },

      syncStep2: async (interests) => {
        try {
          await onboardingService.saveStep({ interests });
          set({ currentStep: 3 });
        } catch (error) {
          console.error('Step 2 sync failed:', error);
          throw error;
        }
      },

      syncStep3: async (preferences) => {
        try {
          await onboardingService.completeOnboarding({ preferences });
          // Note: The UI might need a bit more here to mark it as done locally
          set({ currentStep: 4 }); // Use 4 to mean "onboarding complete"
        } catch (error) {
          console.error('Step 3 sync failed:', error);
          throw error;
        }
      },

      resetOnboarding: () => set({
        currentStep: 1,
        data: {
          interests: [],
          preferences: {},
          fullName: '',
          country: '',
          education: '',
        },
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
