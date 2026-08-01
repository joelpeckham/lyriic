import { type Extension, Facet } from "@codemirror/state";
import {
  EditorView,
  keymap,
  type PluginValue,
  ViewPlugin,
} from "@codemirror/view";

import {
  resolveWordTarget,
  type WordTarget,
} from "@/lib/editor/resolveWordTarget";

export type WordLookupMode = "thesaurus" | "rhyme";

export type WordLookupRequest = WordTarget & {
  mode: WordLookupMode;
};

export type WordLookupHandler = (request: WordLookupRequest) => void;

const wordLookupFacet = Facet.define<WordLookupHandler, WordLookupHandler | null>(
  {
    combine(handlers) {
      return handlers[handlers.length - 1] ?? null;
    },
  },
);

const LONG_PRESS_MS = 500;
const MOVE_CANCEL_PX = 8;

function resolveRequest(
  view: EditorView,
  mode: WordLookupMode,
  pos?: number,
): WordLookupRequest | null {
  const target = resolveWordTarget(view, pos);
  if (!target) return null;
  return { ...target, mode };
}

function openLookup(view: EditorView, mode: WordLookupMode, pos?: number): boolean {
  const handler = view.state.facet(wordLookupFacet);
  if (!handler) return false;
  const request = resolveRequest(view, mode, pos);
  if (!request) return false;
  handler(request);
  return true;
}

/** Open thesaurus for the word at the current selection / caret. */
export function openThesaurusCommand(view: EditorView): boolean {
  return openLookup(view, "thesaurus");
}

/** Open rhyme lookup for the word at the current selection / caret. */
export function openRhymeCommand(view: EditorView): boolean {
  return openLookup(view, "rhyme");
}

/** Build a lookup request from an existing word target + mode. */
export function lookupRequestFromTarget(
  target: WordTarget,
  mode: WordLookupMode,
): WordLookupRequest {
  return { ...target, mode };
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

class LongPressPlugin implements PluginValue {
  private timer: number | null = null;
  private startX = 0;
  private startY = 0;
  private startPos: number | null = null;
  private view: EditorView;

  constructor(view: EditorView) {
    this.view = view;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    view.dom.addEventListener("pointerdown", this.onPointerDown);
    view.dom.addEventListener("pointermove", this.onPointerMove);
    view.dom.addEventListener("pointerup", this.onPointerUp);
    view.dom.addEventListener("pointercancel", this.onPointerCancel);
  }

  destroy(): void {
    this.clearTimer();
    this.view.dom.removeEventListener("pointerdown", this.onPointerDown);
    this.view.dom.removeEventListener("pointermove", this.onPointerMove);
    this.view.dom.removeEventListener("pointerup", this.onPointerUp);
    this.view.dom.removeEventListener("pointercancel", this.onPointerCancel);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.startPos = null;
  }

  private onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY });
    if (pos === null) return;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.clearTimer();
    this.startPos = pos;
    this.timer = window.setTimeout(() => {
      const heldPos = this.startPos;
      this.clearTimer();
      if (heldPos === null) return;
      openLookup(this.view, "thesaurus", heldPos);
    }, LONG_PRESS_MS);
  }

  private onPointerMove(event: PointerEvent): void {
    if (this.timer === null) return;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    if (dx * dx + dy * dy > MOVE_CANCEL_PX * MOVE_CANCEL_PX) {
      this.clearTimer();
    }
  }

  private onPointerUp(): void {
    this.clearTimer();
  }

  private onPointerCancel(): void {
    this.clearTimer();
  }
}

const longPressPlugin = ViewPlugin.fromClass(LongPressPlugin);

/**
 * Word-lookup bridge: Mod-' (thesaurus) / Mod-; (rhyme) / long-press (thesaurus)
 * → handler facet.
 */
export function wordLookupExtension(onOpen: WordLookupHandler): Extension {
  return [wordLookupFacet.of(onOpen), wordLookupKeymap, longPressPlugin];
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
