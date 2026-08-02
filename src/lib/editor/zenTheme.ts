import { EditorView } from "@codemirror/view";

import {
  COUNT_GUTTER_REM,
  LINE_GAP_REM,
  RHYME_GUTTER_REM,
  WRAP_LEADING,
} from "@/lib/editor/constants";

/** Slightly tighter poetic gap when rulers and stress marks are off. */
const LINE_GAP_COMPACT_REM = 1.35;

export type ZenThemeOptions = {
  /** Reduce line gap when meter rulers + stress overlays are off. */
  compactLineGap?: boolean;
};

/** Font-size-dependent zen theme for the poem canvas. */
export function zenEditorTheme(
  fontSizeRem: number,
  options: ZenThemeOptions = {},
) {
  const lineGap = options.compactLineGap ? LINE_GAP_COMPACT_REM : LINE_GAP_REM;
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
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        cursor: "default",
      },
      ".cm-content": {
        caretColor: "var(--lyriic-ink)",
        /* Padding above/below the verse is not “text” — keep the arrow there
           so the header/footer overlays are not I-beam / flicker zones. */
        cursor: "default",
        paddingTop: "6rem",
        /* --lyriic-vv-bottom grows when the soft keyboard occludes the canvas. */
        paddingBottom: "calc(4rem + var(--lyriic-vv-bottom, 0px))",
        paddingLeft: "1.5rem",
        /* Keep in sync with .lyriic-count padding-right (index.css). */
        paddingRight: "1.5rem",
        maxWidth: "48rem",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100%",
        boxSizing: "border-box",
      },
      /* Poetic gap via padding — never margin. CM’s height map / posAtCoords
         ignore margins, so marginBottom makes hit-testing drift worse each line. */
      ".cm-line": {
        cursor: "text",
        /* Count gutter + rhyme-dot slot — em so it tracks editor font-size
           (overlay sizes gutters with the same constants × contentDOM.fontSize). */
        paddingRight: `${COUNT_GUTTER_REM + RHYME_GUTTER_REM}em`,
        paddingBottom: `${lineGap}rem`,
        letterSpacing: "0.01em",
      },
      ".cm-line:last-child": {
        paddingBottom: "0",
      },
      ".cm-content ::selection": {
        backgroundColor: "var(--lyriic-selection)",
      },
      "&.cm-focused .cm-selectionBackground": {
        backgroundColor: "var(--lyriic-selection)",
      },
      ".cm-selectionBackground": {
        backgroundColor: "var(--lyriic-selection)",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--lyriic-ink)",
      },
      ".cm-placeholder": {
        color: "var(--lyriic-subtle)",
        fontStyle: "normal",
      },
      ".lyriic-placeholder-primary": {
        color: "var(--lyriic-subtle)",
      },
      ".lyriic-placeholder-hint": {
        display: "inline-block",
        marginTop: "0.15em",
        fontSize: "0.72em",
        fontFamily: "var(--font-ui)",
        letterSpacing: "0.02em",
        color: "var(--lyriic-subtle-faint)",
        opacity: "1",
        verticalAlign: "baseline",
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
