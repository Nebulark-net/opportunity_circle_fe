import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-light-gray">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-button border ${
          error ? 'border-red-500' : 'border-border-dark'
        } bg-surface-dark px-4 py-3 text-sm text-off-white outline-none placeholder:text-light-gray/55 focus:border-primary/60 focus:ring-2 focus:ring-primary/35 transition-all`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
