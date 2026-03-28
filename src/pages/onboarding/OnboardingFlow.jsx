import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Welcome from './Welcome';
import Interests from './Interests';
import Preferences from './Preferences';
import { getPostAuthRedirect } from '../../utils/authRouting';

const MotionDiv = motion.div;

const OnboardingFlow = () => {
  const { currentStep, setStep } = useOnboardingStore();
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role) {
    return <Navigate to="/oauth-role-selection" replace />;
  }

  if (user.role === 'ADMIN' || user.role === 'PUBLISHER' || user.onboardingCompleted) {
    return <Navigate to={getPostAuthRedirect(user)} replace />;
  }

  const handleContinue = async () => {
    setStep(currentStep + 1);
  };

  const handleBack = () => setStep(currentStep - 1);

  const renderStep = () => {
    // If onboarding is completed (step 4), redirect to dashboard
    if (currentStep >= 4) {
      return <Navigate to="/dashboard/feed" replace />;
    }

    switch (currentStep) {
      case 1:
        return <Welcome key="welcome" onContinue={handleContinue} />;
      case 2:
        return <Interests key="interests" onContinue={handleContinue} onBack={handleBack} />;
      case 3:
        return <Preferences key="preferences" onBack={handleBack} onContinue={handleContinue} />;
      default:
        return <Welcome key="welcome" onContinue={handleContinue} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
            <MotionDiv
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {renderStep()}
            </MotionDiv>
        </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
