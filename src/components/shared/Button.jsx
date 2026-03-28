import React from 'react';

const Button = ({ children, variant = 'primary', className = '', isLoading, ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-button px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-primary text-white shadow-hfas-teal hover:bg-primary/90',
    secondary: 'border border-border-dark bg-surface-dark text-off-white hover:border-primary/35 hover:text-primary hover:bg-surface-dark-border/40',
    ghost: 'bg-transparent text-light-gray hover:bg-surface-dark-border/40 hover:text-off-white',
    outline: 'border border-primary/35 text-primary hover:bg-primary/10',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
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
