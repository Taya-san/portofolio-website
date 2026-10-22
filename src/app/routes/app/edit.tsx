import { Link, useParams } from 'react-router';
import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';
import { useProject } from '@/features/projects/api/get-project';
import { ProjectEditor } from '@/components/ui/edit-page';

const EditRoute = () => {
  const { projectId } = useParams();
  const projectQuery = useProject({ projectId: projectId as string });

  if (projectQuery.isPending) {
    return <p className="text-muted-foreground">Loading project...</p>;
  }

  if (projectQuery.isError) {
    return (
      <p className="text-destructive">Could not load this project... sadly</p>
    );
  }

  const project = projectQuery.data.data;

  return (
    <ProtectedRoute>
      <div className="flex w-full flex-col gap-6">
        <Link
          className="text-sm text-muted-foreground underline underline-offset-4"
          to={paths.app.project.getHref(projectId as string)}
        >
          Back to project
        </Link>

        <ProjectEditor
          id={project.id}
          title={project.title}
          body={project.body}
          visible={project.visible}
        />
      </div>
    </ProtectedRoute>
  );
};

export default EditRoute;
