import {
  randCatchPhrase,
  randParagraph,
  randImg,
  randUrl,
  randPassword,
  randProgrammingLanguage,
  randPastDate,
  randProductDescription,
} from '@ngneat/falso';

import type { ApiRequest } from '@/types/api-helper';

type DataGenerator<T> = () => T;
type DataCreator<T, K> = (overrides?: Partial<T>) => K;

const generateCustomProject: DataGenerator<
  ApiRequest<'/edit', 'post'>
> = () => ({
  project_url: randUrl(),
  title: randCatchPhrase(),
  description: randProductDescription(),
  languages: [randProgrammingLanguage(), randProgrammingLanguage()],
  createdAt: randPastDate({ years: 3 }).toISOString(),
  visible: true,
  body: randParagraph() + `\n\n![Demo Screenshot](${randImg()})`,
});

export const createCustomProject: DataCreator<
  ReturnType<typeof generateCustomProject>,
  ReturnType<typeof generateCustomProject>
> = (overrides) => {
  return { ...generateCustomProject(), ...overrides };
};

const generateUser: DataGenerator<{ password: string }> = () => ({
  password: randPassword(),
});

export const createUser: DataCreator<
  ReturnType<typeof generateUser>,
  ReturnType<typeof generateUser>
> = (overrides) => {
  return { ...generateUser(), ...overrides };
};
