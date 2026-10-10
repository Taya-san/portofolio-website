import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db } from '../db';
import { networkDelay } from '../utils';

export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async () => {
    await networkDelay();

    try {
      const result = db.project.getAll();

      return HttpResponse.json({ data: result });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.get(`${env.API_URL}/projects/:projectId`, async ({ params }) => {
    await networkDelay();

    try {
      const projectId = params.projectId as string;

      const project = db.project.findFirst({
        where: {
          id: {
            equals: projectId,
          },
        },
      });

      if (!project) {
        return HttpResponse.json(
          { message: 'Project not found' },
          { status: 404 },
        );
      }

      return HttpResponse.json({ data: project });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
