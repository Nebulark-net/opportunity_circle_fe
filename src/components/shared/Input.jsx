import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full bg-slate-50 dark:bg-surface-dark border ${
          error ? 'border-red-500' : 'border-slate-200 dark:border-border-dark'
        } rounded-button px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-white`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
