import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import api from '../../lib/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const pendingRole = searchParams.get('pendingRole') === 'true';

      if (token && refreshToken) {
        try {
          // Set tokens first to authorize subsequent requests
          setTokens(token, refreshToken);

          // Fetch user profile to hydrate store
          const response = await api.get('/auth/me');
          const user = response.data.data.user;

          login(user, token, refreshToken);
          
          toast.success('Successfully logged in!');
          
          if (pendingRole) {
            navigate('/oauth-role-selection');
          } else if (user.role === 'SEEKER' && !user.onboardingCompleted) {
            navigate('/onboarding');
          } else if (user.role === 'PUBLISHER') {
            navigate('/publisher/dashboard');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('OAuth profile fetch failed:', error);
          toast.error('Failed to complete login. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('Authentication failed. No tokens received.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setTokens, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-slate-600 dark:text-accent-muted font-medium">Completing authentication...</p>
    </div>
  );
};

export default OAuthCallback;
