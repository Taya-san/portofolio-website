import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

const models = {
  project: {
    id: primaryKey(nanoid),
    project_url: String,
    title: String,
    body: String
  },
  user: {
    id: primaryKey(nanoid),
    password: String,
  }
}

export const db = factory(models);

export type Model = keyof typeof models;

const dbFilePath = 'mocked-db.json';

export const loadDb = async () => {
  if (typeof window === 'undefined') {
    const { readFile, writeFile } = await import ('fs/promises');
    try {
      const data = await readFile(dbFilePath, 'utf8');
      return JSON.parse(data)
    } catch (error) {
      if ((error as { code?: string })?.code === 'ENOENT') {
        const emptyDB = {};
        await writeFile(dbFilePath, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      } else {
        console.error('Error loading mocked DB:', error);
        return null;
      }
    }
  };

  return JSON.parse(window.localStorage.getItem('msw-db') || '{}')
};

export const storeDb = async (data: string) => {
  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, data);
  } else {
    window.localStorage.setItem('msw-db', data);
  };
};

export const persistDb = async (model: Model) => {
  if (process.env.NODE_ENV === 'test') return;
  const data = await loadDb();
  data[model] = db[model].getAll();
  await storeDb(JSON.stringify(data));
};

export const initializeDb = async () => {
  const database = await loadDb();
  Object.entries(db).forEach(([key, model]) => {
    const dataEntries = database[key];
    if (dataEntries) {
      dataEntries?.forEach((entry: Record<string, unknown>) => {
        model.create(entry);
      });
    };
  });
};

export const resetDb = async () => {
  if (typeof window === 'undefined') {
    storeDb("{}")
  } else {
    window.localStorage.clear();
  };
};
