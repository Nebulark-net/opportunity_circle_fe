import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

const INTEREST_TYPES = [
  { id: 'SCHOLARSHIP', label: 'Scholarships', icon: 'school' },
  { id: 'INTERNSHIP', label: 'Internships', icon: 'work' },
  { id: 'FELLOWSHIP', label: 'Fellowships', icon: 'workspace_premium' },
  { id: 'EVENT', label: 'Events', icon: 'event' },
  { id: 'WORKSHOP', label: 'Workshops', icon: 'groups' },
];

import { toast } from 'sonner';

const Step2 = () => {
  const { data, updateData, setStep, syncStep } = useOnboardingStore();
  const [selectedTypes, setSelectedTypes] = useState(data.interestedTypes || []);
  const [fieldOfStudy, setFieldOfStudy] = useState(data.fieldOfStudy || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleType = (typeId) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const onNext = async () => {
    setIsSubmitting(true);
    try {
      const stepData = { 
        preferences: {
          interestedTypes: selectedTypes,
          fieldOfStudy 
        }
      };
      await syncStep(2, stepData);
      updateData({ interestedTypes: selectedTypes, fieldOfStudy });
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Interests & Categories
        </h1>
        <p className="text-base font-normal leading-relaxed text-slate-600 dark:text-primary/70">
          What are you looking for? Select all that apply to tailor your feed.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {INTEREST_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-medium ${
                selectedTypes.includes(type.id)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        <Input
          label="Field of Study"
          type="text"
          placeholder="e.g. Computer Science, Economics"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <Button 
          onClick={onNext}
          disabled={selectedTypes.length === 0}
          isLoading={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#102220] text-base font-bold h-12 rounded-lg px-6 transition-colors shadow-sm"
        >
          Continue
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </Button>
        <button 
          onClick={() => setStep(1)}
          className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Step2;
