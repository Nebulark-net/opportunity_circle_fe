import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successful! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const requirements = [
    { label: 'At least 8 characters long', met: passwordValue.length >= 8 },
    { label: 'One uppercase & one lowercase letter', met: /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue) },
    { label: 'One number or symbol', met: /[0-9]/.test(passwordValue) || /[^a-zA-Z0-9]/.test(passwordValue) },
  ];

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-red-500 text-2xl font-bold mb-4">Invalid Token</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The password reset link is invalid or has expired.</p>
        <Link to="/forgot-password" title="Request new link" className="text-primary font-bold hover:underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mb-2 font-display">Reset Password</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Please enter your new password below to secure your account and regain access.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold" htmlFor="password">New Password</label>
          <div className="relative group">
            <input 
              {...register('password')}
              className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800/50 py-3 px-4 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
              id="password" 
              placeholder="Min. 8 characters" 
              type={showPassword ? "text" : "password"}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold" htmlFor="confirmPassword">Confirm New Password</label>
          <div className="relative group">
            <input 
              {...register('confirmPassword')}
              className={`w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800/50 py-3 px-4 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
              id="confirmPassword" 
              placeholder="Re-enter password" 
              type={showConfirmPassword ? "text" : "password"}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            Password requirements:
          </p>
          <ul className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[14px] ${req.met ? 'text-green-500' : 'text-slate-400'}`}>
                  {req.met ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                {req.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <button 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50" 
            type="submit"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-slate-500 dark:text-slate-400 text-sm hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2 group">
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
