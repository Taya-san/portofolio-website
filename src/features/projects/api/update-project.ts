import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { CustomProject } from '@/types/api';

import { getProjectsQueryOptions } from './get-projects';

export type UpdateProjectInput = {
  projectId: string;
  data: Partial<CustomProject>;
};

export const updateProject = ({
  projectId,
  data,
}: UpdateProjectInput): Promise<{ data: CustomProject }> => {
  return api.patch(`/projects/${projectId}`, data);
};

type UseUpdateProjectOptions = {
  mutationConfig?: MutationConfig<typeof updateProject>;
};

export const useUpdateProject = ({
  mutationConfig,
}: UseUpdateProjectOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      // ['projects'] prefix-matches BOTH the list and ['projects', id],
      // so one call refreshes the dashboard and the single project page.
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateProject,
  });
};
