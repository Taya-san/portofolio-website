import type { CustomProject } from "@/types/api";

export type SearchFilters = {
  languages: string[]
};

export const collectLanguages = (projects: CustomProject[]): string[] => {
  return [...new Set(projects.flatMap((project) => project.languages))].sort((b, a) => b.localeCompare(a))
};

export const matchesFilters = (
  project: CustomProject,
  filters: SearchFilters,
  searchQuery: string
): boolean => {
  const query = searchQuery.trim().toLowerCase();

  if (
    query &&
    !project.title.toLowerCase().includes(query)
  ) {
    return false
  };

  if (
    filters.languages.length > 0 &&
    !project.languages.some((language) => filters.languages.includes(language))
  ) {
    return false
  };

  return true
}
