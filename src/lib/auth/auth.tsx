import { Navigate, useLocation } from 'react-router';

import { paths } from '@/config/paths';

import type { ReactNode } from 'react';

import { useUser } from './auth-utils';

export const AuthLoader = ({
  children,
  renderLoading,
}: {
  children: ReactNode;
  renderLoading: () => ReactNode;
}) => {
  const user = useUser();

  if (user.isPending) return renderLoading();
  if (user.isError) return <div>Something went wrong here</div>;

  return children;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
