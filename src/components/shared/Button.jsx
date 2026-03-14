import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'font-semibold py-2 px-4 rounded-button transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
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
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
