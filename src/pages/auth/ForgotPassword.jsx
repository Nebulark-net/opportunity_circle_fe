import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import api from '../../lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', data);
      toast.success('Reset link sent to your email');
      navigate('/forgot-password/confirmation');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-border-dark">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-accent-muted">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          className="w-full py-3 text-lg font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-bold text-primary hover:underline transition-all"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
