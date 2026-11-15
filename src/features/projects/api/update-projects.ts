import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import { getProjectsQueryOptions } from './get-projects';

import type { MutationConfig } from '@/lib/react-query';
import type { ApiRequest, ApiResponse } from '@/types/api-helper';

export type UpdateProjectInput = {
  id: string;
  data: ApiRequest<'/edit/{id}', 'put'>;
};

const updateProject = ({
  id,
  data,
}: UpdateProjectInput): Promise<ApiResponse<'/edit/{id}', 'put'>> => {
  return api.put(`/edit/${id}`, data);
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
