import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useModerate } from '../../hooks/useModerate';
import Button from '../shared/Button';

const ModerationActions = ({ opportunityId }) => {
  const moderateMutation = useModerate();

  return (
    <div className="flex gap-2">
      <Button 
        variant="secondary" 
        className="text-green-500 hover:bg-green-50 flex items-center gap-1 text-xs"
        onClick={() => moderateMutation.mutate({ id: opportunityId, status: 'published' })}
        disabled={moderateMutation.isLoading}
      >
        <CheckCircle size={16} />
        Approve
      </Button>
      <Button 
        variant="secondary" 
        className="text-red-500 hover:bg-red-50 flex items-center gap-1 text-xs"
        onClick={() => moderateMutation.mutate({ id: opportunityId, status: 'rejected' })}
        disabled={moderateMutation.isLoading}
      >
        <XCircle size={16} />
        Reject
      </Button>
    </div>
  );
};

export default ModerationActions;
