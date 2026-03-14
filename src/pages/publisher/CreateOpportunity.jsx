import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Card from '../../components/shared/Card';
import api from '../../lib/api';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'internship', 'volunteer', 'contract']),
  category: z.string().min(2, 'Category is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  salaryRange: z.string().optional(),
});

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: JSON.parse(localStorage.getItem('opportunity_draft') || '{}'),
  });

  const formData = watch();

  useEffect(() => {
    localStorage.setItem('opportunity_draft', JSON.stringify(formData));
  }, [formData]);

  const mutation = useMutation({
    mutationFn: (data) => api.post('/publisher/opportunities', data),
    onSuccess: () => {
      toast.success('Opportunity submitted for moderation!');
      localStorage.removeItem('opportunity_draft');
      navigate('/publisher/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create opportunity');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Post New Opportunity</h1>
        <p className="text-slate-500">Reach thousands of talented individuals looking for their next milestone.</p>
      </div>

      <Card hoverEffect={false}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Opportunity Title"
              placeholder="e.g. Senior Frontend Engineer"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Company/Organization"
              placeholder="e.g. Acme Corp"
              error={errors.company?.message}
              {...register('company')}
            />
            <Input
              label="Location"
              placeholder="e.g. London, UK or Remote"
              error={errors.location?.message}
              {...register('location')}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                {...register('type')}
                className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-button px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <Input
              label="Category"
              placeholder="e.g. Software Engineering"
              error={errors.category?.message}
              {...register('category')}
            />
            <Input
              label="Application Deadline"
              type="date"
              error={errors.deadline?.message}
              {...register('deadline')}
            />
            <Input
              label="Salary/Stipend Range (Optional)"
              placeholder="e.g. $50k - $80k"
              error={errors.salaryRange?.message}
              {...register('salaryRange')}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description & Requirements
            </label>
            <textarea
              {...register('description')}
              className={`w-full min-h-[250px] bg-slate-50 dark:bg-surface-dark border ${
                errors.description ? 'border-red-500' : 'border-slate-200 dark:border-border-dark'
              } rounded-button px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-white`}
              placeholder="Describe the role, responsibilities, and qualifications..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="px-10 py-3" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Posting...' : 'Post Opportunity'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateOpportunity;
