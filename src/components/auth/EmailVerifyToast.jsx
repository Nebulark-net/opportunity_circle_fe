import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../lib/api';

const EmailVerifyToast = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          await api.get(`/auth/verify-email?token=${token}`);
          toast.success('Email verified successfully! You can now log in.');
          navigate('/login', { replace: true });
        } catch (error) {
          toast.error(error.response?.data?.message || 'Email verification failed');
          navigate('/login', { replace: true });
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return null;
};

export default EmailVerifyToast;
