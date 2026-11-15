import type { ApiResponse } from '@/types/api-helper';

export type SearchFilters = {
  languages: string[];
};

export const collectLanguages = (
  projects: ApiResponse<'/projects', 'get'>['projects'],
): string[] => {
  return [...new Set(projects.flatMap((project) => project.languages))].sort(
    (b, a) => b.localeCompare(a),
  );
};

export const matchesFilters = (
  project: ApiResponse<'/projects', 'get'>['projects'][number],
  filters: SearchFilters,
  searchQuery: string,
): boolean => {
  const query = searchQuery.trim().toLowerCase();

  if (query && !project.title.toLowerCase().includes(query)) {
    return false;
  }

  if (
    filters.languages.length > 0 &&
    !project.languages.some((language) => filters.languages.includes(language))
  ) {
    return false;
  }

  return true;
};
