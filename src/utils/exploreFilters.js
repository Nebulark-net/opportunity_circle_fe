export const DEFAULT_EXPLORE_FILTERS = {
  type: null,
  location: '',
  educationLevel: null,
  fundingType: null,
};

export const TYPE_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Scholarships', value: 'SCHOLARSHIP' },
  { label: 'Internships', value: 'INTERNSHIP' },
  { label: 'Fellowships', value: 'FELLOWSHIP' },
  { label: 'Events', value: 'EVENT' },
  { label: 'Workshops', value: 'WORKSHOP' },
];

export const EDUCATION_LEVEL_OPTIONS = [
  { label: 'All Levels', value: null },
  { label: 'High School', value: 'HIGH_SCHOOL' },
  { label: 'Undergraduate', value: 'UNDERGRADUATE' },
  { label: 'Graduate', value: 'GRADUATE' },
  { label: 'PhD', value: 'PHD' },
  { label: 'Any', value: 'ANY' },
];

export const FUNDING_TYPE_OPTIONS = [
  { label: 'Any Funding', value: null },
  { label: 'Fully Funded', value: 'FULLY_FUNDED' },
  { label: 'Partially Funded', value: 'PARTIALLY_FUNDED' },
  { label: 'Non-Funded', value: 'NON_FUNDED' },
];

const TYPE_ALIASES = {
  SCHOLARSHIPS: 'SCHOLARSHIP',
  INTERNSHIPS: 'INTERNSHIP',
  FELLOWSHIPS: 'FELLOWSHIP',
  EVENTS: 'EVENT',
  WORKSHOPS: 'WORKSHOP',
};

const EDUCATION_LEVEL_ALIASES = {
  HIGHSCHOOL: 'HIGH_SCHOOL',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  UNDERGRAD: 'UNDERGRADUATE',
  UNDERGRADUATE: 'UNDERGRADUATE',
  GRAD: 'GRADUATE',
  GRADUATE: 'GRADUATE',
  PHD: 'PHD',
  ANY: 'ANY',
};

const FUNDING_TYPE_ALIASES = {
  FULLY_FUNDED: 'FULLY_FUNDED',
  FULLYFUNDED: 'FULLY_FUNDED',
  FULL_FUNDING: 'FULLY_FUNDED',
  PARTIALLY_FUNDED: 'PARTIALLY_FUNDED',
  PARTIALLYFUNDED: 'PARTIALLY_FUNDED',
  PARTIAL_FUNDING: 'PARTIALLY_FUNDED',
  NON_FUNDED: 'NON_FUNDED',
  NONFUNDED: 'NON_FUNDED',
  UNFUNDED: 'NON_FUNDED',
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  STIPEND: 'STIPEND',
};

const normalizeToken = (value) => value?.trim().replace(/[\s-]+/g, '_').toUpperCase() || '';

const normalizeEnumValue = (value, aliases) => {
  const token = normalizeToken(value);
  if (!token) return null;
  return aliases[token] || token;
};

const toQueryValue = (value) => value.toLowerCase().replace(/_/g, '-');

export const normalizeExploreType = (value) => normalizeEnumValue(value, TYPE_ALIASES);

export const normalizeExploreEducationLevel = (value) => normalizeEnumValue(value, EDUCATION_LEVEL_ALIASES);

export const normalizeExploreFundingType = (value) => normalizeEnumValue(value, FUNDING_TYPE_ALIASES);

export const areExploreFiltersEqual = (left = {}, right = {}) =>
  Object.keys(DEFAULT_EXPLORE_FILTERS).every((key) => (left[key] ?? DEFAULT_EXPLORE_FILTERS[key]) === (right[key] ?? DEFAULT_EXPLORE_FILTERS[key]));

export const parseExploreSearchParams = (searchParams) => {
  const parsedPage = Number.parseInt(searchParams.get('page') || '1', 10);

  return {
    searchQuery: searchParams.get('search') || '',
    filters: {
      type: normalizeExploreType(searchParams.get('type')),
      location: searchParams.get('location') || '',
      educationLevel: normalizeExploreEducationLevel(searchParams.get('educationLevel')),
      fundingType: normalizeExploreFundingType(searchParams.get('fundingType')),
    },
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
};

export const buildExploreSearchParams = ({ searchQuery = '', filters = DEFAULT_EXPLORE_FILTERS, page = 1 }) => {
  const params = new URLSearchParams();
  const trimmedSearch = searchQuery.trim();
  const trimmedLocation = filters.location?.trim();
  const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 1 ? String(Number(page)) : null;

  if (trimmedSearch) params.set('search', trimmedSearch);
  if (filters.type) params.set('type', toQueryValue(filters.type));
  if (trimmedLocation) params.set('location', trimmedLocation);
  if (filters.educationLevel) params.set('educationLevel', toQueryValue(filters.educationLevel));
  if (filters.fundingType) params.set('fundingType', toQueryValue(filters.fundingType));
  if (normalizedPage) params.set('page', normalizedPage);

  return params;
};
