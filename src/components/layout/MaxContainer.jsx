import React from 'react';

const MaxContainer = ({ children, className = '', as: Component = 'div' }) => {
  return (
    <Component className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}>
      {children}
    </Component>
  );
};

export default MaxContainer;
