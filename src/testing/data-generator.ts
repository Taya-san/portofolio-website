import {
  randCatchPhrase,
  randParagraph,
  randImg,
  randUrl,
  randPassword,
} from '@ngneat/falso';

import type {
  User,
  CustomProject,
} from '@/types/mocks';

type DataGenerator<T> = () => T;
type DataCreator<T, K> = (overrides?: Partial<T>) => K;

const generateCustomProject: DataGenerator<CustomProject> = () => ({
  project_url: randUrl(),
  title: randCatchPhrase(),
  body: randParagraph() + `\n\n![Demo Screenshot](${randImg()})`
});

export const createCustomProject: DataCreator<ReturnType<typeof generateCustomProject>, ReturnType<typeof generateCustomProject>> = (
  overrides
) => {
  return { ...generateCustomProject(), ...overrides };
};

const generateUser: DataGenerator<User> = () => ({
  password: randPassword(),
});

export const createUser: DataCreator<ReturnType<typeof generateUser>, ReturnType<typeof generateUser>> = (
  overrides
) => {
  return { ...generateUser(), ...overrides };
};
