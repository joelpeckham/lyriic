import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { type Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";

import { syllableOverlay } from "@/lib/editor/syllableOverlay";
import {
  wordLookupExtension,
  type WordLookupHandler,
} from "@/lib/editor/wordLookup";

export type PoemExtensionOptions = {
  onDocChange: (text: string) => void;
  onActiveLineChange: (lineIndex: number) => void;
  onOpenWordLookup?: WordLookupHandler;
};

/**
 * Minimal CodeMirror extensions for the lyriic poem canvas.
 * No language packages — plain text with soft wrap and zen chrome.
 * Font theme is supplied separately via a Compartment.
 */
export function createPoemExtensions({
  onDocChange,
  onActiveLineChange,
  onOpenWordLookup,
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
    ...(onOpenWordLookup ? [wordLookupExtension(onOpenWordLookup)] : []),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onDocChange(update.state.doc.toString());
      }
      if (update.selectionSet || update.docChanged) {
        const head = update.state.selection.main.head;
        const line = update.state.doc.lineAt(head);
        onActiveLineChange(line.number - 1);
      }
    }),
    EditorView.theme({
      ".cm-scroller": {
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
      },
    }),
  ];
}
