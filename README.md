# Portfolio

A personal portfolio site that doubles as a small admin app: visitors browse my
projects, and I sign in to write and edit them.

Built with React 19, TypeScript, Tailwind CSS v4 and a mock API — no backend
required to run it.

> **Status:** early (`v0`). Working today: the project list with
> search / filter / sort, a markdown project page, password sign-in, and a
> two-pane markdown editor that renders a live preview and saves. There is no 3D
> landing page yet — see [Roadmap](#roadmap).

## Stack

| Concern      | Choice                                                                                |
| ------------ | ------------------------------------------------------------------------------------- |
| Build        | [Vite](https://vite.dev) 8                                                            |
| UI           | [React](https://react.dev) 19, TypeScript 6                                           |
| Styling      | [Tailwind CSS](https://tailwindcss.com) 4, [shadcn/ui](https://ui.shadcn.com) (Radix) |
| Routing      | [React Router](https://reactrouter.com) 8                                             |
| Server state | [TanStack Query](https://tanstack.com/query) 5                                        |
| Validation   | [Zod](https://zod.dev)                                                                |
| Markdown     | `react-markdown` + `remark-gfm`, `rehype-raw`, `rehype-sanitize`, `rehype-highlight`  |
| Editor       | [CodeMirror](https://codemirror.net) 6 via `@uiw/react-codemirror`, with vim mode     |
| Mock API     | [MSW](https://mswjs.io) + `@mswjs/data`                                               |
| Tests        | [Vitest](https://vitest.dev) + Testing Library                                        |

## Getting started

```bash
yarn install
cp .env.example .env
yarn dev
```

`.env` is **required** and not committed. Without it the app throws while loading
its config and renders a blank page:

```
Error: Invalid env provided.
      The following variables are missing or invalid:
      - API_URL: Invalid input: expected string, received undefined
```

Config is read from `VITE_APP_*` variables, and the prefix is stripped — so
`VITE_APP_API_URL` becomes `API_URL`:

```dotenv
VITE_APP_API_URL=http://localhost:8080/api
VITE_APP_ENABLE_API_MOCKING=true
```

With mocking on, the API is served by a service worker and everything lives in
your browser's `localStorage` under the key `msw-db`. Clear that key if the seed
data ever looks stale.

### Signing in

The mock backend seeds a single account, protected by a password only:

```
password: admin123
```

It lives only in your browser, only while `VITE_APP_ENABLE_API_MOCKING=true`, and
is defined in [`src/testing/mocks/seed.ts`](src/testing/mocks/seed.ts).

## Routes

| Path                      | Page         | Access                                |
| ------------------------- | ------------ | ------------------------------------- |
| `/`                       | Landing      | public                                |
| `/auth/login`             | Sign in      | public                                |
| `/app`                    | Project list | public — visible projects only        |
| `/app/project/:projectId` | Project page | public — hidden projects return `404` |
| `/app/edit/:projectId`    | Editor       | admin only                            |

`/app/edit/*` is wrapped in `ProtectedRoute` and redirects to
`/auth/login?redirectTo=…` when there is no session.

**Visibility is enforced by the API, not the UI.** Anonymous callers get
`visible: true` projects only, and the detail endpoint answers `404` rather than
`403` so a hidden project cannot be probed for existence. Writing requires a
session — `PATCH` returns `401` otherwise. Filtering in a component would leave
the hidden rows in the JSON.

## How it's built

The layout follows the feature-folder structure popularised by
[bulletproof-react](https://github.com/alan2207/bulletproof-react):

```
src/
  app/            routes, router, providers
  components/     shared UI (shadcn primitives + composed widgets)
  features/       per-domain API hooks and logic
  lib/            api client, auth, react-query config, utils
  testing/        MSW handlers, mock database, test helpers
  config/         env schema, route paths
  types/          API types
```

A few deliberate choices worth knowing:

- **The editor route and its form live in one file**
  (`src/app/routes/app/edit.tsx` + `components/ui/edit-page.tsx`). The editor and
  the preview share one markdown renderer (`components/ui/markdown-viewer.tsx`),
  so what I write and what visitors see cannot drift apart.
- **One markdown pipeline for the whole app.** Raw HTML is allowed
  (`rehype-raw`) but sanitised (`rehype-sanitize`) _before_ highlighting
  (`rehype-highlight`). Highlight last, or the highlighter's `class` attributes
  get stripped and every code block turns grey.
- **Filter, search and sort are state; the visible list is derived during
  render.** No `useEffect` mirroring, no `useMemo` for a handful of items.
- **Dirty tracking compares against a saved baseline**, not against the props
  from the last fetch. Comparing to props would leave Save enabled after a
  successful save, until the refetch landed — and forever if it failed.
- **Signing in or out clears the project cache** (`removeQueries`, not
  `invalidateQueries`). The previous session's list is not stale data, it is
  someone else's data; invalidating would keep rendering it while refetching,
  so hidden projects would pop into view mid-page.
- **Everything is typed against `src/types/api.ts`.** A project is
  `Entity<{ project_url, title, languages, createdAt, visible, body }>`.

## Scripts

| Command             | Does                          |
| ------------------- | ----------------------------- |
| `yarn dev`          | Dev server with HMR           |
| `yarn build`        | Type-check (`tsc -b`) + build |
| `yarn preview`      | Serve the production build    |
| `yarn lint`         | ESLint                        |
| `yarn format`       | Prettier, write               |
| `yarn format:check` | Prettier, check only          |

## Roadmap

- [ ] Landing page: a 3D lever — right to browse as a visitor, left to sign in.
- [ ] Visitor dashboard: scroll-driven 3D object; pinned projects when nothing is
      filtered.
- [ ] Project page header that shrinks on scroll.
- [ ] GitHub integration: repo list, `GET /repos/:owner/:repo/languages` for the
      language chips, README as the fallback body.
- [ ] Admin affordances on the dashboard (the project page already shows an Edit
      button to signed-in users).
- [ ] `src/lib/authorization` is copied but not wired up.

## Credits

The application architecture — routing, API client, auth, React Query setup and
the MSW mock layer — is adapted from
[bulletproof-react](https://github.com/alan2207/bulletproof-react) by Alan
Alickovic, MIT licensed. See [NOTICE.md](NOTICE.md) for the full license text.

## License

[MIT](LICENSE)
