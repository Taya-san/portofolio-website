import { env } from '@/config/env';

export const enableMocking = async () => {
  if (import.meta.env.VITE_APP_ENABLE_API_MOCKING !== 'true') {
    return;
  }

  const { worker } = await import('./browser');
  const { initializeDb } = await import('./db');
  const { seedDb } = await import('./seed');

  await initializeDb();
  await seedDb();

  return worker.start({
    onUnhandledRequest: (request, print) => {
      if (request.url.startsWith(env.API_URL)) {
        print.warning();
      }
    },
  });
};
