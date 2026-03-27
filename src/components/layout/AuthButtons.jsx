import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const AuthButtons = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          to="/dashboard" 
          className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
        >
          {user?.fullName?.split(' ')[0]}
        </Link>
        <button 
          onClick={logout}
          className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link 
        to="/login" 
        className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        Sign In
      </Link>
      <Link 
        to="/register" 
        className="btn-primary text-sm py-1.5 px-4 shadow-sm active:scale-95 transition-all"
      >
        Get Started
      </Link>
    </div>
  );
};

export default AuthButtons;
