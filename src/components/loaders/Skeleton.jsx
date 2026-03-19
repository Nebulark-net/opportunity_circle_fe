import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-dark/80 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
