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
        <div className="w-full bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black mb-2 dark:text-white">Welcome back</h1>
                <p className="text-slate-500 dark:text-primary/70">Enter your details to access your account</p>
            </div>
            
            <div className="space-y-4 mb-6">
                <button
                    onClick={() => handleOAuthLogin('google')}
                    className="flex w-full items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                    type="button"
                >
                    <img
                        alt="Google Logo"
                        className="w-5 h-5"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQG_Keo_I5U79o94c9lC4O_iZOjTJGKr7sJnpWlICfQXQPl1cDyWrcJFNb2lmmPZv-YNflE-rH1x6RJcyMDkCIiTf8VG2D593e0e5JOGmepPOYV_rgZfQi9gpbGIWGf_7b9zaP2NPmagZL7ASfNhfc5VXcBGPD_Pw_VEq1ue_G6NQxIOx6XNoqjQQQ5Pn-iZUCSg5nkRw_eGCyPEKY379yC_2QCZPq8xtKs2x5OOnW316XJQtOnijpx2ole5jCq9tZI7RQv5uKnH4"
                    />
                    Continue with Google
                </button>
                <button
                    onClick={() => handleOAuthLogin('github')}
                    className="flex w-full items-center justify-center gap-3 bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all font-medium text-white dark:text-slate-200 shadow-sm"
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
                    <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-background-dark px-4 text-slate-500 font-semibold tracking-widest">Or continue with email</span>
                </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                            mail
                        </span>
                        <input
                            className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="name@company.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <Link className="text-xs font-semibold text-primary hover:underline" to="/forgot-password">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                            lock
                        </span>
                        <input
                            className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
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
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/50 bg-slate-50 dark:bg-slate-800/50"
                        id="remember"
                        type="checkbox"
                    />
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400" htmlFor="remember">
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
            <div className="text-center pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    New to Opportunity Circle?
                    <Link className="text-primary font-bold hover:underline ml-1" to="/register">
                        Create an account
                    </Link>
                </p>
                <div className="flex justify-center gap-4 mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
