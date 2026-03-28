import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from '../../stores/authStore';
import OAuthRoleSelection from './OAuthRoleSelection';

const mockAuthStore = (state) => {
  vi.mocked(useAuthStore).mockImplementation((selector) => (
    typeof selector === 'function' ? selector(state) : state
  ));
};

describe('OAuthRoleSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the role selection screen for authenticated users without a role', () => {
    mockAuthStore({
      user: { role: null },
      updateProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/oauth-role-selection']}>
        <Routes>
          <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('One Last Step')).toBeInTheDocument();
    expect(screen.getByText('I am a Seeker')).toBeInTheDocument();
    expect(screen.getByText('I am a Publisher')).toBeInTheDocument();
  });

  it('redirects unauthenticated visitors back to login', () => {
    mockAuthStore({
      user: null,
      updateProfile: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/oauth-role-selection']}>
        <Routes>
          <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
          <Route path="/login" element={<div>Login Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Route')).toBeInTheDocument();
  });
});
