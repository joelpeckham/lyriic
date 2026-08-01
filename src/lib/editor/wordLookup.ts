import { type Extension, Facet } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

import {
  resolveWordTarget,
  type WordTarget,
} from "@/lib/editor/resolveWordTarget";

export type WordLookupMode = "thesaurus" | "rhyme";

export type WordLookupRequest = WordTarget & {
  mode: WordLookupMode;
  /**
   * Syllable count for the resolved token, filled at open by PoemEditor when
   * metered line data is available (avoids a tokens.find in the popover).
   */
  tokenSyllables?: number;
};

export type WordLookupHandler = (request: WordLookupRequest) => void;

const wordLookupFacet = Facet.define<WordLookupHandler, WordLookupHandler | null>(
  {
    combine(handlers) {
      return handlers[handlers.length - 1] ?? null;
    },
  },
);

/** Open thesaurus/rhyme for the word at selection or an optional document pos. */
export function openWordLookup(
  view: EditorView,
  mode: WordLookupMode,
  pos?: number,
): boolean {
  const handler = view.state.facet(wordLookupFacet);
  if (!handler) return false;
  const target = resolveWordTarget(view, pos);
  if (!target) return false;
  handler({ ...target, mode });
  return true;
}

/** Open thesaurus for the word at the current selection / caret. */
export function openThesaurusCommand(view: EditorView): boolean {
  return openWordLookup(view, "thesaurus");
}

/** Open rhyme lookup for the word at the current selection / caret. */
export function openRhymeCommand(view: EditorView): boolean {
  return openWordLookup(view, "rhyme");
}

const wordLookupKeymap = keymap.of([
  {
    key: "Mod-'",
    run: openThesaurusCommand,
  },
  {
    key: "Mod-;",
    run: openRhymeCommand,
  },
]);

/**
 * Word-lookup bridge: Mod-' (thesaurus) / Mod-; (rhyme) → handler facet.
 * Long-press is handled by the shared pointer plugin in wordToolbar.
 */
export function wordLookupExtension(onOpen: WordLookupHandler): Extension {
  return [wordLookupFacet.of(onOpen), wordLookupKeymap];
}

/** Targeted in-place word replace (undoable via CM history). */
export function replaceWordRange(
  view: EditorView,
  from: number,
  to: number,
  insert: string,
): void {
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
    userEvent: "input.replace.wordLookup",
  });
  view.focus();
}
