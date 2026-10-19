import { useParams } from 'react-router';

import { useProject } from '@/features/projects/api/get-project';
import { ProjectEditor } from '@/features/projects/components/project-editor';

import { ProtectedRoute } from '@/lib/auth';

const EditRoute = () => {
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
    <ProtectedRoute>
      {/*
        key={project.id} → navigating between projects REMOUNTS the editor,
        so its useState re-initialises from the new project instead of
        keeping the previous one's values.
      */}
      <ProjectEditor key={project.id} project={project} />
    </ProtectedRoute>
  );
};

export default EditRoute;
