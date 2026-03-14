import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import api from '../../lib/api';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be expired.');
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full p-8 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-border-dark text-center">
        <h2 className="text-2xl font-bold text-red-500">Invalid Link</h2>
        <p className="mt-2 text-slate-600 dark:text-accent-muted">
          This password reset link is invalid or has expired.
        </p>
        <Button className="mt-6" onClick={() => navigate('/forgot-password')}>
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-border-dark">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-accent-muted">
          Enter your new password below.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-lg font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
