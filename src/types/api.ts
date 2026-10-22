// temporarily manually made

export type BaseEntity = {
  id: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<unknown>;

export type CustomProject = Entity<{
  project_url: string;
  title: string;
  languages: string[];
  createdAt: string;
  visible: boolean;
  body: string;
}>;

export type AuthResponse = {
  jwt: string;
  user: User;
};
