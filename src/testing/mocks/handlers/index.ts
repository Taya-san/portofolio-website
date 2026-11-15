import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';

import { authHandlers } from './auth';
import { projectsHandlers } from './projects';
import { githubProjectHandlers } from './github-project';

export const handlers = [
  ...authHandlers,
  ...projectsHandlers,
  ...githubProjectHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
