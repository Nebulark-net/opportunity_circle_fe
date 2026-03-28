import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full px-6 py-24">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">404</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you requested does not exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            to="/"
          >
            Return Home
          </Link>
          <Link
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            to="/help"
          >
            Open Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
