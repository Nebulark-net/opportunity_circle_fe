import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';

const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'SEEKER';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login: setAuthData } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.register({ fullName, email, password, role });

            const { user, accessToken, refreshToken } = response.data;
            setAuthData(user, accessToken, refreshToken);

            toast.success('Account created successfully!');

            if (role === 'PUBLISHER') {
                navigate('/publisher/dashboard');
            } else {
                navigate('/onboarding');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create account. Please try again.';
            toast.error(message);
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/${provider}?role=${role}`;
    };

    return (
        <>
            {/* Fixed Background Decoration that escapes AuthLayout constraints */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-70">
                <div className="absolute top-[10%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-primary/10 blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-primary/5 blur-[100px]"></div>
            </div>

            {/* Main Container */}
            <div className="z-10 w-full relative">
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Create Account</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">Join thousands of professionals finding their next big move.</p>
                    </div>

                    {/* Role Selection Persona Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('SEEKER')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                role === 'SEEKER' 
                                    ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-200'
                            }`}
                        >
                            <div className={`size-12 rounded-full flex items-center justify-center ${role === 'SEEKER' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black uppercase tracking-tighter">Seeker</p>
                                <p className="text-[10px] font-bold opacity-70">Find Opportunities</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('PUBLISHER')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                role === 'PUBLISHER' 
                                    ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-200'
                            }`}
                        >
                            <div className={`size-12 rounded-full flex items-center justify-center ${role === 'PUBLISHER' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                                <span className="material-symbols-outlined">campaign</span>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black uppercase tracking-tighter">Publisher</p>
                                <p className="text-[10px] font-bold opacity-70">Post Opportunities</p>
                            </div>
                        </button>
                    </div>
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* OAuth Section */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-3 px-4 text-zinc-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all font-semibold shadow-sm"
                                type="button"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                    <path fill="none" d="M0 0h48v48H0z"/>
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                            <button
                                onClick={() => handleOAuthLogin('github')}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-800 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-800 py-3 px-4 text-white dark:text-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all font-semibold shadow-sm"
                                type="button"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                                </svg>
                                <span>Continue with GitHub</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 my-6">
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">or use email</span>
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-slate-300 ml-1">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">person</span>
                                <input
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 py-3.5 pl-12 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="Jane Doe"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">mail</span>
                                <input
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 py-3.5 pl-12 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="jane@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-slate-300 ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px]">lock</span>
                                <input
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 py-3.5 pl-12 pr-12 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 ml-1">Must be at least 8 characters with a number and symbol.</p>
                        </div>

                        {/* Call to Action */}
                        <button
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50"
                            type="submit"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Free Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Already have an account? 
                            <Link className="text-primary font-bold hover:underline transition-all ml-1" to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 mb-12 flex justify-center gap-6 text-xs font-semibold text-zinc-500 dark:text-zinc-500">
                    <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Help Center</Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
