import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';
import './lib/i18n';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages
import HomePage from './pages/Home/index';
import ExplorePage from './pages/Explore/index';
import PublisherPage from './pages/Publishers/index';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPasswordConfirmation from './pages/auth/ForgotPasswordConfirmation';
import ResetPassword from './pages/auth/ResetPassword';
import OAuthCallback from './pages/auth/OAuthCallback';
import OAuthRoleSelection from './pages/auth/OAuthRoleSelection';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import SeekerDashboard from './pages/dashboard/SeekerDashboard';
import SavedOpportunities from './pages/dashboard/SavedOpportunities';
import MyApplications from './pages/dashboard/MyApplications';
import ProfilePage from './pages/profile/ProfilePage';
import Resources from './pages/Resources';
import PublisherDashboard from './pages/publisher/PublisherDashboard';
import PublisherListings from './pages/publisher/PublisherListings';
import ApplicantManagement from './pages/publisher/ApplicantManagement';
import CreateOpportunity from './pages/publisher/CreateOpportunity';
import ModerationQueue from './pages/admin/ModerationQueue';

// Components
import EmailVerifyToast from './components/auth/EmailVerifyToast';

// Stores
import { useAuthStore } from './stores/authStore';

// Socket
import { initSocket, disconnectSocket } from './lib/socket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Normalize roles to uppercase for comparison
  const normalizedUserRole = user?.role?.toUpperCase();
  const normalizedRoles = roles.map(r => r.toUpperCase());

  if (roles.length > 0 && !normalizedRoles.includes(normalizedUserRole)) {
    // Redirect to respective dashboard if role not authorized
    const target = normalizedUserRole === 'PUBLISHER' ? '/publisher/dashboard' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  // Onboarding check for seekers
  if (normalizedUserRole === 'SEEKER' && !user?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      initSocket();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <EmailVerifyToast />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/publishers" element={<PublisherPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/confirmation" element={<ForgotPasswordConfirmation />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/oauth-role-selection" element={
              <ProtectedRoute>
                <OAuthRoleSelection />
              </ProtectedRoute>
            } />
          </Route>

          {/* Protected Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<SeekerDashboard />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/saved" element={<SavedOpportunities />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Publisher Routes */}
            <Route path="/publisher/dashboard" element={
              <ProtectedRoute roles={['publisher', 'admin']}>
                <PublisherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/publisher/listings" element={
              <ProtectedRoute roles={['publisher', 'admin']}>
                <PublisherListings />
              </ProtectedRoute>
            } />
            <Route path="/publisher/applicants" element={
              <ProtectedRoute roles={['publisher', 'admin']}>
                <ApplicantManagement />
              </ProtectedRoute>
            } />
            <Route path="/publisher/create" element={
              <ProtectedRoute roles={['publisher', 'admin']}>
                <CreateOpportunity />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/moderation" element={
              <ProtectedRoute roles={['admin']}>
                <ModerationQueue />
              </ProtectedRoute>
            } />
          </Route>

          {/* Onboarding */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            } 
          />

          {/* Root Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
