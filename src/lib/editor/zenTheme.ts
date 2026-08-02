import { EditorView } from "@codemirror/view";

import {
  CONTENT_PAD_BOTTOM_MARKS_EM,
  CONTENT_PAD_TOP_MARKS_EM,
  COUNT_GUTTER_REM,
  LINE_GAP_COMPACT_EM,
  LINE_GAP_EM,
  RHYME_GUTTER_REM,
  WRAP_LEADING,
} from "@/lib/editor/constants";

export type ZenThemeVariant = "zen" | "embed";

export type ZenThemeOptions = {
  /** Reduce line gap when meter rulers + stress overlays are off. */
  compactLineGap?: boolean;
  /**
   * `zen` — full-canvas padding for the main editor.
   * `embed` — compact padding for about-page / inline demos.
   */
  variant?: ZenThemeVariant;
};

/** Font-size-dependent zen theme for the poem canvas. */
export function zenEditorTheme(
  fontSizeRem: number,
  options: ZenThemeOptions = {},
) {
  const marksActive = !options.compactLineGap;
  const lineGap = marksActive ? LINE_GAP_EM : LINE_GAP_COMPACT_EM;
  const embed = options.variant === "embed";

  // Edge clearance for stress (top) / ticks (bottom). Content pad owns this so
  // last-line padding can stay 0 without clipping marks.
  const embedPadTop = marksActive ? `${CONTENT_PAD_TOP_MARKS_EM}em` : "0.35em";
  const embedPadBottom = marksActive
    ? `${CONTENT_PAD_BOTTOM_MARKS_EM}em`
    : "0.5em";
  const zenPadTop = `max(6rem, ${CONTENT_PAD_TOP_MARKS_EM}em)`;
  const zenPadBottom = `calc(max(4rem, ${CONTENT_PAD_BOTTOM_MARKS_EM}em) + var(--lyriic-vv-bottom, 0px))`;

  return EditorView.theme(
    {
      "&": {
        height: embed ? "auto" : "100%",
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
        overflow: embed ? "visible" : "auto",
        scrollbarGutter: embed ? "auto" : "stable",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        cursor: "default",
      },
      ".cm-content": {
        caretColor: "var(--lyriic-ink)",
        /* Padding above/below the verse is not “text” — keep the arrow there
           so the header/footer overlays are not I-beam / flicker zones. */
        cursor: "default",
        paddingTop: embed ? embedPadTop : zenPadTop,
        /* --lyriic-vv-bottom grows when the soft keyboard occludes the canvas. */
        paddingBottom: embed ? embedPadBottom : zenPadBottom,
        paddingLeft: embed ? "0" : "1.5rem",
        /* Keep in sync with .lyriic-count padding-right (index.css). */
        paddingRight: embed ? "0" : "1.5rem",
        maxWidth: embed ? "none" : "48rem",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: embed ? "0" : "100%",
        boxSizing: "border-box",
      },
      /* Poetic gap via padding — never margin. CM’s height map / posAtCoords
         ignore margins, so marginBottom makes hit-testing drift worse each line. */
      ".cm-line": {
        cursor: "text",
        /* Count gutter + rhyme-dot slot — em so it tracks editor font-size
           (overlay sizes gutters with the same constants × contentDOM.fontSize). */
        paddingRight: `${COUNT_GUTTER_REM + RHYME_GUTTER_REM}em`,
        marginLeft: "-0.25rem",
        paddingBottom: `${lineGap}em`,
        letterSpacing: "0.01em",
      },
      /* Edge mark clearance lives in content padding — not a second last-line gap. */
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
