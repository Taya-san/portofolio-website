import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import type { QueryConfig } from '@/lib/react-query';
import type { ApiResponse } from '@/types/api-helper';

export const getGithubProject = ({
  projectURL,
}: {
  projectURL: string;
}): Promise<ApiResponse<'/edit/githubproject', 'get'>> => {
  return api.get('/edit/githubproject', {
    params: {
      url: projectURL,
    },
  });
};

export const getGithubProjectQueryOptions = (projectURL: string) => {
  return queryOptions({
    queryKey: ['githubProjects', projectURL],
    queryFn: () => getGithubProject({ projectURL }),
  });
};

type UseProjectOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getGithubProjectQueryOptions>;
};

export const useProject = ({ projectId, queryConfig }: UseProjectOptions) => {
  return useQuery({
    ...getGithubProjectQueryOptions(projectId),
    ...queryConfig,
  });
};
