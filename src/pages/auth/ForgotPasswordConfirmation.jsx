import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';

const ForgotPasswordConfirmation = () => {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-border-dark text-center">
      <div className="flex justify-center">
        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary">mark_email_read</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Check your email
        </h2>
        <p className="text-sm text-slate-600 dark:text-accent-muted">
          We've sent a password reset link to your email address. Please follow the instructions to reset your password.
        </p>
      </div>

      <div className="pt-4">
        <Link to="/login">
          <Button variant="primary" className="w-full font-bold">
            Return to Login
          </Button>
        </Link>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Didn't receive the email? Check your spam folder or{' '}
        <Link to="/forgot-password" name="resend" className="text-primary font-bold hover:underline">
          try again
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordConfirmation;
