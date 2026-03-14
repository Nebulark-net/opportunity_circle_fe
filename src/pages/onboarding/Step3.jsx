import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import api from '../../lib/api';

const Step3 = () => {
  const navigate = useNavigate();
  const { data, setStep, resetOnboarding, syncStep } = useOnboardingStore();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      targetLocations: data.targetLocations || '',
      employeeType: data.employeeType || 'Full-time',
    }
  });

  const onSubmit = async (formData) => {
    try {
      const stepData = {
        preferences: {
          targetLocations: formData.targetLocations.split(',').map(l => l.trim()).filter(l => l),
          employeeType: formData.employeeType,
        }
      };

      await syncStep(3, stepData);
      
      // Final call to mark completion (step 4)
      const response = await api.post('/seekers/onboarding/step', { step: 4, data: {} });
      
      if (response.data.success) {
        updateProfile(response.data.data.user);
        resetOnboarding();
        toast.success('Onboarding complete! Welcome to Opportunity Circle.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding Error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Final Preferences
        </h1>
        <p className="text-base font-normal leading-relaxed text-slate-600 dark:text-primary/70">
          Almost there! Let us know your preferred locations and job types.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Target Locations"
          type="text"
          placeholder="e.g. San Francisco, Remote, London"
          helperText="Separate multiple locations with commas"
          error={errors.targetLocations?.message}
          {...register('targetLocations', { required: 'Preferred locations are required' })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal">
            Employment Type
          </label>
          <select
            {...register('employeeType', { required: 'Employment type is required' })}
            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-primary/30 bg-white dark:bg-[#112221] focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-colors appearance-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#102220] text-base font-bold h-12 rounded-lg px-6 transition-colors shadow-sm"
          >
            Get Started
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </Button>
          <button 
            type="button"
            onClick={() => setStep(2)}
            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
