import { disconnectSocket } from '../lib/socket';
import authService from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';

export const logoutUser = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    disconnectSocket();
    useAuthStore.getState().logout();
  }
};
