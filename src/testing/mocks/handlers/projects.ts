import { HttpResponse, http } from 'msw';
import { env } from '@/config/env';
import { db } from '../db';
import { networkDelay } from '../utils';
import { requireAuth } from '../utils';
import { persistDb } from '../db';

import type { ApiRequest } from '@/types/api-helper';

export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async ({ cookies }) => {
    await networkDelay();

    try {
      const user = requireAuth(cookies);
      const result = user.data
        ? db.project.getAll()
        : db.project.findMany({ where: { visible: { equals: true } } });
      return HttpResponse.json({ projects: result, total: result.length });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.get(`${env.API_URL}/project/:projectId`, async ({ params, cookies }) => {
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

  http.put(
    `${env.API_URL}/edit/:projectId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const projectId = params.projectId as string;
        const updates = (await request.json()) as ApiRequest<
          '/edit/{id}',
          'put'
        > & { custom: boolean };
        const user = requireAuth(cookies);

        updates.custom = true;

        if (!user.data) {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            { error: 'Project not found' },
            { status: 404 },
          );
        }

        await persistDb('project');

        return HttpResponse.json(project);
      } catch (error: unknown) {
        return HttpResponse.json(
          { message: error instanceof Error ? error.message : 'Server Error' },
          { status: 500 },
        );
      }
    },
  ),

  http.post(`${env.API_URL}/edit/`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const prj = (await request.json()) as ApiRequest<'/edit', 'post'> & {
        custom: boolean;
      };
      const user = requireAuth(cookies);

      if (!user.data) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      prj.custom = true;

      const project = db.project.create(prj);

      if (!project) {
        return HttpResponse.json(
          { error: 'Unknown Input Detected' },
          { status: 400 },
        );
      }

      await persistDb('project');

      return HttpResponse.json(project);
    } catch (error: unknown) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.delete(`${env.API_URL}/edit/:projectId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const projectId = params.projectId as string;
      const user = requireAuth(cookies);

      if (!user.data) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const project = db.project.delete({
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

      await persistDb('project');

      return HttpResponse.json(project);
    } catch (error: unknown) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
