import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import type { QueryConfig } from '@/lib/react-query';
import type { CustomProject } from '@/types/api';

export const getProjects = (): Promise<{ data: CustomProject[] }> => {
  return api.get(`/projects`);
};

export const getProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
};

type UseProjectsOptions = {
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({ queryConfig }: UseProjectsOptions = {}) => {
  return useQuery({
    ...getProjectsQueryOptions(),
    ...queryConfig,
  });
};
