import { HttpResponse, http } from 'msw';
import { env } from '@/config/env';
import { db } from '../db';
import { networkDelay } from '../utils';
import { requireAuth } from '../utils';

export const githubProjectHandlers = [
  http.get(`${env.API_URL}/edit/githubproject`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const user = requireAuth(cookies);
      if (!user.data) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const projectId = params.projectId as string;

      const project = db.githubproject.findFirst({
        where: {
          id: {
            equals: projectId,
          },
        },
      });

      if (!project) {
        return HttpResponse.json(
          { error: 'Project not found' },
          { status: 404 },
        );
      }

      return HttpResponse.json(project);
    } catch (err) {
      return HttpResponse.json(
        { error: err instanceof Error ? err.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
