import { Link } from 'react-router';

const NotFoundRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">That page does not exist.</p>
      <Link className="text-sm underline underline-offset-4" to="/">
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundRoute;
