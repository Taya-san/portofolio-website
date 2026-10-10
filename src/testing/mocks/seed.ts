import { db, persistDb } from './db';
import { hash } from './utils';

// The password you type on /auth/login while the API is mocked.
// Change this to whatever you like - it only exists in your browser's
// localStorage, and only when VITE_APP_ENABLE_API_MOCKING is true.
const ADMIN_PASSWORD = 'admin123';

const projects = [
  {
    title: 'Terminal Dashboard',
    project_url: 'https://github.com/',
    body: `A keyboard-driven dashboard that shows the state of my home server.

## Why

I wanted a single screen that tells me if anything is on fire.

## Stack

- React and TypeScript
- A small Go service for the metrics
- WebSockets for live updates`,
  },
  {
    title: 'Markdown Notes',
    project_url: 'https://github.com/',
    body: `A local-first notes app. Everything lives in a folder of plain
markdown files, so nothing is locked in a database.

## Why

I kept losing notes inside apps that shut down.

## Stack

- React
- CodeMirror for the editor
- A file-system API on the server side`,
  },
  {
    title: 'Home Lab Monitor',
    project_url: 'https://github.com/',
    body: `Alerts to my phone when a service on the home server stops responding.

## Why

I found out about a dead service three days late, twice.

## Stack

- A cron job in Go
- ntfy for the notifications`,
  },
];

export const seedDb = async () => {
  if (db.user.getAll().length === 0) {
    db.user.create({ password: hash(ADMIN_PASSWORD) });
    await persistDb('user');
  }

  if (db.project.getAll().length === 0) {
    projects.forEach((project) => db.project.create(project));
    await persistDb('project');
  }
};
