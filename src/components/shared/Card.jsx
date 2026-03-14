import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-card p-6 shadow-sm ${
        hoverEffect ? 'hover:translate-y-[-2px] hover:shadow-md' : ''
      } transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
