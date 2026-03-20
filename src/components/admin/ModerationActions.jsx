import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useModerate } from '../../hooks/useModerate';
import Button from '../shared/Button';

const ModerationActions = ({ opportunityId, onSuccess }) => {
  const moderateMutation = useModerate();

  const handleAction = async (status) => {
    await moderateMutation.mutateAsync({ id: opportunityId, status });
    if (onSuccess) onSuccess();
  };

  return (
    <div className="flex gap-2">
      <button 
        className="hfas-btn-ghost text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center gap-2"
        onClick={() => handleAction('ACTIVE')}
        disabled={moderateMutation.isLoading}
      >
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        Approve
      </button>
      <button 
        className="hfas-btn-ghost text-accent-red hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
        onClick={() => handleAction('REJECTED')}
        disabled={moderateMutation.isLoading}
      >
        <span className="material-symbols-outlined text-[18px]">cancel</span>
        Reject
      </button>
    </div>
  );
};

export default ModerationActions;
