# Project editor

Rebased onto your current `v0` (`02c5560`) and adapted to **your** model:

```ts
CustomProject = { project_url, title, languages, createdAt, visible, body };
```

So the editor edits what the app **owns** — `title`, `body`, `visible` — and
shows `project_url` read-only, because it's the join key to GitHub.

---

## What this adds

| file                                                  | what                                                     |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `src/components/ui/editor.tsx`                        | **fills your empty file** — the only CodeMirror importer |
| `src/components/ui/editor-theme.ts`                   | CodeMirror theme, 13 token slots                         |
| `src/features/projects/components/project-editor.tsx` | the form + 2-pane editor                                 |
| `src/features/projects/api/update-project.ts`         | the save mutation                                        |
| `src/app/routes/app/edit.tsx`                         | placeholder → real editor                                |
| `src/testing/mocks/handlers/projects.ts`              | **+ PATCH handler + `persistDb`**                        |

## And one bug fix

```diff
- rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSanitize]}
+ rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
```

**Your code blocks currently render as plain text.** Verified:

```
[raw, highlight, sanitize]   →  hljs- spans: 0
[raw, sanitize, highlight]   →  hljs- spans: 2
```

**Why:** `rehype-highlight` _adds_ `class` attributes; `rehype-sanitize`
_removes_ attributes not in its allowlist.

```
the "*" fallback list (which applies to <span>)
  length: 63
  includes "className"?  false

<code>  → has its own entry [["className", {}]]  → class survives
<span>  → falls back to "*"                       → class STRIPPED
```

So `language-js` survived on the `<code>` but `hljs-keyword` was stripped from
every `<span>`. **Sanitize first, decorate second.**

---

## Install

Already added by this branch:

```bash
yarn add @uiw/react-codemirror @uiw/codemirror-themes @codemirror/view @replit/codemirror-vim
```

`@codemirror/view` is a **peer** dependency of the wrapper — yarn 1 doesn't
auto-install peers, and `editor.tsx` imports `EditorView` directly.

---

## The architecture

```
ProjectEditor          knows title / body / visible.
   |                   knows NOTHING about CodeMirror or markdown parsing.
   +-- Editor          the only CodeMirror importer
   |     +-- editorTheme
   |
   +-- MarkdownView    the only markdown importer (yours)
         +-- remark-gfm        GitHub syntax: tables, task lists, strikethrough
         +-- rehype-raw        allow raw HTML (READMEs use it constantly)
         +-- rehype-sanitize   strip anything dangerous
         +-- rehype-highlight  colour the code blocks
```

**`MarkdownView` serves both the editor preview and the public project page** —
one component, so they cannot diverge.

---

## Three patterns worth keeping

### 1. `key={project.id}` on the editor

```tsx
<ProjectEditor key={project.id} project={project} />
```

Navigating from editing project A to project B **remounts** the editor, so its
`useState(project.title)` re-initialises from B. Without the key, React reuses
the component and A's values stick around.

### 2. Guard, then render

```tsx
if (projectQuery.isPending) return <p>Loading...</p>;
if (projectQuery.isError) return <p>Could not load.</p>;

const project = projectQuery.data.data; // narrowed — no undefined
return <ProjectEditor project={project} />;
```

`useState(project.title)` can't live at the top of the route, because on the
first render there is no project. **Push the state into a child that only mounts
once the data exists.**

### 3. Invalidate by prefix

```ts
queryClient.invalidateQueries({ queryKey: getProjectsQueryOptions().queryKey });
// queryKey: ['projects']  matches  ['projects']  AND  ['projects', 'abc123']
```

One call refreshes the dashboard list **and** the single project page.

---

## The 2-pane layout

```
+--------------------------------------+--------------------------------------+
|  CodeMirror                          |  <MarkdownView>{body}</MarkdownView> |
|                                      |                                      |
|  - line numbers                      |  rendered with your Typeset base,    |
|  - vim keybindings                   |  so it matches the public page       |
|  - Ctrl+F / Ctrl+H search + replace  |                                      |
|  - auto-indent on Enter              |                                      |
+--------------------------------------+--------------------------------------+
```

`indentWithTab` is deliberately **false**. The wrapper defaults it to `true`,
which binds Tab to indentation and **traps keyboard focus in the editor**.
`indentOnInput: true` gives auto-indent on new lines without the trap.

---

## Testing checklist

| test                              | expect                              |
| --------------------------------- | ----------------------------------- |
| open `/app/edit/<id>`             | editor loads with line numbers      |
| type                              | preview updates live                |
| `dd` in normal mode               | vim deletes the line                |
| `i`, type, `Esc`, `u`             | vim undo works                      |
| Ctrl+F                            | CodeMirror search panel opens       |
| Ctrl+H                            | replace mode                        |
| **Tab**                           | **moves focus out** (not trapped)   |
| Enter after a list item           | auto-indents                        |
| edit, then reload                 | **saved** — `persistDb` did its job |
| check the dashboard               | the card reflects the edit          |
| open a different project's editor | **state resets** (`key`)            |

---

## The two things most likely to bite you

**1. Vim mode + the controlled value.** Vim mutates the document in ways the
React wrapper must keep up with. Test `dd` and `u` specifically — if the
wrapper's value sync fights vim, you'll see duplicated or reverted text
immediately.

**2. The theme.** `createTheme` uses CSS variables, but CodeMirror injects its
styles at runtime. If the editor looks unstyled, check that `theme` receives the
`Extension` from `createTheme` — the wrong shape silently falls back to the
default light theme.

---

## Two small things in your existing toolbar

Not part of this branch — just noticed while reading:

**1. `variant={'default'}` on the toggle groups.** From `toggle-utils.ts`:

```ts
default: 'bg-transparent',                                     // no border, no background
outline: 'border border-input bg-transparent hover:bg-muted',   // visible
```

So an unpressed item is just text. `variant="outline"` makes them look like
buttons.

**2. No guard in `onInteractOutside`.** Clicking your _own_ Filter/Sort buttons
counts as an outside interaction, so the panel closes and `interactPanel`
reopens it — remounting the content. If switching panels flickers, add:

```tsx
const buttonsRef = useRef<HTMLDivElement>(null);

onInteractOutside={(e) => {
  if (buttonsRef.current?.contains(e.target as Node)) {
    e.preventDefault();
    return;
  }
  interactedOutside.current = true;
}}
```

---

## Why a plain `<textarea>` was rejected

All four wanted features are CodeMirror-only:

| feature                    | textarea            | CodeMirror            |
| -------------------------- | ------------------- | --------------------- |
| vim keys                   | no                  | yes                   |
| line numbers               | no                  | yes                   |
| in-editor search & replace | browser Ctrl+F only | yes                   |
| tab / indent handling      | no                  | yes                   |
| bundle                     | 0                   | ~200-400 KB           |
| theming                    | inherits Tailwind   | **you write a theme** |

The theming is the only real cost, and it's 13 named slots — not 21 CSS
selectors.
