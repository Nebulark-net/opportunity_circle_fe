import { useEffect, useCallback } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Hook to prevent navigation when there are unsaved changes
 * @param {boolean} isDirty - Whether there are unsaved changes
 * @param {string} message - Optional confirmation message
 */
export const useUnsavedChanges = (isDirty, message = 'You have unsaved changes. Are you sure you want to leave?') => {
  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);

  // Handle in-app navigation (React Router)
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty && currentLocation.pathname !== nextLocation.pathname,
      [isDirty]
    )
  );

  return blocker;
};

export default useUnsavedChanges;
