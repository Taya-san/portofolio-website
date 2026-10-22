import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import { getProjectsQueryOptions } from './get-projects';

import type { MutationConfig } from '@/lib/react-query';
import type { CustomProject } from '@/types/api';

export type UpdateProjectInput = {
  data: Partial<CustomProject> & Pick<CustomProject, 'id'>;
};

const updateProject = ({
  data,
}: UpdateProjectInput): Promise<{ data: CustomProject }> => {
  return api.patch(`projects/${data.id}`, data);
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
    mutationFn: updateProject,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
