const AUTH_FLOW_PATHS = new Set([
  '/onboarding',
  '/oauth-callback',
  '/oauth-role-selection',
]);

export const isAuthFlowPath = (pathname = '') => AUTH_FLOW_PATHS.has(pathname);

export const getPostAuthRedirect = (user) => {
  if (!user) return '/login';

  const role = user.role?.toUpperCase();

  if (!role) return '/oauth-role-selection';
  if (role === 'ADMIN') return '/admin/moderation';
  if (role === 'PUBLISHER') return '/publisher/dashboard';
  if (!user.onboardingCompleted) return '/onboarding';

  return '/dashboard/feed';
};
