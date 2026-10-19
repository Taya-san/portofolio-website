import { Link, useParams } from 'react-router';

import { paths } from '@/config/paths';
import { useProject } from '@/features/projects/api/get-project';

import { Button } from '@/components/ui/button/button';

import { MarkdownView } from '@/components/markdown-viewer';

const ProjectRoute = () => {
  const { projectId } = useParams();
  const projectQuery = useProject({ projectId: projectId as string });

  if (projectQuery.isPending) {
    return <p className="text-muted-foreground">Loading project...</p>;
  }

  if (projectQuery.isError) {
    return <p className="text-destructive">Could not load this project.</p>;
  }

  const project = projectQuery.data.data;

  return (
    <article className="flex w-full flex-col gap-6">
      <div className="flex flex-row gap-6">
        <Link
          className="text-sm text-muted-foreground underline underline-offset-4"
          to={paths.app.dashboard.getHref()}
        >
          Back to projects
        </Link>

        <Button asChild>
          <Link
            className="text-sm text-foreground"
            to={paths.app.edit.getHref(`${projectId}`)}
          >
            Edit
          </Link>
        </Button>
      </div>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <a
          className="text-sm text-muted-foreground underline underline-offset-4"
          href={project.project_url}
          rel="noreferrer"
          target="_blank"
        >
          {project.project_url}
        </a>
      </header>

      <div className="typeset typeset-docs">
        <MarkdownView>
          {project.body}
        </MarkdownView>
      </div>
    </article>
  );
};

export default ProjectRoute;
