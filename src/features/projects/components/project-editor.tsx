import { Eye, EyeOff } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { paths } from '@/config/paths';
import { useUpdateProject } from '@/features/projects/api/update-project';

import { MarkdownView } from '@/components/markdown-viewer';
import { Button } from '@/components/ui/button/button';
import { Editor } from '@/components/ui/editor';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';

import type { CustomProject } from '@/types/api';

type ProjectEditorProps = {
  project: CustomProject;
};

/**
 * Mounted ONLY once the project has loaded (see edit.tsx), so useState can
 * safely initialise from the prop. Pass key={project.id} so navigating between
 * projects remounts this and re-initialises the state.
 *
 * Edits what the app OWNS: title, body, visible.
 * project_url is read-only — it is the join key to GitHub, so editing it
 * would orphan this override.
 */
export const ProjectEditor = ({ project }: ProjectEditorProps) => {
  const [title, setTitle] = useState(project.title);
  const [body, setBody] = useState(project.body);
  const [visible, setVisible] = useState(project.visible);

  const updateProject = useUpdateProject();

  const isDirty =
    title !== project.title ||
    body !== project.body ||
    visible !== project.visible;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProject.mutate({
      projectId: project.id,
      data: { title, body, visible },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      {/* ── header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          className="text-sm text-muted-foreground underline underline-offset-4"
          to={paths.app.project.getHref(project.id)}
        >
          Back to project
        </Link>

        <div className="flex items-center gap-3">
          {updateProject.isError && (
            <span className="text-sm text-destructive">Save failed.</span>
          )}
          {updateProject.isSuccess && !isDirty && (
            <span className="text-sm text-muted-foreground">Saved.</span>
          )}

          <Button type="submit" disabled={!isDirty || updateProject.isPending}>
            {updateProject.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>

      {/* ── metadata ── */}
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-64 flex-1 flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Visibility</span>
          <Toggle
            variant="outline"
            pressed={visible}
            onPressedChange={setVisible}
            aria-label="Show this project in the list"
          >
            {visible ? <Eye /> : <EyeOff />}
            {visible ? 'Visible' : 'Hidden'}
          </Toggle>
        </div>

        {/* GitHub owns this — read-only so the override key can't drift */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Repository</span>
          <a
            className="text-sm text-muted-foreground underline underline-offset-4"
            href={project.project_url}
            target="_blank"
            rel="noreferrer"
          >
            {project.project_url}
          </a>
        </div>
      </div>

      {/* ── the 2-pane editor ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Body</span>
          <Editor value={body} onChange={setBody} label="Markdown body" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Preview</span>
          <div className="typeset h-[32rem] overflow-auto rounded-md border bg-card p-4">
            <MarkdownView>{body}</MarkdownView>
          </div>
        </div>
      </div>
    </form>
  );
};
