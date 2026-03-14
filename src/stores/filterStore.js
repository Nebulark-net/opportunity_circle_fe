import { create } from 'zustand';

const useFilterStore = create((set) => ({
  searchQuery: '',
  filters: {
    type: null, // 'INTERNSHIP', 'SCHOLARSHIP', 'FELLOWSHIP', 'EVENT', 'WORKSHOP'
    location: null,
  },
  page: 1,

  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }), // Reset page on search
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    page: 1 // Reset page on filter change
  })),
  clearFilters: () => set({
    searchQuery: '',
    filters: { type: null, location: null },
    page: 1
  }),
  setPage: (page) => set({ page }),
}));

export default useFilterStore;
