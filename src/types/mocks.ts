import type { User } from './api';

/**
 * A user as the *mock* backend stores it.
 *
 * The real API `User` is `Entity<unknown>` — no password. The mock DB keeps a
 * hashed password so `POST /auth/login` can authenticate. Keeping this here
 * (rather than inside `data-generator`) means `@/types/mocks` stays the home
 * for "types that only exist because of the mocks".
 */
export type MockUser = User & { password: string };
