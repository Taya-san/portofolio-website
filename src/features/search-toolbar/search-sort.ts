import type { ApiResponse } from '@/types/api-helper';

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'A to Z' },
  { value: 'title-desc', label: 'Z to A' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export const sorters: Record<
  SortKey,
  (
    b: ApiResponse<'/projects', 'get'>['projects'][number],
    a: ApiResponse<'/projects', 'get'>['projects'][number],
  ) => number
> = {
  default: () => 0,
  newest: (b, a) => +new Date(a.createdAt) - +new Date(b.createdAt),
  oldest: (b, a) => +new Date(b.createdAt) - +new Date(a.createdAt),
  'title-asc': (b, a) => b.title.localeCompare(a.title),
  'title-desc': (b, a) => a.title.localeCompare(b.title),
};
