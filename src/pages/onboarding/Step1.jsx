import React from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

import { toast } from 'sonner';

const Step1 = () => {
  const { data, updateData, syncStep } = useOnboardingStore();
  const { user } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: data.fullName || user?.fullName || '',
      country: data.country || user?.country || '',
      education: data.education || user?.education || '',
    }
  });

  const onSubmit = async (formData) => {
    try {
      await syncStep(1, formData);
      updateData(formData);
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Welcome & Basic Info
        </h1>
        <p className="text-base font-normal leading-relaxed text-slate-600 dark:text-primary/70">
          Let's get started by setting up your profile. This helps us find the best opportunities for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Jane Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal">
            Country
          </label>
          <select
            {...register('country', { required: 'Country is required' })}
            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-primary/30 bg-white dark:bg-[#112221] focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-colors appearance-none"
          >
            <option value="" disabled>Select your country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
        </div>

        <Input
          label="Current Institution"
          type="text"
          placeholder="e.g. Stanford University"
          error={errors.education?.message}
          {...register('education', { required: 'Institution is required' })}
        />

        <div className="pt-4">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#102220] text-base font-bold h-12 rounded-lg px-6 transition-colors shadow-sm"
          >
            Continue
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
