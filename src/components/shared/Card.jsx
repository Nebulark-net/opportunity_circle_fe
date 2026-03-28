import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <div
      className={`rounded-card border border-border-dark bg-surface-dark p-6 text-off-white shadow-hfas-sm ${
        hoverEffect ? 'hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hfas-lg' : ''
      } transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
