import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import { getProjectsQueryOptions } from './get-projects';

import type { MutationConfig } from '@/lib/react-query';
import type { ApiResponse } from '@/types/api-helper';

export type DeleteProjectInput = {
  id: string;
};

const deleteProject = ({
  id,
}: DeleteProjectInput): Promise<ApiResponse<'/edit/{id}', 'delete'>> => {
  return api.put(`/edit/${id}`);
};

type UseUpdateProjectOptions = {
  mutationConfig?: MutationConfig<typeof deleteProject>;
};

export const useDeleteProject = ({
  mutationConfig,
}: UseUpdateProjectOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (...args) => {
      queryClient.removeQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
