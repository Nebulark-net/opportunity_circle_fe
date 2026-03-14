import React, { useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../stores/notificationStore';
import Button from '../shared/Button';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();

  return (
    <div className="relative">
      <button 
        className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-card shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-border-dark flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold">Notifications</h3>
                <div className="flex gap-2">
                  <button onClick={markAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Check size={14} />
                    Mark all as read
                  </button>
                  <button onClick={clearNotifications} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-slate-50 dark:border-border-dark flex gap-4 transition-colors ${!n.read ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <Bell size={40} className="mx-auto mb-4 opacity-10" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 text-center border-t border-slate-100 dark:border-border-dark">
                  <Button variant="ghost" className="w-full text-xs">See all notifications</Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
