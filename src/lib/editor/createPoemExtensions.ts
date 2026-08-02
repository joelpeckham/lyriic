import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { Annotation, type Extension } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  keymap,
  placeholder,
} from "@codemirror/view";

import { syllableOverlay } from "@/lib/editor/syllableOverlay";
import {
  wordInteractionExtension,
  type WordInteractionHandlers,
} from "@/lib/editor/wordInteraction";

/** Marks a full-doc replace driven by the React `value` prop (not user typing). */
export const externalValueSync = Annotation.define<boolean>();

export type PoemExtensionOptions = {
  onDocChange: (text: string, info: { userEdit: boolean }) => void;
  onActiveLineChange: (lineIndex: number) => void;
  onWordInteraction?: WordInteractionHandlers;
};

/** Device-aware secondary empty-state hint (hover vs tap). */
function toolsPlaceholderHint(): string {
  if (typeof window === "undefined") return "tap a word for tools";
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return fine ? "hover a word for tools" : "tap a word for tools";
}

/**
 * Minimal CodeMirror extensions for the lyriic poem canvas.
 * No language packages — plain text with soft wrap and zen chrome.
 * Font theme is supplied separately via a Compartment.
 */
export function createPoemExtensions({
  onDocChange,
  onActiveLineChange,
  onWordInteraction,
}: PoemExtensionOptions): Extension[] {
  const toolsHint = toolsPlaceholderHint();
  return [
    history(),
    // Drawn caret/selection: Firefox parks the native caret at the top of tall
    // empty line boxes (WRAP_LEADING), so it floats above the placeholder.
    drawSelection(),
    EditorView.lineWrapping,
    placeholder(() => {
      const el = document.createElement("span");
      el.className = "lyriic-placeholder";
      const primary = document.createElement("span");
      primary.className = "lyriic-placeholder-primary";
      primary.textContent = "Write a line…";
      const hint = document.createElement("span");
      hint.className = "lyriic-placeholder-hint";
      hint.textContent = toolsHint;
      el.append(primary, document.createElement("br"), hint);
      return el;
    }),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    EditorView.editorAttributes.of({
      class: "lyriic-poem",
      role: "group",
      "aria-label": "Poem editor",
    }),
    EditorView.contentAttributes.of({
      spellcheck: "true",
      "aria-label": "Poem",
      "aria-multiline": "true",
      "aria-placeholder": `Write a line… ${toolsHint}`,
      autocapitalize: "sentences",
      autocorrect: "on",
      enterkeyhint: "enter",
    }),
    syllableOverlay,
    ...(onWordInteraction
      ? [wordInteractionExtension(onWordInteraction)]
      : []),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const userEdit = !update.transactions.some((tr) =>
          tr.annotation(externalValueSync),
        );
        onDocChange(update.state.doc.toString(), { userEdit });
      }
      if (update.selectionSet || update.docChanged) {
        const head = update.state.selection.main.head;
        const line = update.state.doc.lineAt(head);
        onActiveLineChange(line.number - 1);
      }
    }),
  ];
}
