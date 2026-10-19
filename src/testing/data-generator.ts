import {
  randCatchPhrase,
  randParagraph,
  randImg,
  randUrl,
  randPassword,
  randProgrammingLanguage,
  randPastDate
} from '@ngneat/falso';

import type { User, CustomProject } from '@/types/mocks';

type DataGenerator<T> = () => T;
type DataCreator<T, K> = (overrides?: Partial<T>) => K;

const generateCustomProject: DataGenerator<CustomProject> = () => ({
  project_url: randUrl(),
  title: randCatchPhrase(),
  languages: [randProgrammingLanguage(), randProgrammingLanguage()],
  createdAt: randPastDate({years: 3}).toISOString(),
  visible: true,
  body: randParagraph() + `\n\n![Demo Screenshot](${randImg()})`,
});

export const createCustomProject: DataCreator<
  ReturnType<typeof generateCustomProject>,
  ReturnType<typeof generateCustomProject>
> = (overrides) => {
  return { ...generateCustomProject(), ...overrides };
};

const generateUser: DataGenerator<User> = () => ({
  password: randPassword(),
});

export const createUser: DataCreator<
  ReturnType<typeof generateUser>,
  ReturnType<typeof generateUser>
> = (overrides) => {
  return { ...generateUser(), ...overrides };
};
