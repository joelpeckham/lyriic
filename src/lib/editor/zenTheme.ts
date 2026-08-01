import { EditorView } from "@codemirror/view";

import {
  COUNT_GUTTER_REM,
  LINE_GAP_REM,
  WRAP_LEADING,
} from "@/lib/editor/constants";

/** Font-size-dependent zen theme for the poem canvas. */
export function zenEditorTheme(fontSizeRem: number) {
  return EditorView.theme(
    {
      "&": {
        height: "100%",
        fontSize: `${fontSizeRem}rem`,
        backgroundColor: "transparent",
        color: "var(--foreground)",
      },
      "&.cm-focused": {
        outline: "none",
      },
      ".cm-scroller": {
        fontFamily: "var(--font-editor), Georgia, serif",
        lineHeight: String(WRAP_LEADING),
        fontSize: "inherit",
        overflow: "auto",
        scrollbarGutter: "stable",
      },
      ".cm-content": {
        caretColor: "var(--lyriic-ink)",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        maxWidth: "48rem",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100%",
        boxSizing: "border-box",
      },
      ".cm-line": {
        paddingRight: `${COUNT_GUTTER_REM}rem`,
        marginBottom: `${LINE_GAP_REM}rem`,
        letterSpacing: "0.01em",
      },
      ".cm-line:last-child": {
        marginBottom: "0",
      },
      ".cm-content ::selection": {
        backgroundColor: "var(--lyriic-selection)",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--lyriic-ink)",
      },
      ".cm-placeholder": {
        color: "var(--lyriic-subtle-faint)",
        fontStyle: "normal",
      },
      /* Strip code-editor chrome */
      ".cm-gutters": {
        display: "none",
      },
      ".cm-activeLine": {
        backgroundColor: "transparent",
      },
    },
    { dark: false },
  );
}
