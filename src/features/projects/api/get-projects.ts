import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import type { QueryConfig } from '@/lib/react-query';
import type { ApiResponse } from '@/types/api-helper';

export const getProjects = (): Promise<ApiResponse<'/projects', 'get'>> => {
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
