import { Link, useParams } from 'react-router';

import { paths } from '@/config/paths';

const EditRoute = () => {
  const { projectId } = useParams();

  return (
    <div className="flex w-full flex-col gap-6">
      <Link
        className="text-sm text-muted-foreground underline underline-offset-4"
        to={paths.app.project.getHref(projectId as string)}
      >
        Back to project
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>

      <p className="text-sm text-muted-foreground">
        The editor goes here. The route already knows which project it is:
        <code className="ml-1 rounded bg-muted px-1.5 py-0.5">{projectId}</code>
      </p>
    </div>
  );
};

export default EditRoute;
