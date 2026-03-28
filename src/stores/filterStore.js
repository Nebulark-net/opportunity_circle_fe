import { create } from 'zustand';
import { DEFAULT_EXPLORE_FILTERS, areExploreFiltersEqual } from '../utils/exploreFilters';

const normalizePage = (page) => {
  const parsedPage = Number(page);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const normalizeFilterValue = (key, value) => {
  if (key === 'location') return value ?? '';
  return value || null;
};

const useFilterStore = create((set) => ({
  searchQuery: '',
  filters: { ...DEFAULT_EXPLORE_FILTERS },
  page: 1,

  setSearchQuery: (query) => set({ searchQuery: query ?? '', page: 1 }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: normalizeFilterValue(key, value) },
    page: 1,
  })),
  clearFilters: () => set({
    searchQuery: '',
    filters: { ...DEFAULT_EXPLORE_FILTERS },
    page: 1,
  }),
  setPage: (page) => set({ page: normalizePage(page) }),
  syncFromQuery: ({ searchQuery = '', filters = DEFAULT_EXPLORE_FILTERS, page = 1 }) => set((state) => {
    const nextFilters = { ...DEFAULT_EXPLORE_FILTERS, ...filters };
    const nextPage = normalizePage(page);

    if (
      state.searchQuery === searchQuery &&
      state.page === nextPage &&
      areExploreFiltersEqual(state.filters, nextFilters)
    ) {
      return state;
    }

    return {
      searchQuery,
      filters: nextFilters,
      page: nextPage,
    };
  }),
}));

export default useFilterStore;
