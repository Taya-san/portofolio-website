import {
  randCatchPhrase,
  randParagraph,
  randImg,
  randUrl,
  randPassword,
  randProgrammingLanguage,
  randPastDate,
} from '@ngneat/falso';

import type { CustomProject } from '@/types/api';
import type { MockUser } from '@/types/mocks';

type DataGenerator<T> = () => T;
type DataCreator<T, K> = (overrides?: Partial<T>) => K;

const generateCustomProject: DataGenerator<Omit<CustomProject, 'id'>> = () => ({
  project_url: randUrl(),
  title: randCatchPhrase(),
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

const generateUser: DataGenerator<Omit<MockUser, 'id'>> = () => ({
  password: randPassword(),
});

export const createUser: DataCreator<
  ReturnType<typeof generateUser>,
  ReturnType<typeof generateUser>
> = (overrides) => {
  return { ...generateUser(), ...overrides };
};
