import { env } from '@/config/env';

export const enableMocking = async () => {
  // Compared against the literal, not through `env`, on purpose: Vite replaces
  // `import.meta.env.VITE_APP_*` with a string at build time, so this condition
  // folds to `true` when mocking is off and the whole mock layer — MSW, the
  // seed data, the mock admin password — is dropped from the production bundle.
  // Reading `env.ENABLE_API_MOCKING` instead would keep all of it: that value is
  // built at runtime, so the bundler cannot prove the branch is dead.
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
