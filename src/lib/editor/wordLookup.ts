import { type Extension, Facet } from "@codemirror/state";
import {
  EditorView,
  keymap,
  type PluginValue,
  ViewPlugin,
} from "@codemirror/view";

import { wordAt } from "@/lib/editor/wordAt";

export type WordLookupMode = "thesaurus" | "rhyme";

export type WordLookupRequest = {
  mode: WordLookupMode;
  from: number;
  to: number;
  raw: string;
  word: string;
  lineIndex: number;
  /** Absolute start of the poetic line (for mapping token offsets). */
  lineFrom: number;
  /** Viewport coords for popover anchoring (from coordsAtPos). */
  anchor: { left: number; top: number; bottom: number; right: number };
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
  const sel = view.state.selection.main;
  const from = pos !== undefined ? pos : sel.from;
  const to = pos !== undefined ? pos : sel.to;
  const line = view.state.doc.lineAt(from);
  // Selection must stay on one line for word resolution.
  if (pos === undefined && to > line.to) return null;

  const resolved = wordAt(line.text, line.from, line.number - 1, from, to);
  if (!resolved) return null;

  // jsdom / offscreen: coordsAtPos may throw or return null — use a
  // degenerate anchor so open + replace still work in tests.
  let anchor = { left: 0, right: 0, top: 0, bottom: 0 };
  try {
    const start = view.coordsAtPos(resolved.from);
    const end = view.coordsAtPos(resolved.to);
    if (start && end) {
      anchor = {
        left: Math.min(start.left, end.left),
        right: Math.max(start.right, end.right),
        top: Math.min(start.top, end.top),
        bottom: Math.max(start.bottom, end.bottom),
      };
    }
  } catch {
    // keep degenerate anchor
  }

  return {
    mode,
    from: resolved.from,
    to: resolved.to,
    raw: resolved.raw,
    word: resolved.word,
    lineIndex: resolved.lineIndex,
    lineFrom: line.from,
    anchor,
  };
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

const thesaurusKeymap = keymap.of([
  {
    key: "Mod-'",
    run: openThesaurusCommand,
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
    this.startPos = pos;
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
 * Word-lookup bridge: Mod-' / long-press → handler facet.
 * Rhyme mode will reuse the same open path later (Phase 4.5).
 */
export function wordLookupExtension(onOpen: WordLookupHandler): Extension {
  return [wordLookupFacet.of(onOpen), thesaurusKeymap, longPressPlugin];
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
    userEvent: "input.replace.thesaurus",
  });
  view.focus();
}
