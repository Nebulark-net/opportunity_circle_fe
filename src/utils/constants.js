export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
  },
  OPPORTUNITIES: {
    BASE: '/opportunities',
    DETAIL: (id) => `/opportunities/${id}`,
  },
  PUBLISHERS: {
    BASE: '/publishers',
    STATS: '/publishers/dashboard/stats',
    MY_LISTINGS: '/publishers/opportunities',
  },
};
