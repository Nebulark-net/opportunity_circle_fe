import { create } from 'zustand';

const useLayoutStore = create((set) => ({
  isMobileMenuOpen: false,
  activePage: 'home', // 'home', 'explore', 'publishers'

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setActivePage: (page) => set({ activePage: page }),
}));

export default useLayoutStore;
