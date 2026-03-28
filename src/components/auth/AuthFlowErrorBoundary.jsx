import React from 'react';
import { Link } from 'react-router-dom';

class AuthFlowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth flow route crashed:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
              <span className="material-symbols-outlined">error</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Authentication Flow Failed</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              The current auth step could not be completed. Retry this step or return to login.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                onClick={this.handleRetry}
                type="button"
              >
                Retry
              </button>
              <Link
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                to="/login"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthFlowErrorBoundary;
