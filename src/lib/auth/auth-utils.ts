import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import type { AuthResponse, User } from '@/types/api';

import type { MutationConfig } from '../react-query';

import { api } from '../api-client';

const getUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');

  return response.data;
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

const loginWithPassword = async (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const AUTH_USER_KEY = ['authenticated-user'];

export const useUser = () => {
  return useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: getUser,
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
      queryClient.setQueryData(AUTH_USER_KEY, response.user);
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
    onSuccess: (...args) => {
      queryClient.setQueryData(AUTH_USER_KEY, null);
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
