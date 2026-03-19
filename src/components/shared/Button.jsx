import React from 'react';

const Button = ({ children, variant = 'primary', className = '', isLoading, ...props }) => {
  const baseStyle = 'font-semibold py-2 px-4 rounded-button transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center';
  const variants = {
    primary: 'bg-primary text-white shadow-md hover:opacity-90',
    secondary: 'bg-surface-dark/10 dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-surface-dark/20 dark:hover:bg-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
