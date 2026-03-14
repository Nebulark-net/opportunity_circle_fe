import React from 'react';
import { useForm } from 'react-hook-form';
import { useApply } from '../../hooks/useApply';
import Button from '../shared/Button';
import Input from '../shared/Input';

const ApplyForm = ({ opportunityId, requirements, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const applyMutation = useApply(opportunityId);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'resume' || key === 'coverLetterFile') {
        if (data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await applyMutation.mutateAsync(formData);
      onClose();
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          {...register('fullName', { required: 'Name is required' })}
          error={errors.fullName?.message}
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Why are you a good fit? (Cover Letter)
          </label>
          <textarea
            {...register('coverLetter', { required: 'Please provide a cover letter' })}
            className="w-full min-h-[150px] bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-button px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
          />
          {errors.coverLetter && <p className="text-red-500 text-xs mt-1">{errors.coverLetter.message}</p>}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            {...register('resume', { required: 'Resume is required' })}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          className="flex-1" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={applyMutation.isLoading}
        >
          {applyMutation.isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
};

export default ApplyForm;
