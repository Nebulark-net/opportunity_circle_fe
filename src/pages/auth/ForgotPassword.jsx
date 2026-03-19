import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="w-full max-w-[480px] flex flex-col gap-8 bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
        <div className="mx-auto flex items-center justify-center size-16 bg-green-500/10 rounded-full mb-2">
          <span className="material-symbols-outlined text-green-500 text-4xl">mark_email_read</span>
        </div>
        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Check your email</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
          We've sent a password reset link to your email address. Please follow the instructions to reset your password.
        </p>
        <Link to="/login" className="inline-flex items-center justify-center gap-1.5 text-primary hover:text-primary/80 text-sm font-semibold transition-colors underline decoration-2 underline-offset-4">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] flex flex-col gap-8 bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto flex items-center justify-center size-16 bg-primary/10 rounded-full mb-2">
          <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
        </div>
        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Forgot Password</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
            </div>
            <input 
              {...register('email')}
              className={`form-input block w-full pl-11 pr-4 py-3.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base outline-none`}
              id="email" 
              placeholder="name@example.com" 
              type="email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <button 
          disabled={isSubmitting}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
          type="submit"
        >
          <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </form>

      <div className="text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-semibold transition-colors underline decoration-2 underline-offset-4">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
