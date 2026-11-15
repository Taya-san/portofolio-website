import type { paths } from './api';

export type ApiRequest<
  Path extends keyof paths,
  Method extends keyof paths[Path],
  ContentType extends string = 'application/json',
> = paths[Path][Method] extends {
  requestBody?: {
    content: {
      [K in ContentType]: infer Body;
    };
  };
}
  ? Body
  : never;

export type ApiResponse<
  Path extends keyof paths,
  Method extends keyof paths[Path],
  Status extends number = 200,
  ContentType extends string = 'application/json',
> = paths[Path][Method] extends {
  responses: {
    [S in Status]: {
      content: {
        [K in ContentType]: infer Res;
      };
    };
  };
}
  ? Res
  : never;
