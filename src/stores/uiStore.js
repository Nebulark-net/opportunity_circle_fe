import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../lib/i18n';

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      isSidebarOpen: false,

      toggleTheme: (theme) => {
        set({ theme });
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebar: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
