import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAuthStore } from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import DashboardLayout from './pages/dashboard/Dashboard';
import PublisherLayout from './layouts/PublisherLayout';
import AdminLayout from './layouts/AdminLayout';

// General Pages
import HomePage from './pages/Home/index';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPasswordConfirmation from './pages/auth/ForgotPasswordConfirmation';
import ResetPassword from './pages/auth/ResetPassword';
import OAuthCallback from './pages/auth/OAuthCallback';
import OAuthRoleSelection from './pages/auth/OAuthRoleSelection';
import OpportunityDetail from './pages/opportunity/OpportunityDetail';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import PublishersPage from './pages/Publishers/PublishersPage';
import ExplorePage from './pages/Explore/index';

// Dashboard Pages
import Feed from './pages/dashboard/Feed';
import Applications from './pages/dashboard/MyApplications';
import Saved from './pages/dashboard/SavedOpportunities';
import Resources from './pages/Resources';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';

// Admin Pages
import ModerationQueue from './pages/admin/ModerationQueue';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCMS from './pages/admin/AdminCMS';
import AdminMentors from './pages/admin/AdminMentors';

// Publisher Pages
import PublisherDashboard from './pages/publisher/PublisherDashboard';
import CreateOpportunity from './pages/publisher/CreateOpportunity';
import PublisherListings from './pages/publisher/PublisherListings';
import ApplicantManagement from './pages/publisher/ApplicantManagement';

import PublisherInsights from './pages/publisher/PublisherInsights';

// Initialize QueryClient
const queryClient = new QueryClient();

function PrivateRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Ensure user object exists before checking role
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  if (role) {
    const userRole = user.role?.toUpperCase();
    const requiredRole = role.toUpperCase();
    
    if (userRole !== requiredRole) {
      console.warn(`Access Denied: Required ${requiredRole}, User has ${userRole}`);
      // Redirect to appropriate dashboard based on actual role
      if (userRole === 'PUBLISHER') return <Navigate to="/publisher/dashboard" />;
      if (userRole === 'ADMIN') return <Navigate to="/admin/moderation" />;
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
}

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Router>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/opportunity/:id" element={<OpportunityDetail />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/explore" element={<ExplorePage />} />
              {/* Add the /publishers route */}
              <Route path="/publishers" element={<PublishersPage />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password-confirmation" element={<ForgotPasswordConfirmation />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/oauth-role-selection" element={<OAuthRoleSelection />} />
            </Route>

            <Route
              path="/dashboard"
              element={
                <PrivateRoute role="SEEKER">
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate replace to="feed" />} />
              <Route path="feed" element={<Feed type="all" />} />
              <Route path="internships" element={<Feed type="INTERNSHIP" />} />
              <Route path="scholarships" element={<Feed type="SCHOLARSHIP" />} />
              <Route path="fellowships" element={<Feed type="FELLOWSHIP" />} />
              <Route path="workshops" element={<Feed type="WORKSHOP" />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<Saved />} />
              <Route path="resources" element={<Resources />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route
              path="/admin"
              element={
                <PrivateRoute role="ADMIN">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="moderation" element={<ModerationQueue />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="mentors" element={<AdminMentors />} />
            </Route>

            <Route
              path="/publisher"
              element={
                <PrivateRoute role="PUBLISHER">
                  <PublisherLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<PublisherDashboard />} />
              <Route path="create" element={<CreateOpportunity />} />
              <Route path="edit/:id" element={<CreateOpportunity />} />
              <Route path="opportunity/:id" element={<OpportunityDetail />} />
              <Route path="listings" element={<PublisherListings />} />
              <Route path="applicants" element={<ApplicantManagement />} />
              <Route path="insights" element={<PublisherInsights />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          </Routes>
        </QueryClientProvider>
      </Router>
    </>
  );
}

export default App;
