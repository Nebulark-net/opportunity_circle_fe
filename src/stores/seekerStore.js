import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSeekerStore = create(
  persist(
    (set) => ({
      onboardingData: {
        step1: {},
        step2: { interestedTypes: [] },
        step3: { targetLocations: [], employeeType: '', notifications: { push: true, email: true, weekly: true } },
      },
      currentStep: 1,
      
      setStep1Data: (data) => 
        set((state) => ({ 
          onboardingData: { ...state.onboardingData, step1: { ...state.onboardingData.step1, ...data } } 
        })),
        
      setStep2Data: (data) => 
        set((state) => ({ 
          onboardingData: { ...state.onboardingData, step2: { ...state.onboardingData.step2, ...data } } 
        })),
        
      setStep3Data: (data) => 
        set((state) => ({ 
          onboardingData: { ...state.onboardingData, step3: { ...state.onboardingData.step3, ...data } } 
        })),
        
      setCurrentStep: (step) => set({ currentStep: step }),
      
      resetOnboarding: () => set({ 
        onboardingData: {
          step1: {},
          step2: { interestedTypes: [] },
          step3: { targetLocations: [], employeeType: '', notifications: { push: true, email: true, weekly: true } },
        },
        currentStep: 1 
      }),
    }),
    {
      name: 'seeker-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
