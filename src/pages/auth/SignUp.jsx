import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['SEEKER', 'PUBLISHER'], { required_error: 'Please select a role' }),
});

const SignUp = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
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
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data.data;
      
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
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
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            I am a...
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="SEEKER"
                className="sr-only peer"
                {...register('role')}
              />
              <div className="p-3 text-center border rounded-button peer-checked:border-primary peer-checked:bg-primary/10 transition-all dark:border-border-dark dark:text-slate-300">
                Seeker
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="PUBLISHER"
                className="sr-only peer"
                {...register('role')}
              />
              <div className="p-3 text-center border rounded-button peer-checked:border-primary peer-checked:bg-primary/10 transition-all dark:border-border-dark dark:text-slate-300">
                Publisher
              </div>
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
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
          onClick={() => handleOAuthRedirect('google')}
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          Google
        </Button>
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={() => handleOAuthRedirect('github')}
        >
          <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-4 h-4 dark:invert" alt="GitHub" />
          GitHub
        </Button>
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
