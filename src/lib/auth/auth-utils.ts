import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../api-client';
import { getProjectsQueryOptions } from '@/features/projects/api/get-projects';

import type { MutationConfig } from '../react-query';
import { isAxiosError } from 'axios';

const getUser = async (): Promise<boolean> => {
  try {
    await api.get('/auth/me');

    return true;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      return false
    }

    throw err;
  }
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

const loginWithPassword = async (data: LoginInput): Promise<boolean> => {
  await api.post('/auth/login', data);
  return true;
};

export const AUTH_USER_KEY = ['authenticated-user'];

export const useUser = () => {
  return useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useLogin = (
  mutationConfig?: MutationConfig<typeof loginWithPassword>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: loginWithPassword,
    onSuccess: (response, ...restArgs) => {
      queryClient.setQueryData(AUTH_USER_KEY, response);
      queryClient.removeQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });
      onSuccess?.(response, ...restArgs);
    },
    ...restConfig,
  });
};

export const useLogout = (mutationConfig?: MutationConfig<typeof logout>) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async (...args) => {
      await onSuccess?.(...args);
      queryClient.setQueryData(AUTH_USER_KEY, null);
      queryClient.removeQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });
    },
    ...restConfig,
  });
};
