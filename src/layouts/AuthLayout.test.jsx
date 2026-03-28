import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from '../stores/authStore';
import AuthLayout from './AuthLayout';

const RouteProbe = () => {
  const location = useLocation();
  return <div data-testid="route-probe">{location.pathname}</div>;
};

const mockAuthStore = (state) => {
  vi.mocked(useAuthStore).mockImplementation((selector) => (
    typeof selector === 'function' ? selector(state) : state
  ));
};

describe('AuthLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects authenticated seekers with incomplete onboarding away from login', () => {
    mockAuthStore({
      isAuthenticated: true,
      user: { role: 'SEEKER', onboardingCompleted: false },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/onboarding" element={<RouteProbe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('route-probe')).toHaveTextContent('/onboarding');
  });

  it('allows auth flow routes to render while auth is still hydrating', () => {
    mockAuthStore({
      isAuthenticated: true,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/oauth-callback']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/oauth-callback" element={<div>Completing Authentication</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Completing Authentication')).toBeInTheDocument();
  });
});
