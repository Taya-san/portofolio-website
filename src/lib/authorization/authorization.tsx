import { useAuthorization } from './authorization-utils';

import type { ReactNode } from 'react';

type AuthorizationProps = {
  forbiddenFallback?: ReactNode;
  children: ReactNode;
};

export const Authorization = ({
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess();

  return <>{canAccess ? children : forbiddenFallback}</>;
};
