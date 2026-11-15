import { MarkdownView } from '@/components/ui/markdown-viewer';
import { Editor } from '@/components/ui/editor';
import { markdown } from '@codemirror/lang-markdown';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateProject } from '@/features/projects/api/update-projects';
import type { ApiRequest } from '@/types/api-helper';

export type ProjectEditorProps = ApiRequest<'/edit/{id}', 'put'> & {
  id: string;
};

export const ProjectEditor = ({
  id,
  project_url,
  createdAt,
  title,
  description,
  languages,
  visible,
  body,
}: ProjectEditorProps) => {
  const [projectURLState, setProjectURLState] = useState(project_url);
  // const [createdAtState, setCreatedAtState] = useState(createdAt);
  const [createdAtState] = useState(createdAt);
  const [titleState, setTitleState] = useState(title);
  const [descriptionState, setDescriptionState] = useState(description);
  // const [languagesState, setLangugagesState] = useState(languages);
  const [languagesState] = useState(languages);
  const [visibleState, setVisibleState] = useState(visible);
  const [bodyState, setBodyState] = useState(body ?? '');
  const [saved, setSaved] = useState({
    project_url,
    createdAt,
    title,
    description,
    languages,
    visible,
    body,
  });

  const visibilityId = useId();

  const updateProject = useUpdateProject({
    mutationConfig: {
      onSuccess: (response) => {
        setSaved({
          project_url: response.project_url,
          createdAt: response.createdAt,
          title: response.title,
          description: response.description,
          languages: response.languages,
          visible: response.visible,
          body: response.body,
        });
      },
    },
  });

  const saveHandler = () => {
    updateProject.mutate({
      id: id,
      data: {
        project_url: projectURLState,
        createdAt: createdAtState,
        title: titleState,
        description: descriptionState,
        languages: languagesState,
        visible: visibleState,
        body: bodyState,
      },
    });
  };

  const isDirty =
    projectURLState !== saved.project_url ||
    createdAtState !== saved.createdAt ||
    titleState !== saved.title ||
    descriptionState !== saved.description ||
    languagesState !== saved.languages ||
    visibleState !== saved.visible ||
    bodyState !== saved.body;

  return (
    <>
      <input
        className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50 focus-visible:underline focus-visible:underline-offset-4"
        value={titleState}
        onChange={(event) => setTitleState(event.target.value)}
        placeholder="Hey name your project here man!"
        aria-label="Project title"
      />

      <input
        className="w-full border-none bg-transparent p-0 text-xl font-semibold tracking-tight text-muted-foreground/70 outline-none focus-visible:underline focus-visible:underline-offset-4"
        spellCheck={false}
        value={projectURLState}
        onChange={(event) => setProjectURLState(event.target.value)}
        placeholder="Hey name your project URL here man!"
        aria-label="Project URL"
      />

      <Label id={visibilityId}>Visibility</Label>
      <Switch
        checked={visibleState}
        onCheckedChange={setVisibleState}
        aria-labelledby={visibilityId}
      />

      <input
        className="w-full border-none bg-transparent p-0 text-base font-semibold tracking-tight outline-none focus-visible:underline focus-visible:underline-offset-4"
        spellCheck={false}
        value={descriptionState}
        onChange={(event) => setDescriptionState(event.target.value)}
        placeholder="Hey name your project description here man!"
        aria-label="Project description"
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
