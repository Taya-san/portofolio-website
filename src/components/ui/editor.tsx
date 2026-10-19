import { EditorView } from '@codemirror/view';
import { vim } from '@replit/codemirror-vim';
import CodeMirror from '@uiw/react-codemirror';

import { editorTheme } from './editor-theme';

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
};

/**
 * The ONLY file that knows about CodeMirror.
 *
 * Consumers talk to this, not to CodeMirror — so swapping the editor (back to a
 * <Textarea>, or to raw @codemirror/view) is a change in one file.
 */
export const Editor = ({ value, onChange, label }: EditorProps) => {
  return (
    <CodeMirror
      value={value}
      onChange={(next) => onChange(next)}
      theme={editorTheme}
      extensions={[
        vim(),
        // puts aria-label on the contenteditable element, not the outer div
        EditorView.contentAttributes.of({ 'aria-label': label }),
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
      // false on purpose: true would trap the Tab key and block keyboard nav
      indentWithTab={false}
      height="32rem"
      placeholder={'# Project name\n\nWhat it does, why it exists…'}
      className="overflow-hidden rounded-md border"
    />
  );
};
