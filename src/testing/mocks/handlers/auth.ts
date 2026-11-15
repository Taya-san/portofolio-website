import Cookies from 'js-cookie';
import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { authenticate, requireAuth, AUTH_COOKIE, networkDelay } from '../utils';

type LoginBody = {
  password: string;
};

export const authHandlers = [
  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    await networkDelay();

    try {
      const credentials = (await request.json()) as LoginBody;
      const result = authenticate(credentials);

      Cookies.set(AUTH_COOKIE, result.jwt, { path: '/' });

      return HttpResponse.json(result, {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/;`,
        },
      });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/auth/logout`, async () => {
    await networkDelay();

    Cookies.remove(AUTH_COOKIE);

    return HttpResponse.json(
      { message: 'Logged out' },
      {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=; Path=/;`,
        },
      },
    );
  }),

  http.get(`${env.API_URL}/auth/me`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { data } = requireAuth(cookies);
      return HttpResponse.json({ data: data });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
