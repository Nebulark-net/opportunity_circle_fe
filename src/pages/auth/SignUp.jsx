import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol'),
  role: z.enum(['SEEKER', 'PUBLISHER'], { required_error: 'Please select a role' }),
});

const SignUp = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'SEEKER',
    },
  });

  const role = watch('role');

  const handleOAuthRedirect = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}?role=${role}`;
  };

  const onSubmit = async (data) => {
    try {
      const response = await authService.register(data);
      const { user, accessToken, refreshToken } = response.data;
      
      login(user, accessToken, refreshToken);
      toast.success('Registration successful!');

      if (user.role === 'SEEKER') {
        navigate('/onboarding');
      } else {
        navigate('/publisher/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Create Account</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Join thousands of professionals finding their next big move.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Social Sign Up */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleOAuthRedirect('google')}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold"
          >
            <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQTAg6rsUDzi3tc07wJH4HDbYLXQAt4V8yy-FbedAJvUhrZqery2C_OIVWmfmXv6t7fXUxBk23FawycHnDlZzHLeBubLwl2T0qTDBSZl8fJIhevvjZi7u4bs8JqotXNN5FbIIeygFy6lEOJjQsbhOAmBJlAtZDQd1dR3CmKNueaHxe0QkQ4GslTZ0T7UsBN3iNLTmOdyCVVrNmkCD25omrbL8oXxBcft1tUN71NpvVtFdx7lq9bwCp6JOjnvuCzMD2dWhhXM5zhGE" />
            <span>Google</span>
          </button>
          <button 
            type="button"
            onClick={() => handleOAuthRedirect('github')}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-3 px-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold"
          >
            <img alt="GitHub" className="w-5 h-5 dark:invert" src="https://www.svgrepo.com/show/512317/github-142.svg" />
            <span>GitHub</span>
          </button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">or use email</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">I am a...</label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input type="radio" value="SEEKER" className="sr-only peer" {...register('role')} />
              <div className="p-3 text-center border rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-all dark:border-slate-700 dark:text-slate-300">
                Seeker
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" value="PUBLISHER" className="sr-only peer" {...register('role')} />
              <div className="p-3 text-center border rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-all dark:border-slate-700 dark:text-slate-300">
                Publisher
              </div>
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1 ml-1">{errors.role.message}</p>}
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
            <input 
              {...register('fullName')}
              className={`w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/50 py-3.5 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
              placeholder="Jane Doe" 
              type="text"
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
            <input 
              {...register('email')}
              className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/50 py-3.5 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
              placeholder="jane@example.com" 
              type="email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
            <input 
              {...register('password')}
              className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/50 py-3.5 pl-12 pr-12 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none`}
              placeholder="••••••••" 
              type={showPassword ? "text" : "password"}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.password ? (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 ml-1">Must be at least 8 characters with a number and symbol.</p>
          )}
        </div>

        {/* Primary Call to Action */}
        <button 
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:pointer-events-none" 
          type="submit"
        >
          {isSubmitting ? 'Creating account...' : 'Create Free Account'}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Already have an account? 
          <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
