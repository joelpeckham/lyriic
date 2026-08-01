import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { Annotation, type Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";

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
  return [
    history(),
    // Native browser selection (text-shaped) rather than CM's full-width blocks.
    EditorView.lineWrapping,
    placeholder("Write a line…"),
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
