import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const OnboardingFlow = () => {
  const { currentStep } = useOnboardingStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 key="step1" />;
      case 2:
        return <Step2 key="step2" />;
      case 3:
        return <Step3 key="step3" />;
      default:
        return <Step1 key="step1" />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-card shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-slate-500">
        Step {currentStep} of 3
      </div>
    </div>
  );
};

export default OnboardingFlow;
