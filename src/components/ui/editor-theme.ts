import { createTheme } from '@uiw/codemirror-themes';

/**
 * CodeMirror injects its own CSS, so its default look will not match the app.
 * createTheme replaces CodeMirror's ~21 internal CSS selectors with 13 named
 * slots — all mapped to theme tokens, so dark mode and the palette apply.
 */
export const editorTheme = createTheme({
  theme: 'dark',
  settings: {
    background: 'var(--card)',
    foreground: 'var(--foreground)',
    caret: 'var(--foreground)',
    selection: 'color-mix(in oklab, var(--primary) 30%, transparent)',
    selectionMatch: 'color-mix(in oklab, var(--primary) 20%, transparent)',
    lineHighlight: 'color-mix(in oklab, var(--accent) 50%, transparent)',
    gutterBackground: 'var(--muted)',
    gutterForeground: 'var(--muted-foreground)',
    gutterActiveForeground: 'var(--accent-foreground)',
    gutterBorder: 'var(--border)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
  },
  // No syntax colours on purpose — the preview pane next to it does that job.
  styles: [],
});
