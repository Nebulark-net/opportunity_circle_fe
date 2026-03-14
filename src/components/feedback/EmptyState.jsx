import React from 'react';
import { SearchX } from 'lucide-react';
import Button from '../shared/Button';

const EmptyState = ({ 
  title = 'No results found', 
  description = 'Try adjusting your search or filters to find what you are looking for.',
  icon: Icon = SearchX,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
