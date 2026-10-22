import { EditorView } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import CodeMirror from '@uiw/react-codemirror';

import { editorTheme } from './editor-theme';

import type { Extension } from '@uiw/react-codemirror';

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  extensions?: Extension[];
};

export const Editor = ({
  value,
  onChange,
  ariaLabel,
  extensions,
}: EditorProps) => {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={editorTheme}
      extensions={[
        vim(),
        EditorView.contentAttributes.of({ 'aria-label': ariaLabel }),
        ...(extensions ?? []),
      ]}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        foldGutter: false,
        autocompletion: false,
        indentOnInput: true,
        tabSize: 2,
      }}
      height="32rem"
      placeholder={'# Project name\n\nWhat it does, why it exists…'}
      className="overflow-hidden rounded-md border"
    />
  );
};
