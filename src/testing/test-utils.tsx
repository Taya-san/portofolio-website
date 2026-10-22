/* eslint-disable react-refresh/only-export-components */
// This module only re-exports test helpers (render, userEvent, rtlRender).
// The react-refresh rule cannot see through `export *`, so it guesses wrong here.

import { render as rtlRender } from '@testing-library/react';

import { screen, waitForElementToBeRemoved } from '@testing-library/dom';

import type { ReactNode } from 'react';

import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { AppProvider } from '@/app/provider';

import {
  createUser as generateUser,
  createCustomProject as generateCustomProject,
} from './data-generator';

import type { CustomProject } from '@/types/api';
import type { MockUser } from '@/types/mocks';

import { db } from './mocks/db';
import { AUTH_COOKIE, authenticate, hash } from './mocks/utils';

type RenderOptions = {
  user: MockUser;
  url: string;
  path: string;
  [key: string]: unknown;
};

export const createUser = async <T extends Omit<MockUser, 'id'>>(
  userProperties?: T,
): Promise<MockUser> => {
  const generated = generateUser(userProperties);
  const stored = await db.user.create({ password: hash(generated.password) });
  return { ...generated, id: stored.id };
};

export const createCustomProject = async <T extends Omit<CustomProject, 'id'>>(
  customProjectProperties?: T,
): Promise<CustomProject> => {
  const generated = generateCustomProject(customProjectProperties);
  return db.project.create(generated);
};

export const login = async (user: MockUser) => {
  const auth = await authenticate(user);
  Cookies.set(AUTH_COOKIE, auth.jwt);
  return auth;
};

export const waitForLoadingToFinish = () => {
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByTestId(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 5000 },
  );
};

const initializeUser = async (user?: MockUser | undefined) => {
  if (typeof user === 'undefined') {
    const newUser = await createUser();
    return login(newUser);
  } else if (user) {
    return login(user);
  } else {
    return null;
  }
};

export const renderApp = async (
  ui: ReactNode,
  {
    user,
    url = '/',
    path = '/',
    ...renderOptions
  }: RenderOptions | Record<string, never> = {},
) => {
  const initializedUser = await initializeUser(user);

  const router = createMemoryRouter(
    [
      {
        path: path,
        element: ui,
      },
    ],
    {
      initialEntries: url ? ['/', url] : ['/'],
      initialIndex: url ? 1 : 0,
    },
  );

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: () => {
        return (
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        );
      },
      ...renderOptions,
    }),
    user: initializedUser,
  };

  await waitForLoadingToFinish();

  return returnValue;
};

export * from '@testing-library/react';
export { userEvent, rtlRender };
