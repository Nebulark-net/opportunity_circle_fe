import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login: setAuthData } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.login({ email, password });

            const { user, accessToken, refreshToken } = response.data;
            setAuthData(user, accessToken, refreshToken);

            toast.success('Successfully logged in!');

            if (user.role === 'ADMIN') {
                navigate('/admin/moderation');
            } else if (user.role === 'PUBLISHER') {
                navigate('/publisher/dashboard');
            } else if (!user.onboardingCompleted) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard/feed');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to login. Please check your credentials.';
            toast.error(message);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/${provider}`;
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900/50 p-8 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black mb-2 dark:text-white">Welcome back</h1>
                <p className="text-zinc-500 dark:text-primary/70">Enter your details to access your account</p>
            </div>
            
            <div className="space-y-4 mb-6">
                <button
                    onClick={() => handleOAuthLogin('google')}
                    className="flex w-full items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all font-medium text-zinc-700 dark:text-zinc-200 shadow-sm"
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Continue with Google
                </button>
                <button
                    onClick={() => handleOAuthLogin('github')}
                    className="flex w-full items-center justify-center gap-3 bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all font-medium text-white dark:text-zinc-200 shadow-sm"
                    type="button"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                    </svg>
                    Continue with GitHub
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-500 font-semibold tracking-widest">Or continue with email</span>
                </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">
                            mail
                        </span>
                        <input
                            className="w-full px-4 py-3 pl-12 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="name@company.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-slate-300">Password</label>
                        <Link className="text-xs font-semibold text-primary hover:underline" to="/forgot-password">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">
                            lock
                        </span>
                        <input
                            className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                    <input
                        className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-primary focus:ring-primary/50 bg-slate-50 dark:bg-zinc-800/50"
                        id="remember"
                        type="checkbox"
                    />
                    <label className="text-sm font-medium text-slate-600 dark:text-zinc-400" htmlFor="remember">
                        Remember me for 30 days
                    </label>
                </div>
                <button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2 disabled:opacity-50"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <div className="text-center pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-slate-600 dark:text-zinc-400">
                    New to Opportunity Circle?
                    <Link className="text-primary font-bold hover:underline ml-1" to="/register">
                        Create an account
                    </Link>
                </p>
                <div className="flex justify-center gap-4 mt-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
