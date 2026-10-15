import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';
import type { ActionFunction, LoaderFunction } from 'react-router';

import { paths } from '@/config/paths';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from '../routes/app/root';

import type { ComponentType } from 'react';

type RouteModule = {
  default: ComponentType;
  clientLoader?: (queryClient: QueryClient) => LoaderFunction;
  clientAction?: (queryClient: QueryClient) => ActionFunction;
};

const convert =
  (queryClient: QueryClient) =>
  <T extends RouteModule>(m: T) => {
    const { clientLoader, clientAction, default: Component, ...rest } = m;
    return {
      ...rest,
      loader: clientLoader?.(queryClient),
      action: clientAction?.(queryClient),
      Component,
    };
  };

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('../routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('../routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('../routes/app/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.app.project.path,
          lazy: () =>
            import('../routes/app/project').then(convert(queryClient)),
        },
        {
          path: paths.app.edit.path,
          lazy: () => import('../routes/app/edit').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('../routes/not-found').then(convert(queryClient)),
    },
  ]);
