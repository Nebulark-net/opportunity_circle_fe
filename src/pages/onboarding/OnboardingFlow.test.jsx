import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../stores/onboardingStore', () => ({
  useOnboardingStore: vi.fn(),
}));

vi.mock('./Welcome', () => ({
  default: ({ onContinue }) => (
    <button onClick={onContinue} type="button">
      Welcome Step
    </button>
  ),
}));

vi.mock('./Interests', () => ({
  default: () => <div>Interests Step</div>,
}));

vi.mock('./Preferences', () => ({
  default: () => <div>Preferences Step</div>,
}));

import { useAuthStore } from '../../stores/authStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import OnboardingFlow from './OnboardingFlow';

const mockAuthStore = (state) => {
  vi.mocked(useAuthStore).mockImplementation((selector) => (
    typeof selector === 'function' ? selector(state) : state
  ));
};

const mockOnboardingStore = (state) => {
  vi.mocked(useOnboardingStore).mockImplementation((selector) => (
    typeof selector === 'function' ? selector(state) : state
  ));
};

describe('OnboardingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the current seeker onboarding step and advances it', () => {
    const setStep = vi.fn();

    mockAuthStore({
      user: { role: 'SEEKER', onboardingCompleted: false },
    });

    mockOnboardingStore({
      currentStep: 1,
      setStep,
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingFlow />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Welcome Step'));

    expect(setStep).toHaveBeenCalledWith(2);
  });

  it('redirects completed seekers away from onboarding', () => {
    mockAuthStore({
      user: { role: 'SEEKER', onboardingCompleted: true },
    });

    mockOnboardingStore({
      currentStep: 1,
      setStep: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/dashboard/feed" element={<div>Feed Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Feed Route')).toBeInTheDocument();
  });
});
