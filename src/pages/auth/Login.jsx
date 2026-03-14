import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data.data;
      login(user, accessToken, refreshToken);
      toast.success('Welcome back!');
      
      if (user.role === 'SEEKER' && !user.onboardingCompleted) {
        navigate('/onboarding');
      } else if (user.role === 'PUBLISHER') {
        navigate('/publisher/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        
        <div className="flex justify-end">
          <Link to="/forgot-password" title="Reset your password" className="text-xs text-primary font-bold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-border-dark"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-surface-dark px-2 text-slate-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          Google
        </Button>
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
        >
          <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-4 h-4 dark:invert" alt="GitHub" />
          GitHub
        </Button>
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
