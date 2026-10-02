import Cookies from 'js-cookie';
import { delay } from 'msw';

import { db } from './db'

import type { User } from '@/types/api'

type RawUser = User & {'password'?: string, 'iat'?: unknown}

export const encode = (obj: object): string => {
  const btoa =
    typeof window === 'undefined'
      ? (str: string) => Buffer.from(str, 'binary').toString('base64')
      : window.btoa;
  return btoa(JSON.stringify(obj));
};

export const decode = (str: string): object => {
  const atob =
    typeof window === 'undefined'
      ? (str: string) => Buffer.from(str, 'base64').toString('binary')
      : window.atob;
  return JSON.parse(atob(str));
};

export const hash = (str: string): string => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  };

  return String(hash >>> 0)
};

export const networkDelay = (): Promise<void> => {
  const delayTime = import.meta.env.TEST
    ? 300
    : Math.floor(Math.random() * 700) + 300;
  return delay(delayTime);
};

const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key as K];
  };

  return result as Omit<T, K>;
}

export const sanitizeUser = <O extends RawUser>(user: O): User => {
  return omit(user, ['password', 'iat']) as User;
}

export const authenticate = ({ password }: { password: string }): { user: User, jwt: string } => {
  const matchedUser = db.user.findFirst({
    where: {
      password: {
        equals: hash(password),
      },
    },
  });

  if (matchedUser) {
    const sanitizedUser = sanitizeUser(matchedUser);
    const encodedToken = encode(sanitizedUser);
    return { user: sanitizedUser, jwt: encodedToken };
  };

  const error = new Error('Invalid password');
  throw error;
}

export const AUTH_COOKIE = `my_portofolio_website_hehe`;

export const requireAuth = (cookies: Record<string, string> = {}): { error?: string, user: User | null } => {
  try {
    const encodedToken = cookies[AUTH_COOKIE] || Cookies.get(AUTH_COOKIE);
    if (!encodedToken) {
      return { error: 'Unauthorized', user: null };
    };
    const decodedToken = decode(encodedToken) as { id: string };

    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      return { error: 'Unauthorized', user: null };
    };
    return { user: sanitizeUser(user) }
  } catch {
    return { error: 'Unauthorized', user: null}
  }
}
