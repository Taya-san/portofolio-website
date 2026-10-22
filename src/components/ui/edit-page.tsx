import { MarkdownView } from '@/components/ui/markdown-viewer';
import { Editor } from '@/components/ui/editor';
import { markdown } from '@codemirror/lang-markdown';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateProject } from '@/features/projects/api/update-projects';
import type { CustomProject } from '@/types/api';

export type ProjectEditorProps = Partial<CustomProject> &
  Pick<CustomProject, 'id'>;

export const ProjectEditor = ({
  id,
  title,
  body,
  visible,
}: ProjectEditorProps) => {
  const [titleState, setTitleState] = useState(title);
  const [bodyState, setBodyState] = useState(body ?? '');
  const [visibleState, setVisibleState] = useState(visible);
  const [saved, setSaved] = useState({ title, body, visible });

  const visibilityId = useId();

  const updateProject = useUpdateProject({
    mutationConfig: {
      onSuccess: (response) => {
        setSaved({
          title: response.data.title,
          body: response.data.body,
          visible: response.data.visible,
        });
      },
    },
  });

  const saveHandler = () => {
    updateProject.mutate({
      data: {
        id,
        title: titleState,
        body: bodyState,
        visible: visibleState,
      },
    });
  };

  const isDirty =
    titleState !== saved.title ||
    bodyState !== saved.body ||
    visibleState !== saved.visible;

  return (
    <>
      <input
        className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50 focus-visible:underline focus-visible:underline-offset-4"
        value={titleState}
        onChange={(event) => setTitleState(event.target.value)}
        placeholder="Hey name your project here man!"
        aria-label="Project title"
      />

      <Label id={visibilityId}>Visibility</Label>
      <Switch
        checked={visibleState}
        onCheckedChange={setVisibleState}
        aria-labelledby={visibilityId}
      />

      <div className="grid grid-cols-2">
        <Editor
          value={bodyState}
          onChange={setBodyState}
          ariaLabel="Markdown body"
          extensions={[markdown()]}
        />
        <div className="typeset typset-docs h-128 overflow-y-auto">
          <MarkdownView>{bodyState}</MarkdownView>
        </div>
      </div>

      <div className="flex w-full flex-row gap-4">
        <Button
          onClick={saveHandler}
          disabled={!isDirty || updateProject.isPending}
        >
          Save
        </Button>
      </div>
    </>
  );
};
