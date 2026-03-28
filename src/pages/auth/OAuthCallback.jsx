import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';
import { getPostAuthRedirect } from '../../utils/authRouting';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const pendingRole = searchParams.get('pendingRole') === 'true';

      window.history.replaceState({}, document.title, window.location.pathname);

      if (token && refreshToken) {
        try {
          const user = await authService.getCurrentUser({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          login(user, token, refreshToken);
          
          toast.success('Successfully logged in!');

          const nextPath = pendingRole || !user?.role
            ? '/oauth-role-selection'
            : getPostAuthRedirect(user);

          navigate(nextPath, { replace: true });
        } catch (error) {
          console.error('OAuth profile fetch failed:', error);
          toast.error('Failed to complete login. Please try again.');
          navigate('/login', { replace: true });
        }
      } else {
        toast.error('Authentication failed. No tokens received.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-slate-600 dark:text-accent-muted font-medium">Completing authentication...</p>
    </div>
  );
};

export default OAuthCallback;
