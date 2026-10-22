import { HttpResponse, http } from 'msw';
import { env } from '@/config/env';
import { db } from '../db';
import { networkDelay } from '../utils';
import { requireAuth } from '../utils';
import { persistDb } from '../db';

import type { CustomProject } from '@/types/api';

export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async ({ cookies }) => {
    await networkDelay();

    try {
      const user = requireAuth(cookies);
      const result = user.data
        ? db.project.getAll()
        : db.project.findMany({ where: { visible: { equals: true } } });
      return HttpResponse.json({ data: result });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.get(
    `${env.API_URL}/projects/:projectId`,
    async ({ params, cookies }) => {
      await networkDelay();

      try {
        const projectId = params.projectId as string;
        const user = requireAuth(cookies);

        const project = db.project.findFirst({
          where: {
            id: {
              equals: projectId,
            },
          },
        });

        if (!project || (!project.visible && !user.data)) {
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
    },
  ),

  http.patch(
    `${env.API_URL}/projects/:projectId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const projectId = params.projectId as string;
        const updates = (await request.json()) as Partial<CustomProject>;
        const user = requireAuth(cookies);

        if (!user.data) {
          return HttpResponse.json(
            { message: 'Unauthorized' },
            { status: 401 },
          );
        }

        const project = db.project.update({
          where: {
            id: {
              equals: projectId,
            },
          },
          data: updates,
        });

        if (!project) {
          return HttpResponse.json(
            { message: 'Project not found' },
            { status: 404 },
          );
        }

        await persistDb('project');

        return HttpResponse.json({ data: project });
      } catch (error: unknown) {
        return HttpResponse.json(
          { message: error instanceof Error ? error.message : 'Server Error' },
          { status: 500 },
        );
      }
    },
  ),
];
