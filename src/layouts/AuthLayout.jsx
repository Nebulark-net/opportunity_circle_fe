import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary tracking-tight">OPPORTUNITY CIRCLE</h1>
          <p className="text-muted-steel dark:text-slate-400 mt-2">Connecting Ambition to Opportunity</p>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-card shadow-xl p-8">
          <Outlet />
        </div>
      </div>
      <footer className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        &copy; 2026 Opportunity Circle. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
