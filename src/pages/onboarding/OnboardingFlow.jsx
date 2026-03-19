import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Welcome from './Welcome';
import Interests from './Interests';
import Preferences from './Preferences';

const OnboardingFlow = () => {
  const { currentStep, setStep, syncStep3 } = useOnboardingStore();
  const { user } = useAuthStore();
  const isPublisher = user?.role === 'PUBLISHER';

  const handleContinue = async () => {
    if (isPublisher && currentStep === 1) {
      // For publishers, we skip seeker steps and complete onboarding
      try {
        await syncStep3({ isPublisherOnboarding: true });
        // Store will set step to 4 which we handle below
      } catch (error) {
        console.error('Publisher onboarding completion failed');
      }
    } else {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => setStep(currentStep - 1);

  const renderStep = () => {
    // If onboarding is completed (step 4), redirect to dashboard
    if (currentStep >= 4) {
      return <Navigate to={isPublisher ? "/publisher/dashboard" : "/dashboard/feed"} replace />;
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
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
