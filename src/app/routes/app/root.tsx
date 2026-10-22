import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';

export const ErrorBoundary = () => <div>Something went wrong, idk why tho</div>;

const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
