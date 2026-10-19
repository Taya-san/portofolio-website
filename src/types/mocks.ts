export type User = {
  password: string;
};

export type CustomProject = {
  project_url: string;
  title: string;
  languages: string[];
  createdAt: string;
  visible: boolean;
  body: string;
};
