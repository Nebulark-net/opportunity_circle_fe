import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/shared/Button';
import api from '../../lib/api';

const OAuthRoleSelection = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('SEEKER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.patch('/auth/me/role', { role: selectedRole });
      const updatedUser = response.data.data;
      
      updateProfile(updatedUser);
      toast.success(`Welcome aboard as a ${selectedRole.toLowerCase()}!`);

      if (selectedRole === 'SEEKER') {
        navigate('/onboarding');
      } else {
        navigate('/publisher/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finalize role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 text-center py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-black dark:text-white">One last step!</h1>
        <p className="text-slate-500">Please select your account type to continue.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setSelectedRole('SEEKER')}
          className={`p-6 border-2 rounded-card text-left transition-all ${
            selectedRole === 'SEEKER'
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
          }`}
        >
          <h3 className="font-bold text-lg dark:text-white">I am a Seeker</h3>
          <p className="text-sm text-slate-500 mt-1">I'm looking for opportunities like scholarships, internships, and events.</p>
        </button>

        <button
          onClick={() => setSelectedRole('PUBLISHER')}
          className={`p-6 border-2 rounded-card text-left transition-all ${
            selectedRole === 'PUBLISHER'
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
          }`}
        >
          <h3 className="font-bold text-lg dark:text-white">I am a Publisher</h3>
          <p className="text-sm text-slate-500 mt-1">I want to post and manage opportunities for seekers.</p>
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full py-4 text-lg"
        isLoading={isSubmitting}
      >
        Finish Setup
      </Button>
    </div>
  );
};

export default OAuthRoleSelection;
