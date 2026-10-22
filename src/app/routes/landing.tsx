import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

const LandingRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
        <p className="mt-3 text-muted-foreground">
          Projects, experiments, and things I build.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild>
          <Link to={paths.app.dashboard.getHref()}>Enter</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={paths.auth.login.getHref()}>Admin login</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingRoute;
