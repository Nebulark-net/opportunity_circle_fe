import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { toast } from 'sonner';

let socket;

export const initSocket = () => {
  const token = useAuthStore.getState().token;
  
  if (!token) return;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('new_notification', (notification) => {
    useNotificationStore.getState().addNotification(notification);
    toast.info(notification.title, {
      description: notification.message,
    });
  });

  socket.on('opportunity_update', (data) => {
    toast.success('Opportunity Update', {
      description: data.message,
    });
    // You could also trigger a refetch here if needed
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
