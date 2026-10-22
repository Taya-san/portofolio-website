import { MarkdownView } from '@/components/ui/markdown-viewer';
import { Editor } from '@/components/ui/editor';
import { markdown } from '@codemirror/lang-markdown';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { useState } from 'react';

export type ProjectEditorProps = {
  title: string;
  body: string;
  visible: boolean;
};

export const ProjectEditor = ({ title, body, visible }: ProjectEditorProps) => {
  const [titleState, setTitleState] = useState(title);
  const [bodyState, setBodyState] = useState(body);
  const [visibleState, setVisibleState] = useState(visible);
  const visibilityId = useId();

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
        <MarkdownView>{bodyState}</MarkdownView>
      </div>
    </>
  );
};
